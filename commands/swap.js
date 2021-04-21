const {readdirSync, realpath} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const levelModule = require('../structures/search');
const statsModule = require(`${filePath}/stats.js`)

const abrevKeywords = {
    ["level"]: 'level',
    ["xp"]: 'level',
    ["lv"]: 'level',
    ["l"]: 'level',

    ["strength"]: 'strength',
    ["str"]: 'strength',
    ["s"]: 'strength',

    ["vitality"]: 'vitality',
    ["vit"]: 'vitality',
    ["v"]: 'vitality',

    ["utility"]: 'utility',
    ["utl"]: 'utility',
    ["u"]: 'utility',

    ["control"]: 'control',
    ["ctr"]: 'control',
    ["c"]: 'control',

    ["technique"]: 'technique',
    ["teq"]: 'technique',
    ["tech"]: 'technique',
    ["t"]: 'technique',

}


async function sort(client,message,args,teamData){
    const sortStyle = abrevKeywords[args[0].toLowerCase()]
    function capeSort(a,b){
       switch(sortStyle){
            case("level"):
                if (a.level == b.level){
                    return (b.xp-a.xp)
                }
                return(b.level-a.level)
            case("strength"):
                return(b.strength-a.strength)

            case("vitality"):
                return(b.vitality-a.vitality)

            case("utility"):
                return(b.utility-a.utility)
            case("control"):
                return(b.control-a.control)

            case("technique"):
                return(b.technique-a.technique)
        }
    }

    teamData.capes = teamData.capes.sort(capeSort)
    await client.teamsDB.set(`${message.author.id}`, teamData);
    message.reply(statsModule.teamDisplay(teamData));
}


module.exports.run = async (client, message, args) =>{

    const teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }

    if (message.content.substring(1,5)=='sort'){
        if (args[0] && abrevKeywords[args[0].toLowerCase()]){
            await sort(client,message,args,teamData);
            return
        }
        else{
            message.reply("You can sort by: `level/strength/vitality/utility/control/technique`");
            return;
        }
        
    }

    var capeA = teamData.capes[args[0]-1] || null;
    var capeB = teamData.capes[args[1]-1] || null;

    if (capeA && capeB){
        teamData.capes[args[0]-1] = capeB;
        teamData.capes[args[1]-1] = capeA;
        await client.teamsDB.set(`${message.author.id}`, teamData);
        message.reply(`Swapped ${capeA.name} & ${capeB.name} positions.`);
        return;

    }else{
        message.reply("Could not identify an input cape.");
        return;
    }
      
}

module.exports.help = {
    name: "swap",
    description: "Swap: Change the position of your teams capes: `,swap (id #1) (id #2)`\n"+
    "Sort: Sword your capes in decending order by level/str/vit/utl/ctr/teq: `,sort (filter)`",
}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}

