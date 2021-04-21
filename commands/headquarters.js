const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");

//modules
const capeModule = require(`${filePath}/cape.js`);
const infoModule = require(`${filePath}/stats.js`);
const customModule = require("../chargen/customs.js");
const leaderboardModule = require('./leaderboard.js')

var maxUpgrades = 5;
const upgradeCosts = [
    1000, 
    2500,
    10000,
    25000,
]

const upgradeInfo = [
    "",
    ", gain multi-scouting",
    ", gain class scouting",
    ", scout experienced capes"
]

module.exports.run = async (client, message, args) =>{
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }
    var currentlv = 1;
    if (teamData.HQ){
        currentlv = teamData.HQ;
    }
    if (currentlv == maxUpgrades){
        message.reply("Your HQ has maximum upgrades.");
        return;
    }
    if (teamData.funds >= upgradeCosts[currentlv-1]){
        teamData.funds = teamData.funds-upgradeCosts[currentlv-1];
        teamData["HQ"] = currentlv+1;
        await client.teamsDB.set(`${message.author.id}`, teamData);
        leaderboardModule.update(client,teamData);

        var upgradeText = `Unlocked 2 cape slots and 4 armory slots.`

        switch(teamData["HQ"]){
            case(3):
                upgradeText+= "You may now scout multiple capes and then choose the one you want with `,scout (2-3)` each additional option costs +$100."
                break;
            case(4):
                upgradeText+= "You may now scout specific classes `,scout (class)` each offer costs +$1000 per cape."
                break;
            case(5):
                upgradeText+= "You now scout capes up to level 5!"
                break;
        }
        message.reply("Upgraded HQ to lv"+(currentlv+1)+"! "+upgradeText)

    }else{
        message.reply("You do not have enough funds to upgrade.")
    }

}

module.exports.getMaxCapes = (team)=>{
    if (!team.HQ){
        return 2
    }
    else{
        return (team.HQ*2)
    }
}

module.exports.getMaxReserve = (team)=>{
    if (!team.HQ){
        return 2
    }
    else{
        return (team.HQ*2)
    }
}

module.exports.getMaxItems = (team)=>{
    if (!team.HQ){
        return 7
    }
    else{
        return (team.HQ*7)
    }
}
module.exports.getMaxCapes = (team)=>{
    if (!team.HQ){
        return 2
    }
    else{
        return (team.HQ*2)
    }
}

module.exports.getNextData = (team)=>{ //returns text of the next HQ upgrade price and the benefits
    var lv = 1
    if (team.HQ){
        lv = team.HQ
    }
    var result = `Upgrade: $${upgradeCosts[lv-1]}\n+2 Capes +4 Items${upgradeInfo[lv-1]}`
    

    if (lv == maxUpgrades){
        result = ""//("Max Level")
    }
    //console.log(result)
    return result;
}


module.exports.help = {
    name: "upgrade",
    description: "Upgrades your HQ to the next level.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}