const {readdirSync} = require('fs');
const { join } = require("path");
const {postchannel} = require("../config.js");

const filePath = join(__dirname,"..","commands");

const { MessageCollector, MessageEmbed, DataResolver} = require("discord.js");
const Canvas = require('canvas');
const Discord = require('discord.js');


//modules
const fightModule = require("../structures/fight.js");
const searchModule = require('../structures/search');

var offers = []//[userid, target id, user capes, expiration date, RANKED]

const vsImage = "https://i.imgur.com/QhMUaGL.png";
const backgroundBanner = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FRW5a6D-O-i8%2Fmaxresdefault.jpg&f=1&nofb=1";
const blankBanner = "https://i.imgur.com/kH90AvT.png";
const blockPx = 250;
async function postMessage(channel,messages){
    // should recieve the [display, story] and the story
    var story = messages[1];
    var display = messages[0];
   // console.log(story);
    if (story){
        display.setFooter("⚔️ Fight Log Below");
        //console.log(story)
    }
    await channel.send(display);
    if (story){
        var postCollection = []
        var currentPost = "";
        
        for (let round of story){
            for (let roundInfo of round){
                if (currentPost.length+roundInfo.length < 2000-3){
                    currentPost+=roundInfo;
                }
                else{
                    postCollection.push(currentPost);
                    currentPost =  roundInfo;
                }
            }
        }
        postCollection.push(currentPost);

        for (var post of postCollection){
            await channel.send(post);
        }
        
    }else{
       // console.log("has no story :(")
    }
}


async function genFightBanner(teamA,teamB){

    var display = new MessageEmbed();
    var length = teamA.length+teamB.length

    var canvas = Canvas.createCanvas(length*blockPx+blockPx/2, blockPx*2);
    // ctx means context, used to modify our canvas
    var ctx = canvas.getContext('2d');

    var backTile = await Canvas.loadImage(backgroundBanner);
    ctx.drawImage(backTile,0, 0, canvas.width, canvas.height);

    var vsTile = await Canvas.loadImage(vsImage);
    ctx.drawImage(vsTile,(teamA.length)*blockPx,(canvas.height-blockPx/2)/2,blockPx/2,blockPx/2);
    
    for (let i = 0; i < teamB.length; i++){ //should flip pictures facing right 
        var pic = blankBanner;
        var cape = teamB[i];
        var correctScale = 1;
        var newX = (teamA.length+i)*blockPx+blockPx/2;
        if (cape["image"] && cape["image"]["approved"]){
            pic = (cape["image"]['url']);
            if (cape['image']['align'] && cape['image']['align']=='right'){
                //console.log('flipping b')
                correctScale = -1;
                newX = ((teamA.length+i)*blockPx+(blockPx*3/2))*-1
            }
        }
        var charTile = await Canvas.loadImage(pic);

        var newHeight = Math.ceil(charTile.height*blockPx/charTile.width);

        ctx.scale(correctScale,1);
        ctx.drawImage(charTile,newX,canvas.height-newHeight,blockPx,newHeight);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

    }

    for (let i = 0; i < teamA.length; i++){ //Should flip people who are facing left, so they face to the right side
        var pic = blankBanner;
        var cape = teamA[i];
        var correctScale = 1
        var newX = i*blockPx
        if (cape["image"] && cape["image"]["approved"]){
            pic = (cape["image"]['url']);
            if (cape['image']['align'] && cape['image']['align']=='left'){
                //console.log('flipping a')
                correctScale = -1;
                newX = (i*blockPx+(blockPx))*-1
            }
        }
        var charTile = await Canvas.loadImage(pic);
        var newHeight = Math.ceil(charTile.height*blockPx/charTile.width);
        ctx.setTransform(1, 0, 0, 1, 0, 0)

        ctx.scale(correctScale,1);
        ctx.drawImage(charTile,newX,canvas.height-newHeight,blockPx,newHeight);

    }

    var attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'fightbanner.png')
    display.attachFiles([attachment])
    display.setImage(`attachment://fightbanner.png`)
    return(display)
}



const rankedTeam = 5;


module.exports.run = async (client, message, args) =>{
    
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }

    
    if (!args[0]){
        message.reply(module.exports.help.description);
        return;
    }
    var ranked = false;

    if (args.includes('rank')){
        ranked=true;
        args.splice(args.indexOf('rank'),1)
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
    var targetTeamData = await client.teamsDB.get(`${targetUser.user.id}`, 0);
    if (targetTeamData == 0) {
        message.reply("Target user does not have data.");
        return;
    }

    var capes = [];

    if (!args[1]){
        message.reply("Specify which capes you want to send.");
        return;
    }

    if (args[1].toLowerCase() == 'all'){
        
        for (let cape of teamData.capes){
            capes.push(cape);
        }
        if (teamData.reservedcapes){
            for (let cape of teamData.reservedcapes){
                capes.push(cape);
            }
        }
    }
    else{
        var compiledList = [...teamData.capes]
        if (teamData['reservedcapes']){
            compiledList = [...teamData.capes, ...teamData.reservedcapes]
        }

        for (var i = 1; i < args.length; i++){
            if (compiledList[args[i]-1]){
                capes.push(compiledList[args[i]-1]);
                offset += 2
                if (args[i]>9){ // if op num was in double digits offset increases
                    offset++;
                }
            }
            else{
                var found = false;

                var results = searchModule.fillCapes(argsConcat.substring(offset),compiledList,1);
                var collection = results[0];
                if (collection[0]){
                    found = true;
                    capes.push(collection[0]);
                    offset+= results[1];
                }
    
                if (!found){
                    message.reply(args[i]+" is an invalid cape id/name");
                    return;
                }
            }
        }
    }

    //cape being sent twice
    for (var i = 0; i < capes.length; i++){
        for (var j = 0; j < capes.length; j++){
            if (capes[i].id == capes[j].id && i !=j ){
                message.reply(`You can not send ${capes[i].name} in multiple cape slots.`)
                return;
            }
        }
    }

    if (ranked && capes.length != rankedTeam){
        message.reply(`Ranked matches are limited to teams of ${rankedTeam} capes only!.`);
        return;
    }

    var capeIDs = []
    for (let cape of capes){
        capeIDs.push(cape.id);
    };

    var info = ""
    for (var i = 0; i < capes.length; i++){
        if (capes.length-1 == i && capes.length != 1){
            info+= (" and "+capes[i].name);
        }else if (capes.length != 1){
            info+= (capes[i].name+", ");
        }else{
            info = capes[i].name;
        }
    }
    const currTime = new Date().getTime();
    var responded = false;


    async function fight(offer){
        // run fight
        var enemyCapes = [];
        var compiledList = [...targetTeamData.capes]
        if (targetTeamData['reservedcapes']){
            compiledList = [...targetTeamData.capes, ...targetTeamData.reservedcapes]
        }
        for (let cape of compiledList){
            if (offer[2].includes(cape.id)){
                enemyCapes.push(cape);
            }
        }
        const data = fightModule.startFight(capes,enemyCapes)
        var display = await genFightBanner(capes,enemyCapes);


        var winner = teamData;
        const result = data[0]
        const story = data[1]
        if (result== false){
            winner = targetTeamData;
        }
        if (winner["image"] && winner["image"]["approved"]){
            display.setThumbnail(winner["image"]["url"])
        }
        display.setColor("GREEN");
        if (winner['preferences'] && winner['preferences']['color']){
            display.setColor(winner.preferences.color)
        }
        display.setAuthor(`${targetTeamData.name} vs ${teamData.name}`);


        var enemyInfo = ""
        for (var i = 0; i < enemyCapes.length; i++){
            if (enemyCapes.length-1 == i && enemyCapes.length != 1){
                enemyInfo+= (" and "+enemyCapes[i].name);
            }else if (enemyCapes.length != 1){
                enemyInfo+= (enemyCapes[i].name+", ");
            }else{
                enemyInfo = enemyCapes[i].name;
            }
        }
        display.addField(`${targetTeamData.name}`,enemyInfo)

        display.addField(`${teamData.name}`,info);
        
        await postMessage(message.channel,[display,story]);
    }

    function filter(offer){
        if (offer[1] == teamData.userid && offer[0] == targetTeamData.userid){
            responded = true;
            fight(offer)
            return false;

        }
        if (offer[3] > currTime && !(offer[0] == teamData.userid && offer[1] == targetTeamData.userid)){
            return true;
        }
        
    }

    offers =  offers.filter(filter);

    if (responded){
        return;
    }



    const expireTime =  currTime +(5*60*1000)

    if (targetTeamData.preferences['trade'] && targetTeamData.preferences['trade'] == "no"){
        message.reply("Target user is not accepting notifications.");
        return;
    }


    if (!ranked){
        message.channel.send(`<@${targetTeamData.userid}> ${message.member.nickname || message.member.user.username}`+
        ` challenged you to a fight with ${capes.length} cape(s): ${info}.\nRespond with your own capes in 5 minutes: `+"`,fight "+`${message.member.nickname || message.member.user.username}`+" [capes]`");    
    }else{
        message.channel.send(`<@${targetTeamData.userid}> ${message.member.nickname || message.member.user.username}`+
        ` challenged you to a **RANKED** fight with ${capes.length} cape(s): ${info}.\nRespond with your own capes in 5 minutes: `+"`,fight rank "+`${message.member.nickname || message.member.user.username}`+" [capes]`");    
    }
    
    offers.push([teamData.userid,targetTeamData.userid,capeIDs,expireTime,ranked]);


}


module.exports.help = {
    name: "arena",
    description: "Challenge another user to a no-consequences fight: `,fight [user] [capes]`"
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}

module.exports.setup = (client) =>{
    var id1 = 356485388849905675;
    var id2 = 665928272596697109;

    var team1 = client

    const data = fightModule.startFight(capes,enemyCapes)

}