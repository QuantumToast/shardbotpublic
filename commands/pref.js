const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");
const {publicguilds} = require("../config.js");

//modules
const capeModule = require(`${filePath}/cape.js`);
const searchModule = require('../structures/search');
const mapModule = require(`${filePath}/maps.js`);


const teamColors = {
    ['pink']: "#FF61E2",
    ['red']: "#ff3300",
    ['orange']: "#ff9900",
    ['yellow']: "#ffff00",
    ['lime']: "#99FF33",
    ['green']: "#00D166",
    ['turquoise']: "#40E0D0",
    ['blue']: "#3333ff",
    ['purple']: "#9900cc",
    ['grey']: "#808080",
    ['black']: "#262626",
}

function checkIfPublicChannel(channel){
    
}


module.exports.run = async (client, message, args) =>{
    // console.log(message.author);
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }
    if (!teamData.preferences){
        teamData['preferences'] = {
            ["ping"]: "all",
            ['usercolor']: "green",
            ['color']: "GREEN",
            ['trade']: "yes",
        }
    }
    
    // console.log(client.users.cache.get(teamData.userid))

    if (!args[0]){
        message.reply("Your current preferences: \n"+ 
        "ping: "+teamData.preferences.ping+"\n"+
        "color: "+teamData.preferences.usercolor+"\n"+
        `trade: ${(teamData.preferences["trade"] || "yes")}\n`+
        `display: ${(teamData.preferences["display"] || "emoji")}\n`+
        `recovery: ${(teamData.preferences["recovery"] || "yes")}`
        )
        return;
    }

    var save = true;

    switch(args[0]){
        case "ping":
            switch(args[1]){
                case "all":
                    teamData.preferences.ping = 'all';
                    message.reply("Set ping to `all`. You get pinged each time an operation is completed.")
                    break;
                case "done":
                    teamData.preferences.ping = 'done';
                    message.reply("Set ping to `done`. You will get pinged when your team finishes an operation type.")
                    break;
                case "none":
                    teamData.preferences.ping = 'none';
                    message.reply("Set ping to `none`. You will not get pinged when an operation is completed.")
                    break;
                case "private":
                    teamData.preferences.ping = 'private';
                    message.reply("Set ping to `private`. Operation messages will be PMed to you.")
                    break;
                case "respond":
                    teamData.preferences.ping = 'respond';
                    message.reply("Set ping to `respond`. You will only be pinged when your mission is intercepted.")
                    break;
                default:
                message.reply("Invalid option, use `all / done / none / private / respond`")
                save = false;
            }
            break;
        case "color":
            if (args[1] && teamColors[args[1].toLowerCase()]){
                teamData.preferences.usercolor = args[1].toLowerCase();
                teamData.preferences.color = teamColors[args[1].toLowerCase()];
                message.reply("Set team color to "+teamData.preferences.usercolor);
                mapModule.updateFlavor(client,teamData);

                save = true;
            }else if (args[1] && args[1].charAt(0) === "#" && args[1].length == 7 ){
                teamData.preferences.usercolor = args[1];
                teamData.preferences.color =args[1];
                message.reply("Custom set team color to "+teamData.preferences.usercolor);
                mapModule.updateFlavor(client,teamData);

                save = true;
            }            
            else
            {
                message.reply("Invalid color, try `pink/red/orange/yellow/lime/green/turquoise/blue/purple/grey/black` you can also submit a custom hex color (#+6 characters).")
            }

            break;
        case "trade":
                if (args[1] && (args[1] == "no" ||args[1] == "yes" )){
                    teamData.preferences['trade'] = args[1];
                    message.reply("Set trade requests to "+teamData.preferences['trade']);
                    save = true;
                }else
                {
                    message.reply("Invalid setting, use `yes/no`")
                }
                break;
        case "display":
            if (args[1] && (args[1] == "text" ||args[1] == "emoji" )){
                teamData.preferences['display'] = args[1];
                message.reply("Set display to "+teamData.preferences['display']);
                save = true;
            }else
            {
                message.reply("Invalid setting, use `text/emoji`")
            }

            break;
        case "recovery":
            if (args[1] && (args[1] == "no" ||args[1] == "yes" )){
                teamData.preferences['recovery'] = args[1];
                message.reply("Set recovery notifications to "+teamData.preferences['recovery']);
                save = true;
            }else
            {
                message.reply("Invalid setting, use `yes/no`")
            }
            break;
        
        default:
            message.reply("Invalid setting.");
            save = false;

    }


    if (save){
        await client.teamsDB.set(`${message.author.id}`, teamData);
    }
    
}

module.exports.help = {
    name: "pref",
    description: "Adjust your game preferences. `,pref [setting] [option]`\n"+
    "[ping]: Which operations you get pinged for: `all / done / none / private`. `done` pings you on the last completed operation of each type.\n"+
    "[color]: Menu/Stat Color: `pink/red/orange/yellow/lime/green/turquoise/blue/purple/grey/black` Can also set a custom  hex code.\n"+
    "[trade]: Accepting trade requests: `yes/no`\n"+
    "[display]: Stats displayed as `text` or shortened in `emoji`"+'\n'+
    "[recovery]: PMed when your capes recovery from an operation: `yes,no`"

}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}