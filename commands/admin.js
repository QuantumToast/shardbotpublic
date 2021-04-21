const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const leaderboardModule = require('./leaderboard.js')

//modules
const capeModule = require(`${filePath}/cape.js`)
const customModule = require("../chargen/customs.js");
const searchModule = require('../structures/search');
const armoryModule = require('../structures/armory.js');
const levelModule = require('../structures/level.js');

const { arch } = require('os');

var currentDate = null;
var database = null;

const changeableTeamStats = ['reputation','funds']
const changeableCapeStats = [ //note that these are all strings
    'name','alias','age',
    'vitality','strength','technique','control','utility',
    

    //special ones: 
    //'power',
    'level',
    'subclass',//subclass is under the .power of cape

]

async function changeCapeData(client,message,args,exampleData,capeid,cutOff){
    let argConcat = args.join(" ");

    var teamData = await client.teamsDB.get(exampleData.userid,0);
    if (teamData == 0){
        return;
    }

    var compiledList = [...teamData.capes]
    if (teamData['reservedcapes']){
        compiledList = [...teamData.capes, ...teamData.reservedcapes]
    }

    var myCape = null;
    for (let cape of compiledList){
        if (cape.id == capeid){
            myCape = cape;
        }
    }
    if (!myCape){
        console.log('no capes!')
        return;
    }

    var nextCmdResults = searchModule.fillStrings(argConcat.substring(cutOff),changeableCapeStats)
    var nextCmd = nextCmdResults[0][0]
    cutOff+=nextCmdResults[1]

    var changedStat = "";
    var changedValue = null

    if (!changeableCapeStats.includes(nextCmd)){
        console.log('bad cmd')
        return;
    }
    changedStat = nextCmd

    if (!changedValue){
        changedValue = (argConcat.substring(cutOff).trim(" ")) || null
    }  


    const offer = await message.channel.send(`Change ${myCape.name} ${changedStat} from ${myCape[changedStat] || "blank"} to ${changedValue} ?`);

    offer.react("📝");  
    const filter = (reaction, user) => {
        return reaction.emoji.name === '📝' && user.id === message.author.id;
    };
    
    offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {
        teamData = await client.teamsDB.get(`${teamData.userid}`, 0);
        if (teamData == 0){
            message.reply("no Data, the fuck man");
            return;
        }
        var newCape = null;
        compiledList = [...teamData.capes]
        if (teamData['reservedcapes']){
            compiledList = [...teamData.capes, ...teamData.reservedcapes]
        }
        for (let cape of compiledList){
            if (cape.id == myCape.id){
                newCape = cape;
            }
        }
        var oldStat = newCape[changedStat]

        if (changedStat == 'level'){
            if (Number(changedValue) < Number(newCape.level)){
                newCape.level = changedValue;
            }else{
                levelModule.forceLevelUp(newCape,changedValue);
            }
        }else if (changedStat!='subclass'){
            newCape[changedStat] = changedValue;
        } 
        else{
            newCape.power['subclass'] = changedValue;
        }

        await client.teamsDB.set(`${teamData.userid}`, teamData);
        message.channel.send(`Changed ${newCape.name} ${changedStat}: ${oldStat || "blank"} ➡️ ${changedValue} `)
    })
    .catch(collected => {
        message.reply('You have not responded in time.');
    });
}
async function changeTeamData(client,message,args,exampleData,cutOff){
    let argConcat = args.join(" ");

    var teamData = await client.teamsDB.get(exampleData.userid,0);
    if (teamData == 0){
        return;
    }
    var nextCmdResults = searchModule.fillStrings(argConcat.substring(cutOff),changeableTeamStats)
    var nextCmd = nextCmdResults[0][0]
    cutOff+=nextCmdResults[1]

    var changedStat = "";
    var changedValue = null


    if (!changeableTeamStats.includes(nextCmd)){
        console.log('bad cmd')
        return;
    }
    changedStat = nextCmd

    if (!changedValue){
        changedValue = parseInt(argConcat.substring(cutOff).trim(" ")) || null
    }

    const offer = await message.channel.send(`Change ${teamData.name} ${changedStat} from ${teamData[changedStat]} to ${changedValue} ?`);

    offer.react("📝");  
    const filter = (reaction, user) => {
        return reaction.emoji.name === '📝' && user.id === message.author.id;
    };
    
    offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {
        teamData = await client.teamsDB.get(`${teamData.userid}`, 0);
        if (teamData == 0){
            message.reply("no Data, the fuck man");
            return;
        }
        var oldStat = teamData[changedStat]
        teamData[changedStat] = changedValue;
        await client.teamsDB.set(`${teamData.userid}`, teamData);
        message.channel.send(`Changed ${teamData.name} ${changedStat}: ${oldStat} ➡️ ${changedValue} `)
        leaderboardModule.update(client,teamData);
    })
    .catch(collected => {
        message.reply('You have not responded in time.');
    });
}

async function giveCustom (client,message,args,teamData){
    var customCape = customModule.grabCape(args[2],args[3]);
    if (customCape){
        customCape.id = teamData.nextid;
        teamData.capes.push(customCape);
        teamData.nextid++;
        await client.teamsDB.set(teamData.userid,teamData);
    }else{
        console.log("No cape!")
    }

}

const basePrices = {
    ["Scrap Tech"]: 200,
    ["Market"]: 500,
    ["Expensive"]: 1000,
    ["Fortune"]: 2500,
    ["Tinker Tech"]: 5000,
    ["Premium Tech"]: 10000,
}

async function revampItems(client,message,args){
    var database = await client.teamsDB.getAll();

    for (let keyedPair of database){
        var teamData = await client.teamsDB.get(keyedPair['key'],null);

        if (!teamData || keyedPair.value == 0 ){
            continue;
        }


        if (teamData.capes){
            for (let cape of teamData.capes){
                if (cape['weapon']){
                    cape['weapon']= "";
                }
                if (cape['item']){
                    cape['item']= null;
                }
                cape['items'] = [];
            }
        }
        if (teamData.armory){
            for (let item of teamData.armory){
                var data = armoryModule.getData(item.name)
                if (data){
                    teamData.funds+= Math.ceil(basePrices[data.rarity]*data.payscale);
                    //console.log(`Recycled ${item.name} for $${Math.ceil(basePrices[data.rarity]*data.payscale)}`)    
                }
            }
        }
        teamData['armory'] = [];

        
        await client.teamsDB.set(keyedPair['key'],teamData);
        console.log("saving")
        //console.log(teamData)
    }
    message.reply("Cleaned all data")
    return;
}




module.exports.run = async (client, message, args) =>{
    if (args[0] && args[0]== 'REVAMP2.0'){
        //await revampItems(client,message,args)
        return;
    }



    if (args[0] && args[0].length >= 3){
        let argConcat = args.join(" ");

        var teamData = await client.teamsDB.get(args[0],0)
        var offset = args[0].length+1


        if (teamData == 0){
            database = await client.teamsDB.getAll();

            var teamResults = searchModule.fillFromDatabase(argConcat,database,1);
            if (teamResults[1] >= 3){
                teamData = teamResults[0][0]
                offset = teamResults[1]
            }
        }
        if (teamData != 0){
            //console.log(argConcat);
            //console.log(argConcat.lastIndexOf(" "));
            //console.log(teamResults[1]);
            // message.reply(statsModule.teamDisplay(teamData));
            if (args[1] == "custom"){
                await giveCustom(client,message,args,teamData)
                return;
            }
            var compiledList = [...teamData.capes]
            if (teamData['reservedcapes']){
                compiledList = [...teamData.capes, ...teamData.reservedcapes]
            }

            var testCapeResults = searchModule.fillCapes(argConcat.substring(offset),compiledList);
            if (testCapeResults[0][0] && (testCapeResults[1]>4 || (testCapeResults[1]-1 == testCapeResults[0][0].name.length))){
                offset+=testCapeResults[1]
                changeCapeData(client,message,args,teamData,testCapeResults[0][0].id,offset)
            }else{
                changeTeamData(client,message,args,teamData,offset)
            }
            return;
        }
        else{
            message.reply("Could not identify, needs more accurate characters.")
        }
    }else{
        message.reply("Enter a team name.")
    }

}
//   ;

module.exports.help = {
    name: "admin",
    description: "Change stats of team or cape.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: true//CHANGE THIS  
}
module.exports.limits = {
    ratelimit: 1,
    cooldown: 1000*10
}
module.exports.setup = async ()=>{
    currentDate = new Date();
}