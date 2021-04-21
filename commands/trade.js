const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const searchModule = require('../structures/search');
const capeModule = require(`${filePath}/cape.js`)

//modules

const tradeIcon = '🔄'
const payIcon = '💰'


async function payUser(client,message,args,teamData,targetTeamData,argsConcat,offset){
    //console.log(message,args,targetTeamData,argsConcat,offset)
    var payment = parseInt(args[1]) || null
    if (!payment){
        payment = parseInt(argsConcat.substring(offset).trim(" ")) || null
    }
    if (!payment){
        message.reply("Transaction failed.");
        return;
    }

    if (payment && teamData.funds < payment){
        message.reply("You can not afford to pay $"+payment);
        return;
        
    }else if (payment && payment <= 0){
        message.reply(`You can not give negative money.`);
        return;
    }
    const offer = await message.channel.send(`React with ${payIcon} to pay ${targetTeamData.name} $${payment}.`);

        offer.react(payIcon);  
        const filter = (reaction, user) => {
            return reaction.emoji.name === payIcon && user.id === message.author.id;
        };
        
        offer.awaitReactions(filter, { max: 1, time: 1*60*1000, errors: ['time'] })
        .then( async collected =>  {
            targetTeamData = await client.teamsDB.get(`${targetTeamData.userid}`, 0);
            teamData = await client.teamsDB.get(`${message.author.id}`, 0);
            if (teamData.funds < payment){
                message.reply("You do not have enough funds.");
                return;
            }
            teamData.funds -= payment;
            targetTeamData.funds += payment;
            await client.teamsDB.set(`${message.author.id}`, teamData)
            await client.teamsDB.set(`${targetTeamData.userid}`, targetTeamData)

            message.reply(`Sent ${targetTeamData.name} $${payment}.`);
            return;

        })
        .catch(collected => {
            message.reply('You have not responded in time.');
        });
}

module.exports.run = async (client, message, args) =>{

    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return;
    }
    if (teamData.capes.length == 1){
        message.reply("You can not trade your only cape.");
        return;
    }
    if (!args[0]){
        message.reply("Offer to trade one of your capes for another team's cape.\n"+
        "`,trade (owner) (offered cape) (desired cape) (payment)");
        return;
    }
    
    var argsConcat = args.join(" ");

    var offset = args[0].length;
    var targetUser =  message.guild.members.cache.get(args[0]);
    //console.log(targetUser);
    if (!targetUser){
        const userCollection = searchModule.fillUserList(argsConcat,message.guild.members.cache)
        if (userCollection.length > 0){
            targetUser = userCollection[0][0]
            offset = userCollection[1]
        }
    }

    if (!targetUser){
        message.reply("Could not find user.");
        return;
    }
    else{
       // console.log(`Found ${targetUser.user.username}`)
    }

    var targetTeamData = await client.teamsDB.get(`${targetUser.user.id}`, 0);
    if (targetTeamData == 0 ) {
        message.reply("Target user does not have data.");
        return;
    }
    if (targetTeamData['preferences'] && targetTeamData.preferences['trade'] && targetTeamData.preferences['trade'] == "no"){
        message.reply("Target user is not accepting trades or payments.");
        return;
    }
    if (targetTeamData.userid == teamData.userid){
        message.reply("You can not trade with yourself.");
        return; 
    }
    
    if (message.content.substring(0,4)==",pay"){
        payUser(client,message,args,teamData,targetTeamData,argsConcat,offset);
        return;
    }




    var myCape = teamData.capes[args[1]-1] || null;
    if (myCape){
        offset+=2
        if (args[1] >9){
            offset++;
        }
    }
    if (!myCape){
        //console.log(argsConcat.substring(offset))
        var results = searchModule.fillCapes(argsConcat.substring(offset),teamData.capes,1);
        var collection = results[0];
        if (collection[0]){
            myCape = collection[0]
            offset += results[1]
        }
    }
    if (!myCape){
        message.reply("Could not identify your cape.");
        return;
    }
    if (myCape.activity != "none"){
        message.reply("You can not offer active capes.");
        return;
    }

    var desiredCape = targetTeamData.capes[args[2]-1] || null;
    if (desiredCape){
        offset+=2
        if (args[2] >9){
            offset++;
        }
    }
    if (!desiredCape){
        var results = searchModule.fillCapes(argsConcat.substring(offset),targetTeamData.capes,1);
        var collection = results[0];
        if (collection[0]){
            desiredCape = collection[0]
            offset += results[1]
        }
    }
    if (!desiredCape){
        message.reply("Could not identify their cape.");
        return;
    }
    if (desiredCape.activity != "none"){
        message.reply("Their cape is in a mission at the moment and can not be traded.");
        return;
    }

    if (myCape.clusterid){//clusters cant be on same team
        console.log(`trading cluster #`+myCape.clusterid)
        for (let possibleClusterCape of targetTeamData.capes){
            if (possibleClusterCape.clusterid && possibleClusterCape.clusterid == myCape.clusterid && (desiredCape.id != possibleClusterCape.id)){
                message.reply(`${myCape.name} can not be traded to ${targetTeamData.name} due to interpersonal issues with ${possibleClusterCape.name}.`);
                return;
            }
        }
        if (targetTeamData.reservedcapes){
            for (let possibleClusterCape of targetTeamData.reservedcapes){
                if (possibleClusterCape.clusterid && possibleClusterCape.clusterid == myCape.clusterid && (desiredCape.id != possibleClusterCape.id)){
                    message.reply(`${myCape.name} can not be traded to ${targetTeamData.name} due to interpersonal issues with ${possibleClusterCape.name}.`);
                    return;
                }
            }
        }
    }
    if (desiredCape.clusterid){//clusters cant be on same team
        //console.log(`trading cluster #`+myCape.clusterid)
        for (let possibleClusterCape of teamData.capes){
            if (possibleClusterCape.clusterid && possibleClusterCape.clusterid == desiredCape.clusterid && (myCape.id != possibleClusterCape.id)){
                message.reply(`${desiredCape.name} can not be traded to ${targetTeamData.name} due to interpersonal issues with ${possibleClusterCape.name}.`);
                return;
            }
        }
        if (teamData.reservedcapes){
            for (let possibleClusterCape of teamData.reservedcapes){
                if (possibleClusterCape.clusterid && possibleClusterCape.clusterid == desiredCape.clusterid && (myCape.id != possibleClusterCape.id)){
                    message.reply(`${desiredCape.name} can not be traded to ${targetTeamData.name} due to interpersonal issues with ${possibleClusterCape.name}.`);
                    return;
                }
            }
        }
    }


    var payment = parseInt(args[3]) || null
    if (!payment){
        payment = parseInt(argsConcat.substring(offset).trim(" ")) || null
    }

    if (payment && teamData.funds < payment){
        message.reply("You can not afford to pay $"+payment);
        return;
        
    }else if (payment && payment < 0){
        message.reply(`You can not offer negative money.`);
        return;
    }
    // check privacy perms and shit

    var myDisplay = capeModule.returnDisplay(myCape, `${(message.member.nickname || message.member.user.username)} offers ${myCape.name}`);
    var theirDisplay = capeModule.returnDisplay(desiredCape,`${(message.member.nickname || message.member.user.username)} wants ${desiredCape.name}`);

    message.channel.send(myDisplay);
    message.channel.send(theirDisplay);
    var myID = myCape.id;
    var targetID = desiredCape.id;

    var offerText = `<@${targetTeamData.userid}> ${message.member.user.username} wants to trade you their cape, ${myCape.name}, for ${desiredCape.name}.`+
    ` Both parties must react with ${tradeIcon} to complete the trade within 5 minutes. `
    if (payment){
        offerText+=`They will pay **$${payment}** in addition to their offered cape.`
    }
    
    
    const offer = await message.channel.send(offerText);
    
    var confirmations = 0;
    

    offer.react(tradeIcon);  
    const filterA = (reaction, user) => {
        return reaction.emoji.name === tradeIcon && user.id === message.author.id;
    };

    offer.awaitReactions(filterA, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {
        confirmations++;
        if (confirmations == 2){
            runTrade()
        }
    })
    .catch(collected => {
        message.reply('You have not responded in time.');
    });

    const filterB = (reaction, user) => {
        return reaction.emoji.name === tradeIcon && user.id === targetTeamData.userid;
    };

    offer.awaitReactions(filterB, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {
        confirmations++;
        if (confirmations == 2){
            runTrade()
        }
    })
    .catch(collected => {
        message.reply('You have not responded in time.');
    });

    
    async function runTrade(){
        confirmations++;
        teamData = await client.teamsDB.get(`${message.author.id}`, 0);
        targetTeamData = await client.teamsDB.get(`${targetUser.user.id}`, 0);
        if (teamData.capes.length == 1 || targetTeamData.capes.length == 1){
            message.channel.send("Teams can not trade their only cape.")
            return;
        }
        if (payment && teamData.funds < payment){
            message.reply("You can not afford to pay $"+payment);
            return;
        }
        //check team activities and if the cape even exists
        var newCape = null;
        var newTarget = null
        for (let cape of teamData.capes){
            if (cape.id == myID){
                newCape = cape;
            }
        }
        for (let cape of targetTeamData.capes){
            if (cape.id == targetID){
                newTarget = cape;
            }
        }
        if (!newCape || !newTarget){
            message.channel.send("Could not find a cape on the roster.");
            return;
        }
        //removing items

        newCape.weapon = null;
        newCape.items = []
        newTarget.weapon = null;
        newTarget.items = [];
        // removing capes
        for (var i = 0; i < teamData.capes.length;i++){
            if (teamData.capes[i].id == newCape.id){
                teamData.capes.splice(i,1);
            }
        }
        for (var i = 0; i < targetTeamData.capes.length;i++){
            if (targetTeamData.capes[i].id == newTarget.id){
                targetTeamData.capes.splice(i,1);
            }
        }
        // changing ids
        newCape.id = targetTeamData.nextid;
        targetTeamData.nextid++;
        newTarget.id = teamData.nextid;
        teamData.nextid++;
        teamData.capes.push(newTarget);
        targetTeamData.capes.push(newCape);

        //processing payment
        if (payment){
            teamData.funds = teamData.funds-payment;
            targetTeamData.funds = targetTeamData.funds+payment;
        }

        //save and give message
        await client.teamsDB.set(`${message.author.id}`, teamData);
        await client.teamsDB.set(`${targetUser.user.id}`, targetTeamData);

        message.channel.send(`<@${teamData.userid}><@${targetTeamData.userid}> Traded ${newCape.name} for ${newTarget.name}.`)
    }
    //remember to change their ids as if it was a recruit

    return;

}

module.exports.help = {
    name: "trade",
    description: "Offer to trade one of your capes for another team's cape.\n"+
    "`,trade (owner) (offered cape) (desired cape) (payment)`",
}

module.exports.limits = {
    ratelimit: 1,
    cooldown: 1000*10
}


module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}