const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const capeModule = require(`${filePath}/cape.js`);
const searchModule = require('../structures/search');
const flavorModule = require("../chargen/flavor.js")


function isInt(value) {
    return !isNaN(value) && 
        parseInt(Number(value)) == value && 
        !isNaN(parseInt(value, 10));
}

var pronounAutos = {
    ["he/him"]: "he",
    ["she/her"]: "she",
    ["they/them"]: "they",

    ["he"]: "he",
    ["his"]: "he",
    ["him"]: "he",
    ["she"]: "she",
    ["her"]: "she",
    ["they"]: "they",
    ["them"]: "they",
    ["their"]: "they",
}

var pronouns = { //[subject, object, possessive]
    ['he']: ['he','him','his'],
    ['she']: ['she','her','her'],
    ['they']: ['they','them','their'],
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

    if (args.join(" ").includes('http'||'https' ||'//' || 'www'|| '.gg'|| '.com'|| '.org'|| '.net'|| '.co'|| '.edu' || '\r\r' || '\n\n')){
        message.reply("Please do not include links in personal information tab. Doing so may result in a ban.");
        return;
    }
    var editAge = false;
    var editPronoun = false;


    if (args[0].toLowerCase() == "team" && args[1]){
        args.splice(0,1)
        var info = args.join(" ");
        if (info.length > 350){
            message.reply("Blurb is too long. Max is 250 characters."); 
            return;
        }
        if (!teamData['info']){
            teamData['info'] = "";
        }
        teamData.info = info;
        message.reply("Set team info to " + info);
        await client.teamsDB.set(`${message.author.id}`, teamData);
        return;

    }else if (args[0].toLowerCase() == "team"){
        message.reply("Error, input the content with the command.");
    } 


    // naming capes
    var argCat = args.join(' ');
    //console.log('['+argCat+']');
    if (args[1]){
        var compiledList = [...teamData.capes]
        if (teamData['reservedcapes']){
            compiledList = [...teamData.capes, ...teamData.reservedcapes]
        }

        var targetCape = compiledList[args[0]-1] || "null"

        var offset = 2
        if (targetCape && args[0]>9){ // if cape position was in double digits offset increases
            offset = 3;
        }

        // if they typed the name of the cape
        if (targetCape == "null") {
           // console.log("searching for name");
            var results = searchModule.fillCapes(argCat, compiledList, 1);
            var collection = results[0];
            if (collection[0]){
                //console.log('found a cape to search')
                targetCape = collection[0];
                offset = results[1]
            }
        }
        
        if (targetCape == "null"){
            message.reply("Could not identity cape."); 
            return;
        }
        //,name cape (offset)
        
        var info = argCat.substring(offset);
        
        if (info.toLowerCase().substring(0,3) == "age" && args[1]){
            info = info.substring(4,info.length)
            editAge = true;
        }else if (info.toLowerCase().substring(0,7) == "pronoun" && args[1]){
            info = info.substring(8,info.length)
            editPronoun = true;
        }

        if (!editAge && !editPronoun){
            if (info.toLowerCase() == 'random'){
                info = flavorModule.getInfo();
            }
            if (info.length > 250){
                message.reply("Info is too long. Max is 250 characters."); 
                return;
            }
            if (!targetCape.info){
                targetCape['info'] = "";
            }
            targetCape['info'] = info;
        }else if (editAge){
            var newAge = info.trim()
            if (isInt(newAge)){
                if (newAge >= 12 && newAge <= 99){
                    targetCape['age'] = newAge;
                    if (newAge == 69){
                        message.channel.send('nice')
                    }
                }else{
                    message.reply("Age is limited to 12 and 99");
                    return;
                }
            }else{
                message.reply("You can only set an integer for an age.");
                return;
            }
        }else if (editPronoun){
            var newPronoun = info.trim();
            if (pronounAutos[newPronoun]){
                targetCape['sub'] = pronouns[pronounAutos[newPronoun]][0] //subject
                targetCape['obj'] = pronouns[pronounAutos[newPronoun]][1] //object
                targetCape['pos'] = pronouns[pronounAutos[newPronoun]][2] //possessive
            }else{
                message.reply("Cape's pronoun can be set to she/he/they");
                return;
            }
        }
        
        message.reply("Updated " + targetCape.name + "'s personal information.");
        await client.teamsDB.set(`${message.author.id}`, teamData);

        return;
    }
    /*else if (args[0].toLowerCase() == "cape"){
        message.reply("needs a second argument. Either the cape's name or their number");
    }*/
     
    if (args[0].toLowerCase() != 'team' && args[0].toLowerCase() != 'cape'){
        message.reply("Invalid info text input");
    }
    
}

module.exports.help = {
    name: "info",
    description: "Personalize your capes or team, overwriting their previous information. `info [cape/team] [text]`. Can also change age or pronouns with `,info (cape) ('age'/'pronoun') (input).",
}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}