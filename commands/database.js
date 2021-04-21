const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const capeModule = require(`${filePath}/cape.js`)
const statsModule = require(`${filePath}/stats.js`)

const searchModule = require('../structures/search');
const { arch } = require('os');

var currentDate = null;
var database = null;
module.exports.run = async (client, message, args) =>{

    if (args[0] && args[0].length >= 3){
        let argConcat = args.join(" ");

        const newDate = new Date();
        if (newDate.getTime() > currentDate.getTime()+(300000) || database == null) {
            database = await client.teamsDB.getAll();
        }


        var teamResults = searchModule.fillFromDatabase(argConcat,database,1);
        if (teamResults[1] >= 3){
            var teamData = teamResults[0][0];
            if (argConcat.lastIndexOf(" ")>=teamResults[1]-1){//showing a cape
                var searchedName = argConcat.substring(teamResults[1]);
                var capeResults = searchModule.fillCapes(searchedName,teamData.capes,1);
                if (capeResults[1] > 2){
                    capeModule.showData(capeResults[0][0], message, capeResults[0][0].name+" | "+teamData.name);
                    return
                }
                else{
                    message.reply("Could not identify cape, needs more accurate characters.")
                }
            }else{
                //console.log(argConcat);
                //console.log(argConcat.lastIndexOf(" "));
                //console.log(teamResults[1]);
                message.reply(statsModule.teamDisplay(teamData));
                return;
            }
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
    name: "search",
    description: "Look up other teams and their cape roster. Has a delay to prevent spams to the database search.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}
module.exports.limits = {
    ratelimit: 1,
    cooldown: 1000*10
}
module.exports.setup = async ()=>{
    currentDate = new Date();
}