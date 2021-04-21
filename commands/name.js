const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const capeModule = require(`${filePath}/cape.js`);
const searchModule = require('../structures/search');
const mapModule = require(`${filePath}/maps.js`);

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

    // renaming team
    if ((args.join(" ").indexOf(".")) != -1 || (args.join(" ").indexOf("\r")) != -1 || (args.join(" ").indexOf("\n")) != -1 ){
        message.reply("Invalid naming character.");
        return;
    }

    if (args[0].toLowerCase() == "team" && args[1]){
        args.splice(0,1)
        var name = args.join(" ");
        if (name.length > 20){
            message.reply("Name is too long. Max is 20 characters."); 
            return;
        }

        teamData.name = name;
        message.reply("Set team name to " + name);
        await client.teamsDB.set(`${message.author.id}`, teamData);
        mapModule.updateFlavor(client,teamData);
        return;
       
    }else if (args[0].toLowerCase() == "team"){
        message.reply("Invalid team name.");
    }

    // naming capes
    var argCat = args.join(' ');
    //console.log('['+argCat+']');
    if (args[0].toLowerCase() != "team" && args[1]){
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

        const name = argCat.substring(offset);
        if (name.length > 20){
            message.reply("Name is too long. Max is 20 characters."); 
            return;
        }
        message.reply("Changed " + targetCape.name + "'s name to "+name+".");
        targetCape.name = name;
        await client.teamsDB.set(`${message.author.id}`, teamData);

        return;
    }
    /*else if (args[0].toLowerCase() == "cape"){
        message.reply("needs a second argument. Either the cape's name or their number");
    }*/
     
    if (args[0].toLowerCase() != 'team' && args[0].toLowerCase() != 'cape'){
        message.reply("Invalid new cape name");
    }
    
}

module.exports.help = {
    name: "name",
    description: "Rename your team or capes. `,name team [teamname]` or `,name [cape] [newname]`",
}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}