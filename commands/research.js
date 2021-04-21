const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const searchModule = require('../structures/search');
const powerModule = require('../chargen/powers')

const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]

module.exports.run = async (client, message, args) =>{
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }

    if (args[0]){
        var compiledList = [...teamData.capes]
        if (teamData['reservedcapes']){
            compiledList = [...teamData.capes, ...teamData.reservedcapes]
        }

        var targetCape = compiledList[args[0]-1] || "null"

        // if they typed the name of the cape
        if (targetCape == "null") {
            var results = searchModule.fillCapes(args.join(' '), compiledList, 1);
            var collection = results[0];
            if (collection[0]){
                targetCape = collection[0];
            }
        }
        if (targetCape == "null"){
            message.reply("Could not identity cape."); 
            return;
        }

        if (targetCape.class != "Tinker"){
            message.reply(`${targetCape.name} is not a tinker. They have no research.`);
            return;
        }
        var saveMe = false;
        //console.log("checking for rebound moive")

        for (let i = 0; i < targetCape.power['ResearchClasses'].length;i++){
            if (targetCape.power['ResearchClasses'][i] == "Rebound"){
                targetCape.power['ResearchClasses'][i] = "Blitz";
                saveMe = true;
            }
            if (targetCape.power['ResearchClasses'][i] == "Damage"){
                targetCape.power['ResearchClasses'][i] = "Flurry";
                saveMe = true;
            }
            
        }
        for (let i = 0; i < targetCape.power['UnlockedClasses'].length;i++){
            if (targetCape.power['UnlockedClasses'][i] == "Rebound"){
                targetCape.power['UnlockedClasses'][i] = "Blitz";
                saveMe = true;
            }
            if (targetCape.power['UnlockedClasses'][i] == "Damage"){
                targetCape.power['UnlockedClasses'][i] = "Flurry";
                saveMe = true;
            }
            
        }

        if (!targetCape.power.subclass){
            saveMe = true;
        }
        //console.log("saving")
        var mySubclass = powerModule.getSubclass(targetCape);

        if (args[1]){
            if (targetCape.activity != "none"){
                message.reply("You can not change focuses in the middle of an operation or while reserved.")
                return;
            }
            var found = false;
            for (let tech of targetCape.power['UnlockedClasses']){
                if (args[1].toLowerCase() == tech.toLowerCase()){
                    targetCape.power['subclass'] = tech;
                    message.reply("Changed current focus to "+tech+".")
                    saveMe = true;
                    found = true
                }
            }
            if (!found){
                message.reply(`${targetCape.name} does not have that researched.`)
            }
        }else{
            // check to see if they unlocked anything
            for (var i = 0; i < targetCape.power.ResearchClasses.length;i++){
                if (targetCape.level >= i*2 && targetCape.power.UnlockedClasses.lastIndexOf(targetCape.power.ResearchClasses[i]) == -1){
                    targetCape.power.UnlockedClasses.push(targetCape.power.ResearchClasses[i]);
                }
            }
            message.reply(`${targetCape.name}'s current focus: ${mySubclass}\nResearch: ${targetCape.power.UnlockedClasses.join(" | ")}`)
        }

        await client.teamsDB.set(`${message.author.id}`, teamData);
        return;
    }

    message.reply("Change the focus of your tinker's research! `,research [tinker] [focus]`");
}

module.exports.help = {
    name: "research",
    description: "Change your tinker's focus.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}
module.exports.limits = {
    ratelimit: 3,
    cooldown: 1000*5
}
