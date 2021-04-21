const {readdirSync, realpath} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const capeModule = require(`${filePath}/cape.js`)
const searchModule = require('../structures/search');
const armoryModule = require('../structures/armory')
const HQModule = require(`./headquarters`)
const denyImage = "https://upload.wikimedia.org/wikipedia/commons/b/bc/Not_allowed.svg"

const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"

]
const statEmojis = {
    ["strength"]: "👊",
    ["vitality"]: "❤️",
    ["utility"]: "⚡",
    ["control"]: "⌚",
    ["technique"]: "🎯",
}
const classEmojis = {
    ["Brute"]: "🛡️",
    ["Striker"]: "🥊",
    ["Blaster"]: "☄️",
    ["Tinker"]: "🔧",
    ["Thinker"]: "🧠",
    ["Master"]: "🕹️",
    ["Shaker"]: "⛰️",
    ["Stranger"]: "👻",
    ["Changer"]: "🦈",
    ["Breaker"]: "✨",
    ["Mover"]: "🥏",
    ["Trump"]: '♻️'
}

module.exports.teamDisplay = function (team){
    var result = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(team.name)
    //.addField("**Funds**", "$"+team.funds,true)
    //.addField("**Reputation**", team.reputation, true)
    //.addField(`HQ lv${team['HQ'] || "1"}`, HQModule.getNextData(team),true);

    var statInfo = `💰 $${team.funds}\n`
    if (team.reputation > 50){
        statInfo+=`🏅 ${team.reputation}`
    }else if (team.reputation < -50){
        statInfo+=`☠️ ${team.reputation}`
    }else {
        statInfo+=`🎉 ${team.reputation}`
    }

    result.addField("**Stats**",statInfo,true)

    var HQInfo;
    
    if (team["HQLocal"]){
        HQInfo = `🏙️ ${team["HQLocal"][0]}`
    }else{
        HQInfo = `🏙️ **No Location**\nUse ${"`,map hq [district]`"} to place your team.`
    }
    HQInfo+="\n🏢 "+`lv${team['HQ'] || "1"}`
    HQInfo+=`\n${HQModule.getNextData(team)}`

    result.addField("**Headquarters**",HQInfo,true)


    if (team['preferences'] && team['preferences']['color']){
        result.setColor(team.preferences.color)
    }
    if (team["image"] && team["image"]["approved"]){
        result.setThumbnail(team["image"]['url']);
    }
    if (team["image"] && team["image"]["denied"]){
        result.setThumbnail(denyImage);
    }

    // adding capes
    var count = 0;
    const spaceChar = `\xa0`;

    var longestCharName = 0;
    for (cape of team.capes){
        if (cape.name.length > longestCharName){
            longestCharName = cape.name.length+1
        }
    }
    var infoBar = [];
    var info = "";
    for (let cape of team.capes){

        count++;
        var repeats = longestCharName-cape.name.length;
        if (repeats < 1){ repeats = 1;}
        if (count > 9){
            repeats--;
        }
        info += classEmojis[cape.class]
        info += "`"+count+" "+cape.name+""+spaceChar.repeat(repeats)
        if (cape.level){
            info+=" lv"+cape.level
        }else{
            info+=" lv1"
        }

        //cape.class+
        var battlestats = {
            ["strength"]: cape.strength,
            ["vitality"]: cape.vitality,
            ["utility"]: cape.utility,
            ["control"]: cape.control,
            ["technique"]: cape.technique,
        }
        armoryModule.calculateStats(battlestats,cape.items)

        if (team.preferences && team.preferences.display && team.preferences["display"] =="text"){
            info+=
            " | S-"+battlestats.strength;
            if (battlestats.strength < 10){
                info+=" "
            }
            info+="| V-"+battlestats.vitality;
            if (battlestats.vitality < 10){
                info+=" "
            }
            info+="| U-"+battlestats.utility
            if (battlestats.utility < 10){
                info+=" "
            }
            info+="| C-"+battlestats.control
            if (battlestats.control < 10){
                info+=" "
            }
            info+="| T-"+battlestats.technique
            if (battlestats.technique < 10){
                info+=" "
            }
            info+="`\n";
        }else{
            //default emoji settings
            info+="`"+
            `${statEmojis['strength']}`+battlestats.strength;
            if (battlestats.strength < 10){
                info+=" "
            }
            info+=`${statEmojis['vitality']}`+battlestats.vitality;
            if (battlestats.vitality < 10){
                info+=" "
            }
            info+=`${statEmojis['utility']}`+battlestats.utility
            if (battlestats.utility < 10){
                info+=" "
            }
            info+=`${statEmojis['control']}`+battlestats.control
            if (battlestats.control < 10){
                info+=" "
            }
            info+=`${statEmojis['technique']}`+battlestats.technique
            if (battlestats.technique < 10){
                info+=" "
            }
            info+="\n";
        }
        if (count%15 == 0){ // change to 5 for page
            infoBar.push(info);
            info = ""
        }
    }

    result.addField(`**Capes ${team.capes.length}/${HQModule.getMaxCapes(team)}**`, info, false);

    if (team.info){
        result.addField('**Info**', team.info, false);
    }
    if (!team.HQ || team.HQ < 5){
        result.setFooter("Upgrade your HQ: ,upgrade\nAdd a logo: ,pic\nSwap capes: ,swap")
    }
    return result;
}


module.exports.run = async (client, message, args) =>{
    const teamData = await client.teamsDB.get(`${message.author.id}`, 0);
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
        capeModule.showData(targetCape, message, targetCape.name+" | Character Card");
        return;
    }
    //team info
    message.reply(this.teamDisplay(teamData));
}

module.exports.help = {
    name: "stats",
    description: "Shows user's stat cards",
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
