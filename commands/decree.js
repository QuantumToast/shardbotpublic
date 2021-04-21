/*
    To do

add decrees to operations
 - Tourist 
*/
const { MessageCollector, MessageEmbed} = require("discord.js");
const searchModule = require('../structures/search');
const mapModule = require('./maps');
const leaderboardModule = require('./leaderboard.js')
const { politicschannel } = require('../config');

const icon = '⚖️'

const decreeList = ['PR Campaign',"Curfew",'Tribute','Corruption','Lockdown','Tourist Destination','Stable']
const decrees = {
    ["Curfew"]: {
        ["name"]:"Curfew",
        ['type']: "Hero",
        ["repcost"]: 10000,
        ["info"]: "Heros get 2x bonus to first initiative against villains.",
        ['flavor']: "Spotting villains is a lot easier when the streets are empty.",
    },

    ["PR Campaign"]: {
        ["name"]: "PR Campaign",
        ["type"]: "Hero",
        ["repcost"]: 25000,
        ["info"]: "Heroic operations suffer halved reputation losses, villainous operations suffer double.",
        ["flavor"]: "A competent PR team can spin anything into a positive."
    },
    
    ["Tribute"]: {
        ["name"]:"Tribute",
        ['type']: "Villain",
        ["repcost"]: 25000,
        ["info"]: "Villain operations give the leader 5% of their profits.",
        ['flavor']: "Force weaker teams on your turf to give you a share of their earnings.",
    },
    ["Corruption"]: {
        ["name"]:"Corruption",
        ['type']: "Villain",
        ["repcost"]: 10000,
        ["info"]: "Villains with HQs in this district recover from failed operations twice as fast.",
        ['flavor']: "A bit of money in the right hands goes a long way in assuring the best medical care out there.",
    },
    ["Lockdown"]: {
        ["name"]:"Lockdown",
        ['type']: "Neutral",
        ["repcost"]: 10000,
        ["info"]: "Foreign teams take twice as long to operate.",
        ['flavor']: "Blocks access to the subway system, bridges and even ferries throughout the district.",
    },
    ["Tourist Destination"]: {
        ["name"]:"Tourist Destination",
        ['type']: "Neutral",
        ["repcost"]: 10000,
        ["info"]: "Foreign teams gain 20% extra funds and reputation. Home teams lose 20% profits.",
        ['flavor']: "Everyone loves watching new capes face off, some just get stale after awhile.",
    },


    ["Stable"]: {
        ["name"]:"Stable",
        ['type']: "Neutral",
        ["repcost"]: 0,
        ["info"]: "End's the current decree.",
        ['flavor']: "Stable, but for how long?",
    }

}
const districts= ["Bronx","Manhattan","Queens","Brooklyn","Staten Island"]

async function setDecree(client,message,args,teamData,mapData){
    var ownedDistricts = []

    for (let dist of districts){
        if (mapData[dist].holderid == teamData.userid){
            ownedDistricts.push(dist)
        }
    }
    if (ownedDistricts.length < 1){
        message.reply("You must have the highest authority rating in a district to make a decree.");
        return;
    }
    var conCat = args.join(" ")

    var offset = 0;
    var stringResults = searchModule.fillStrings(conCat,districts)
    var district = ownedDistricts[0];
    if (stringResults[1] > 3){
        offset = stringResults[1]
        district = stringResults[0][0]
    }
    if (!ownedDistricts.includes(district)){
        message.reply(`You do not control ${district}.`);
        return;
    }

    var decreeResults = searchModule.fillStrings(conCat.substring(offset),decreeList)
    if (decreeResults[0][0]){
        var myDecree = decrees[decreeResults[0][0]];

        // checking rep allowance
        if (myDecree.type == "Villain" && teamData.reputation > 0){
            message.reply("You can not implement villainous decrees with positive reputation.");
            return;
        }
        if (myDecree.type == "Hero" && teamData.reputation < 0){
            message.reply("You can not implement heroic decrees with negative reputation.");
            return;
        }

        //checking for heroic costs
        if (teamData.reputation >= 0 && teamData.reputation - myDecree.repcost < 0){
            message.reply("You do not have enough positive reputation to enact this decree.")
            return;
        }
        
        //checking for villain costs
        if (teamData.reputation < 0 && teamData.reputation + myDecree.repcost > 0){
            message.reply("You do not have enough negative reputation to enact this decree.");
            return;
        }


        const offer = await message.channel.send(`Respond with ${icon} to enact the ${myDecree.name} in ${district}: ${myDecree.info}`);

        offer.react(icon);  
        const filter = (reaction, user) => {
            return reaction.emoji.name === icon && user.id === message.author.id;
        };
        
        offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
        .then( async collected =>  {
            teamData = await client.teamsDB.get(`${message.author.id}`, null);
             //checking for heroic costs
            if (teamData.reputation >= 0 && teamData.reputation - myDecree.repcost < 0){
                message.reply("You do not have enough positive reputation to enact this decree.");
                return;
            }
            
            //checking for villain costs
            if (teamData.reputation < 0 && teamData.reputation + myDecree.repcost > 0){
                message.reply("You do not have enough negative reputation to enact this decree.");
                return;
            }


            //in case they lost authority in between the 5m timer
            const changeResult = await mapModule.setDecree(client,teamData,district,myDecree.name)

            if (!changeResult){
                message.reply("You no longer own the district or that decree is aleady in place.");
                return;
            }
            //taking rep
            if (teamData.reputation < 0){
                teamData.reputation+=myDecree.repcost
            }
            if (teamData.reputation > 0){
                teamData.reputation -= myDecree.repcost;
            }
            const channel = await client.channels.cache.get(politicschannel);

            channel.send(
                `${icon}**NEW DECREE**${icon}\n📰 ${teamData.name} has enacted ${myDecree.name} in ${district}:\n${myDecree.info}\n*${myDecree.flavor}*`
            )

            if (myDecree.name == "Tribute"){
                message.channel.send("You will collect your income when you complete missions.")
            }

            await client.teamsDB.set(`${message.author.id}`,teamData);
            leaderboardModule.update(client,teamData);


        })
        .catch(collected => {
            message.reply('You have not responded in time.');
        });


        
    }else{
        message.reply("Could not identify decree.");
        return;
    }
    
}

module.exports.run = async (client, message, args) =>{

    var teamData = await client.teamsDB.get(`${message.author.id}`, null);
    if (!teamData){
        message.reply("You have no data. Use `start` command to begin!");
        return
    }
    
    var mapData = await mapModule.returnMapData(client);
    

    if (args[0]){
        setDecree(client,message,args,teamData,mapData);
        return;
    }

    var ownedDistricts = []

    for (let dist of districts){
        if (mapData[dist].holderid == teamData.userid){
            if (mapData[dist]['decree']){
                ownedDistricts.push(dist+`: ${mapData[dist]['decree']}`)
            }else{
                ownedDistricts.push(dist)
            }
        }
    }

    var display = new MessageEmbed()
    .setColor(teamData.preferences.color)
    .setAuthor(`${icon} District Decrees`)
    .setFooter(",decree [optional district] [decree name] ")
    
    if (ownedDistricts.length < 1){
        display.addField("**Controlled Districts**","You are not in control of any districts." )
    }else{
        display.addField("**Controlled Districts**",ownedDistricts.join("\n") )
    }
    
    var heroDecrees = "";
    var villainDecrees = "";
    var neutralDecrees = "";

    for (let decree of decreeList){
        var info = `**${decree}** (${decrees[decree].repcost} Rep)\n${decrees[decree].info}\n*${decrees[decree].flavor}*\n`
        
        if (decrees[decree].type == "Hero"){
            heroDecrees+= info;
        }
        else if (decrees[decree].type == "Villain"){
            villainDecrees+= info;
        }
        else if (decrees[decree].type == "Neutral"){
            neutralDecrees+= info;
        }
    }

    if (teamData.reputation>0){
        display.addField("🏅 **Heroic Decrees**",heroDecrees);
    }else{
        display.addField("☠️ **Villainous Decrees**",villainDecrees);
    }
    display.addField("**Neutral Decrees**",neutralDecrees);

    message.reply(display)
}

module.exports.help = {
    name: "decree",
    description: "Implement district wide policies on areas you control.",
}

module.exports.getDecreeInfo = (decree)=>{
    return(decrees[decree].info)
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}

