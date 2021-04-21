const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const capeModule = require(`${filePath}/cape.js`);
const searchModule = require('../structures/search');
const flavorModule = require("../chargen/flavor.js")

const ImageModerators = ["153249576957116417"]
const postChannel = "746068539575631984"

async function submitPicture(client, message,args,teamData){
    const imgChannel = client.channels.cache.get(postChannel);

    var previousQue = await client.imagequeDB.get(`UnapprovedQue`, []);

    if (args[1]){
        if (!(args[1].endsWith(".png") || args[1].endsWith(".jpg") ||args[1].endsWith(".jpeg"))){
            message.reply("You must use a png or jpg format!");
            return;
        }
    }

    if (args[0].toLowerCase() == "team" && args[1]){

        var que = {
            ["user"]: message.member.user.username,
            ["userid"]: message.author.id,
            ["type"]: "team",
            ["url"]: args[1],
        }

        previousQue.push(que);

        teamData["image"] = {
            ["approved"]: false,
            ["denied"]: false,
            ["url"]: args[1],
        }

        await client.imagequeDB.set(`UnapprovedQue`, previousQue);
        await client.teamsDB.set(`${message.author.id}`, teamData);
        message.reply("Your image has been submitted for manual approval. It may take time before being shown. Do not submit more than one image for the same team/cape at a time."); 
        if (imgChannel){
            imgChannel.send(`${(message.member.nickname || message.member.user.username)} submitted an image for approval. ${previousQue.length} remaining.`);
        }
        
        return;
    }else if (args[0].toLowerCase() == "team"){
        message.reply("Error, input the content with the command.");
    }


    // naming capes
    //console.log('['+argCat+']');
    if (args[1]){
        var compiledList = [...teamData.capes]
        if (teamData['reservedcapes']){
            compiledList = [...teamData.capes, ...teamData.reservedcapes]
        }
        var targetCape = compiledList[args[0]-1] || "null"
        
        if (targetCape == "null"){
            message.reply("Could not identity cape. You must use an id identifier"); 
            return;
        }
        //,name cape (offset)
        var que = {
            ["user"]: message.member.user.username,
            ["userid"]: message.author.id,
            ["type"]: "cape",
            ['capeid']:  targetCape.id,
            ["url"]: args[1],
        }

        previousQue.push(que);

        targetCape["image"] = {
            ["approved"]: false,
            ["denied"]: false,
            ["url"]: args[1],
        }

        await client.imagequeDB.set(`UnapprovedQue`, previousQue);
        await client.teamsDB.set(`${message.author.id}`, teamData);
        message.reply("Your image has been submitted for manual approval. It may take time before being shown. Do not submit more than one image for the same team/cape at a time."); 
        if (imgChannel){
            imgChannel.send(`${(message.member.nickname || message.member.user.username)} submitted an image for approval. ${previousQue.length} remaining.`);
        }
        
        return;
        

        return;
    }
    /*else if (args[0].toLowerCase() == "cape"){
        message.reply("needs a second argument. Either the cape's name or their number");
    }*/
     
    if (args[0].toLowerCase() != 'team'){
        message.reply("Input a cape **ID**");
    }
}

async function approvePictures(client, message,args,teamData){
    var unapprovedItems = await client.imagequeDB.get(`UnapprovedQue`,[]);
    const imgChannel = client.channels.cache.get(postChannel);

    var length = unapprovedItems.length;
    if (unapprovedItems.length > 5 || args[1]){//should be able to draw a specific amount
        if (args[1] && imgChannel[args[1]-1]){
            length = args[1-1]
        }else{
            length = 5;
        }
    }
    //console.log(length)
    for (var index = 0; index <length; index++){
        const submission = unapprovedItems[index];
        var display = new MessageEmbed()
        .setAuthor(submission.user+" | "+submission.type)
        .setImage(submission.url);
        //console.log(submission.url)
        const subMsg = await imgChannel.send(display).catch(console.error);
        if (!subMsg){
            continue;
        }
        subMsg.react('✅');
        subMsg.react('❌');

        const denyfilter = (reaction, user) => {
            return reaction.emoji.name === '❌' && user.id === message.author.id;
        };
        const acceptfilter = (reaction, user) => {
            return reaction.emoji.name === '✅' && user.id === message.author.id;
        };
        
        subMsg.awaitReactions(denyfilter, { max: 1, time: 5*60*1000, errors: ['time'] })
        .then( async collected =>  {
            teamData = await client.teamsDB.get(`${submission.userid}`, 0);
            if (teamData ==0){
                message.reply("User deleted their data.");
                return;
            }
            if (submission.type == "team"){
                teamData["image"]["approved"] = false;
            }
            if (submission.type == "cape"){
                var compiledList = [...teamData.capes]
                if (teamData['reservedcapes']){
                    compiledList = [...teamData.capes, ...teamData.reservedcapes]
                }
                for (var cape of compiledList){
                    if (cape.id == submission.capeid){
                        cape["image"]["approved"] = false;
                    }
                }
            }
            imgChannel.send("Denied image from: "+submission.user);

            function filterItems(testSub) {
                if (testSub.userid == submission.userid && testSub.type == submission.type){
                    return false;
                };
                return true;
            }
            
            unapprovedItems = unapprovedItems.filter(filterItems)
            await client.imagequeDB.set(`UnapprovedQue`,unapprovedItems);
            await client.teamsDB.set(`${submission.userid}`, teamData);
        })
        .catch(collected => {
            subMsg.edit('You have not responded in time.');
        });


        subMsg.awaitReactions(acceptfilter, { max: 1, time: 5*60*1000, errors: ['time'] })
        .then( async collected =>  {
            teamData = await client.teamsDB.get(`${submission.userid}`, 0);
            if (teamData ==0){
                message.reply("User deleted their data.");
                return;
            }
            if (submission.type == "team"){
                teamData["image"]["approved"] = true;
                teamData["image"]["url"] = submission.url;
            }
            if (submission.type == "cape"){
                var compiledList = [...teamData.capes]
                if (teamData['reservedcapes']){
                    compiledList = [...teamData.capes, ...teamData.reservedcapes]
                }
                for (var cape of compiledList){
                    if (cape.id == submission.capeid){
                        cape["image"]["approved"] = true;
                        cape["image"]["url"] = submission.url;
                    }
                }
            }
            imgChannel.send("Approved image from: "+submission.user);
            function filterItems(testSub) {
                if (testSub.userid == submission.userid && testSub.type == submission.type){
                    return false;
                };
                return true;
            }
            
            unapprovedItems = unapprovedItems.filter(filterItems)
            await client.imagequeDB.set(`UnapprovedQue`,unapprovedItems);
            await client.teamsDB.set(`${submission.userid}`, teamData);
        })
        .catch(collected => {
            subMsg.edit('You have not responded in time.');
        });
    }
    if (length == 0){
        message.reply("There are no images waiting for approval.");
    }
}

module.exports.run = async (client, message, args) =>{
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }

    if (args[0] == undefined){
        message.reply(this.help.description);
        return;
    }

    if ((args[0].toLowerCase() == "approve" || message.content.substring(1,8) == "approve") && ImageModerators.includes(message.author.id)){
        if (message.channel.id != postChannel){
            message.reply("Wrong channel");
            return;
        }
        if (message.content.substring(1,8) == "approve"){
            if (args[1]){
                args[1] == args[0];
            }else{
                args.push(args[0])
            }
        }
        approvePictures(client,message,args);
        return;
    }

    if (args[1] && args[1].toLowerCase() == "align"){
        var align = "left";
        
        var targetCape = teamData.capes[args[0]-1] || null

        if (targetCape == null){
            message.reply("Could not identity cape. You must use an id identifier"); 
            return;
        }
        if (args[2] && args[2].toLowerCase() == 'right'){
            align = 'right'
        }

        if (targetCape["image"] && targetCape["image"]["approved"]){
            targetCape['image']['align'] = align;
            await client.teamsDB.set(`${message.author.id}`, teamData);
            message.reply(`Set ${targetCape.name}'s alignment as facing ${align}.`);
        }else{
            message.reply("Can not align a cape without an approved image.");
        }
        return;
    }

    submitPicture(client,message,args,teamData)
    
}

module.exports.help = {
    name: "pic",
    description: "Give your team a logo and your cape a picture! `,pic ['team'/cape-id] [img url png]`\n"+
    "Submitted images will be qued for manuel review. If yours is approved it will appear on the card. 60 second cooldown. Shardbot moderators have to personally approve these and we know who submits what so don't waste our time. "+
    "Can also set what side your character is facing so they get flipped in team banners: `,pic [cape-id] align [left/right]`",
}

module.exports.limits = {
    ratelimit: 2,
    cooldown: 1000*60
}


module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}