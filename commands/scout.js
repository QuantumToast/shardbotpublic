const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");

const basePrice = 500;
//modules
const capeModule = require(`${filePath}/cape.js`)
const reserveModule = require(`${filePath}/reserve.js`)

const HQModule = require(`./headquarters`)
const levelModule = require('../structures/level')
const leaderboardModule = require('./leaderboard.js')
const customModule = require("../chargen/customs.js");
const traitsModule = require("../chargen/traits.js");

const classes = [
    "blaster",
    "shaker",
    "master",
    "mover",
    "changer",
    "tinker",
    "brute",
    "stranger",
    "breaker",
    "thinker",
    "striker"
    //,'trump' // REMOVE THIS ON RELEASE
]
const acceptionIcon = '✅'
const multiOne = '1️⃣'
const multiTwo = '2️⃣'
const multiThree = '3️⃣'
const rerollIcon = '🔄'

const clusterPrice = 2500 // per user

function concatNamesIntoList(targetList){
    var result = ""
    for (var i = 0; i < targetList.length;i++){
        if (i == targetList.length-1 && i != 0){
            result+= "and "
        }
        result+= targetList[i];
        if (i != targetList.length-1 && targetList.length > 2){
            result+= ","
        }
        if (i != targetList.length-1){
            result+= " "
        }
    }
    return result;
}

async function createCluster (client,message,args){
    var teamIDs = [message.author.id];
    var teamNames = [message.member.nickname || message.member.user.username] //holds usernames or nicknames of other team managers
    for (let pointedUser of message.mentions.members){
        if (!teamIDs.includes(pointedUser[0]) && !pointedUser[1].user.bot ){
            teamIDs.push(pointedUser[0])
            teamNames.push(pointedUser[1].nickname || pointedUser[1].user.username)
        }
    }
    if (teamIDs.length < 2){
        message.reply("You must scout a cluster with at least one other user.");
        return
    }
    if (teamIDs.length > 4){
        message.reply("You may invite up to 3 other people to scout a cluster with you.");
        return;
    }

    var offerText = `${concatNamesIntoList(teamNames)} must react with ${acceptionIcon} and pay **$${clusterPrice}**. Everyone must also have an open slot. Open for 5 minutes.`;


    const offer = await message.channel.send(offerText);
    
    var confirmedIDs = []

    offer.react(acceptionIcon);  
    const filterA = (reaction, user) => {
        if (reaction.emoji.name === acceptionIcon && (teamIDs.includes(user.id)) && !confirmedIDs.includes(user.id)){
            confirmedIDs.push(user.id);
            return true;
        }
        return false; ;
    };

    var generated = false;
    offer.awaitReactions(filterA, { max: teamIDs.length, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {
        if (confirmedIDs.length == teamIDs.length && !generated){
            generated = true;
            genCluster()
        }
    })
    .catch(collected => {
        offer.edit('You have not responded in time.');
    });

    async function genCluster(oldClusterID){


        var teamDataArray = [];
        //verifying teams

        for (let i=0; i<confirmedIDs.length;i++){
            
            var id = confirmedIDs[i];
            let teamData = await client.teamsDB.get(`${id}`, null);
            if (!teamData){
                message.reply(`<@${id}> Does not have a team.`);
                return;
            }
            if (teamData.funds < clusterPrice){
                message.channel.send(`<@${id}> Can not afford $${clusterPrice}.`);
                return;
            }
            if (oldClusterID){
                var removed = false;

                for (let j =0; j<teamData.capes.length && !removed; j++){
                    if (teamData.capes[j].clusterid && teamData.capes[j].clusterid == oldClusterID){
                        if (!teamData.capes[j].activity || teamData.capes[j].activity=='none'){
                            teamData.capes.splice(j,1);
                            removed = true;
                        }else{
                            message.channel.send(`<@${confirmedIDs[i]} can not reroll an active cape.`)
                        }
                    }
                }
                if (teamData.reservedcapes){
                    for (let j =0; j< teamData.reservedcapes.length && !removed; j++){
                        if (teamData.reservedcapes[j].clusterid && teamData.reservedcapes[j].clusterid==oldClusterID){
                            teamData.reservedcapes.splice(j,1);
                            removed = true;
                        }
                    }
                }
                if (!removed){
                    message.channel.send(`<@${confirmedIDs[i]}> does not have their cape anymore.`)
                    return;
                }
            }

            if (teamData.capes.length >= HQModule.getMaxCapes(teamData) && (teamData.reservedcapes && teamData.reservedcapes.length >= HQModule.getMaxReserve(teamData))){
                message.channel.send(`<@${id}> Does not have space for another cape.`);
                return;
            }
            teamData.funds = teamData.funds-clusterPrice
            teamDataArray.push(teamData)
        }

        // Genning cluster
        var cluster = capeModule.createCluster(confirmedIDs.length);
        var clusterID = await client.teamsDB.get(`NextClusterID`,0);

        for (let i = 0; i < confirmedIDs.length; i++){
            var reserved = false
            var teamData = teamDataArray[i];
            var targetCape = cluster[i];

            if (teamData.capes.length >= HQModule.getMaxCapes(teamData)){
                reserved= true
            }

            targetCape["id"] = teamData.nextid;
            traitsModule.getList(targetCape)
            teamData.nextid++;
            targetCape['clusterid'] = clusterID;
            targetCape['hiretime']= new Date().getTime()
            //console.log(`cluster #${targetCape.clusterid}`)
            if (!targetCape.level){
                targetCape["level"] = 1;
            }
            if (!reserved){teamData.capes.push(targetCape);}
            else {
                targetCape['activity']=`[capename] ${reserveModule.returnReserveFlavor(targetCape)}`;
                targetCape['recoverytime'] = new Date().getTime()
                if (!teamData['reservedcapes']){
                    teamData['reservedcapes'] = []
                }
                teamData.reservedcapes.push(targetCape)
            }
            await client.teamsDB.set(confirmedIDs[i],teamData);
        }

        // displaying after saving

        for (let i= 0; i<confirmedIDs.length;i++){
            message.channel.send(capeModule.returnDisplay(cluster[i],`${teamDataArray[i].name} recruited:`))
        }

        var rerollOffer = await message.channel.send(`If all parties wish to reroll the cluster, react with ${rerollIcon} within 5 minutes.`)
        rerollOffer.react(rerollIcon)

        var rerolledIDs = []

        const filterB = (reaction, user) => {
            if (reaction.emoji.name === rerollIcon && (confirmedIDs.includes(user.id)) && !rerolledIDs.includes(user.id)){
                rerolledIDs.push(user.id);
                return true;
            }
            return false; ;
        };

        var rerolled = false;
        rerollOffer.awaitReactions(filterB, { max: confirmedIDs.length, time: 5*60*1000, errors: ['time'] })
        .then( async collected =>  {
            if (rerolledIDs.length == confirmedIDs.length && !rerolled){
                rerolled = true;
                genCluster(clusterID)
            }
        }).catch(collected => {
            rerollOffer.edit('You have not responded in time.');
        });
        
        await client.teamsDB.set(`NextClusterID`,clusterID+1);


    }
    
}


module.exports.run = async (client, message, args) =>{

    

    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }

    if (message.content.substring(1,8)=="cluster"){
        createCluster(client,message,args);
        return;
    }

    if (teamData.capes.length >= HQModule.getMaxCapes(teamData) && !(args.includes('max'))){ //|| (args[0] || args[0] == 'max') 
        message.reply("You are at maximum capes already.");
        return;
    }
    var myCost = basePrice;
    var classFilter = null
    var multi = 1
    if (args[0] == "2"){
        multi = 2
    }
    if (args[0] == "3"){
        multi = 3
    }
    if (args[1] == "2"){
        multi = 2
    }
    if (args[1] == "3"){
        multi = 3
    }
    if (args[0] && classes.lastIndexOf(args[0].toLowerCase())!= -1){
        classFilter = [args[0]];
        myCost+= (1000*multi)
    }
    if (!classFilter && args[1] && classes.lastIndexOf(args[1].toLowerCase()) != -1){
        classFilter = [args[1]];
        myCost+= (1000*multi)
    }
    myCost+= (multi-1)*100;


    if (multi > 1 && !(teamData.HQ && teamData.HQ >= 3)){
        message.reply("You can not multi-scout yet. Requires HQ lv3.")
        return;
    }
    if (classFilter && !(teamData.HQ && teamData.HQ >= 4)){
        message.reply("You can not class-scout yet. Requires HQ lv4.")
        return;

    }


    if (teamData.funds < myCost){
        message.reply("Your funds are too low. This scouting requires $"+`${myCost}`+".");
        return;
    }

    teamData.funds = teamData.funds - myCost;
    await client.teamsDB.set(`${message.author.id}`, teamData);

    // genning cape

    var cape2 = null;
    var cape3 = null;
    var cape = capeModule.genCape(classFilter);
    
    traitsModule.getList(cape)


    var offerText = `React with ${acceptionIcon} in the next 5 minutes to add this cape to your team.`

    if (multi == 2){
        offerText = `React with 1️⃣ or 2️⃣ in the next 5 minutes to add that cape to your team.`;
        cape2 = capeModule.genCape(classFilter);
        traitsModule.getList(cape2)
    }
    if (multi == 3){
        offerText = `React with 1️⃣, 2️⃣, or 3️⃣ in the next 5 minutes to add that cape to your team.`;
        cape2 = capeModule.genCape(classFilter);
        cape3 = capeModule.genCape(classFilter);
        traitsModule.getList(cape2)
        traitsModule.getList(cape3)
    }

    message.reply("Scouting a cape for recruitment.");
    

    var potentialCapes = [cape,cape2,cape3] //HQ lv5 upgrades
    if (teamData.HQ && teamData.HQ >= 5){
        for (pCape of potentialCapes){
            if (pCape){
                pCape["level"] = 1;
                pCape["xp"] = 0;

                var num = Math.floor(Math.random()*100+1)
                var levels = 1;
                if (num >= 95){
                    levels = 5
                }else if(num >= 85){
                    levels = 4
                }
                else if(num >= 70){
                    levels = 3
                }
                else if(num >= 50){
                    levels = 2
                }
                levelModule.forceLevelUp(pCape,levels)
            }
        }
    }

    await capeModule.showData(cape, message);
    if (cape2){
        await capeModule.showData(cape2, message);
    }
    if (cape3){
        await capeModule.showData(cape3, message);
    }

    const offer = await message.channel.send(offerText);
    
    
    switch(multi){
        case(1):
            offer.react(acceptionIcon);  
            break;
        case(2):
            offer.react(multiOne);
            offer.react(multiTwo);

            break;
        case(3):
            offer.react(multiOne);
            offer.react(multiTwo);
            offer.react(multiThree);
            break;
    }
    

    var chosen = null;
    var filter = (reaction, user) => {
        if (!chosen && multi == 1 && reaction.emoji.name === acceptionIcon && user.id === message.author.id){
            chosen = 1;
            return true;
        }
        else if (!chosen && multi > 1 && (reaction.emoji.name === multiOne || reaction.emoji.name === multiTwo || reaction.emoji.name === multiThree) && user.id === message.author.id){
            if (reaction.emoji.name === multiOne){
                chosen = 1
            }
            if (reaction.emoji.name === multiTwo){
                chosen = 2
            }
            if (reaction.emoji.name === multiThree){
                chosen = 3
            }
            return true;
        }
    };
    

    // purchasing
    offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {
        teamData = await client.teamsDB.get(`${message.author.id}`, 0);

        var reserved = false;


        if (teamData.capes.length >= HQModule.getMaxCapes(teamData)){
            if (!teamData.reservedcapes || teamData.reservedcapes.length < HQModule.getMaxReserve(teamData)){
                reserved=true;
            }
            else{
                message.reply("You are at maximum capes already");
                return;
            }
        }

        var targetCape;
        if (chosen === 2){
            targetCape = cape2;
        }else if (chosen === 3){
            targetCape = cape3;
        }else{
            targetCape = cape;
        }

        //saving data
        if (!reserved){teamData.capes.push(targetCape);}
        else {
            targetCape['activity']=`[capename] ${reserveModule.returnReserveFlavor(targetCape)}`;
            targetCape['recoverytime'] = new Date().getTime()
            if (!teamData['reservedcapes']){
                teamData['reservedcapes'] = []
            }
            teamData.reservedcapes.push(targetCape)
        }

        targetCape["id"] = teamData.nextid;
        if (!targetCape.level){
            targetCape["level"] = 1;
        }
        targetCape['hiretime']= new Date().getTime()
        teamData.nextid++;
        await client.teamsDB.set(`${message.author.id}`, teamData);
        leaderboardModule.update(client,teamData);
        if (!reserved){
            message.channel.send(`Recruited ${targetCape.name} to ${teamData.name}!\n You can rename your cape with 'name (cape) newname'`);
        }else{
            message.channel.send(`Reserved ${targetCape.name} for ${teamData.name}!\n You can rename your cape with 'name (cape) newname'`);
        }
    })
    .catch(async collected => {
        offer.edit('You have not responded in time.');
    });


    // Reroll option
    const rerollFilterfilter = (reaction, user) => {
        return reaction.emoji.name === rerollIcon && user.id === message.author.id;
    };

    offer.react(rerollIcon)
    offer.awaitReactions(rerollFilterfilter, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {
        module.exports.run(client,message,args)
    })
    .catch(collected => {
        offer.edit('You have not responded in time.');
    });
}

module.exports.help = {
    name: "scout",
    description: "Pay $"+basePrice+" to be offered a new cape recruit.\n"+
    "HQ lv3: ,scout (2 or 3) to be offered multiple choices for +$100 each.\n"+
    "HQ lv4: ,scout (class) to find a specific class for +$1000 per cape.\n"
    +`To scout a cluster use ,cluster then ping up to 3 other people. Each entry costs $${clusterPrice}`
    ,

}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}

module.exports.limits = {
    ratelimit: 3,
    cooldown: 2e4
}