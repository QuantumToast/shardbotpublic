const {readdirSync} = require('fs');
const { join } = require("path");

const filePath = join(__dirname,"..","commands");
const { MessageCollector, MessageEmbed} = require("discord.js");
const searchModule = require('../structures/search');
const mapModule = require(`${filePath}/maps.js`);



const filterShortcuts = {
    ["h"]: "hero",
    ["heroic"]: "hero",
    ["good"]: "hero",
    ["hero"]: "hero",

    ["v"]: "villain",
    ['villain']:'villain',
    ['villainous']:'villain',
    ['evil']: 'villain',
    ['bad']: 'villain',
    ["money"]: "funds",
    ["m"]: "funds",
    ["rich"]: "funds",
    ["r"]: "funds",
    ["cash"]: "funds"

}

const districts= ["Bronx","Manhattan","Queens","Brooklyn","Staten Island"]
const crownIcon = "https://i.pinimg.com/originals/f0/91/ea/f091ea0ddd3a86b4a6118ba2bb572045.png"


var topBoard = 10 //how many people appear
//leader boards are array of paired elements: [teamid, value] 
var quickLeaderboard = 5;

var myVillainBoard = [];
var myHeroBoard = [];
var myMoneyBoard = []

var cachedFunds = []; //{teamname, value}
var cachedHeros = [];
var cachedVillains = [];
var newFunds = true;
var newHeros = true;
var newVillains = true;

const heroRoleID= '783121530375897089';
const villainRoleID= '783121635037020211';


async function update(client){
    if (myHeroBoard.length == 0){
        myHeroBoard = await client.leaderboardDB.get('HeroRep',[]);
    }
    if (myVillainBoard.length == 0){

        myVillainBoard = await client.leaderboardDB.get('VillainRep',[]);
    }
    if (myMoneyBoard.length == 0){
        myMoneyBoard = await client.leaderboardDB.get('MoneyRep',[]);
    }
}


module.exports.run = async (client, message, args) =>{
    await update(client)

    var result = new MessageEmbed()
    .setColor("#FFCC00")
    .setAuthor("Shardbot Leaderboards")
    .setThumbnail(crownIcon);
    var myLength = quickLeaderboard;

    var funds = "";
    var heros = "";
    var villains = "";
    var authority = "";
    var board = ""
    if (newFunds){
        cachedFunds = []
        for (var i = 0; i<topBoard;i++){
            var lead = myMoneyBoard[i];
            if (lead){
                var teamData = await client.teamsDB.get(lead[0],null);
                if (teamData){
                    cachedFunds.push({
                        ["name"]: teamData['name'],
                        ["value"]: lead[1],
                    })
                }
            }
        }
        newFunds = false;
    }
    if (newHeros){
        cachedHeros = []
        for (var i = 0; i<topBoard;i++){
            var lead = myHeroBoard[i];
            if (lead){
                var teamData = await client.teamsDB.get(lead[0],null);
                if (teamData){
                    cachedHeros.push({
                        ["name"]: teamData['name'],
                        ["value"]: lead[1],
                    })
                }
            }
        }
        newHeros = false;
    }
    if (newVillains){
        cachedVillains = []
        for (var i = 0; i<topBoard;i++){
            var lead = myVillainBoard[i];
            if (lead){
                var teamData = await client.teamsDB.get(lead[0],null);
                if (teamData){
                    cachedVillains.push({
                        ["name"]: teamData['name'],
                        ["value"]: lead[1],
                    })
                }
            }
        }
        newVillains = false;
    }

    if (args[0] && filterShortcuts[args[0].toLowerCase()]){
        myLength = topBoard
        switch(filterShortcuts[args[0].toLowerCase()]){
            case("hero"):
                var count = 0;
                for (let lead of cachedHeros){
                    heros += `**${++count}. ${lead.name}** | +${lead.value} Rep\n`;
                }
                break;
            case("villain"):
                var count = 0;
                for (let lead of cachedVillains){
                    villains += `**${++count}. ${lead.name}** | ${lead.value} Rep\n`;
                }
                break;
            case("funds"):
                var count = 0;
                for (let lead of cachedFunds){
                    funds += `**${++count}. ${lead.name}** | ${lead.value}\n`;
                }
                break;
        }
    }else if (args[0] && searchModule.fillStrings(args[0],districts)[0].length > 0){
        const district = searchModule.fillStrings(args[0],districts)[0][0]
        const currentBoard = await mapModule.returnDistrictBoard(client,district);
        authority = `**__${district} Authority__**`;

        function authSort(a,b){
            return(b[1]-a[1])
        }

        var sortedBoard = currentBoard.sort(authSort);
        for (let i = 0; i < 10 && i <sortedBoard.length;i++){
            const leaderData = await client.teamsDB.get(sortedBoard[i][0],null)
            if (leaderData){
                board+=`**${i+1}. ${leaderData.name}** | 🏆 ${sortedBoard[i][1]}\n`
            }else{
                board+=`**${i+1}. [PENDING]** | 🏆 ${sortedBoard[i][1]}\n`
            }
        }
    }
    else{
        var count = 0;
        for (let i = 0; i < cachedFunds.length && i < quickLeaderboard;i++){
            let lead = cachedFunds[i]
            funds += `**${++count}. ${lead.name}** | $${lead.value}\n`;
        }
        count = 0;
        for (let i = 0; i < cachedHeros.length && i < quickLeaderboard;i++){
            let lead = cachedHeros[i]
            heros += `**${++count}. ${lead.name}** | +${lead.value} Rep\n`;
        }
        count = 0;
        for (let i = 0; i < cachedVillains.length && i < quickLeaderboard;i++){
            let lead = cachedVillains[i];
            villains += `**${++count}. ${lead.name}** | ${lead.value} Rep\n`;
        }
    }

    if (funds != ""){
        result.addField("__Richest Teams__",funds)
    }
    if (heros != ""){
        result.addField("__Top Heros__",heros)
    }
    if (villains != ""){
        result.addField("__Top Villains__",villains)
    }
    if (authority != ""){
        result.addField(authority,board)
    }
    message.reply(result);

}   

module.exports.update = async(client,teamData,tempMessage)=>{//called by operations
    await update(client)
    var fundIndex = 0;
    var heroIndex = 0;
    var villainIndex = 0;

    while (myMoneyBoard[fundIndex] && fundIndex < topBoard && (myMoneyBoard[fundIndex][1] > teamData.funds)){
        fundIndex++;
    }
    if (fundIndex < topBoard ){
        newFunds = true;

        myMoneyBoard.splice(fundIndex,0,[teamData.userid,teamData.funds])//adding
        
        for (var i = 0; i <myMoneyBoard.length;i++){//clearing previous data (if any)
            if (myMoneyBoard[i][0] == teamData.userid && i!=fundIndex){
                myMoneyBoard.splice(i,1)
            }
        }
        if (myMoneyBoard[topBoard]){ //removing top
            myMoneyBoard.splice(topBoard,1);
        }

        await client.leaderboardDB.set('MoneyRep',myMoneyBoard);

    }else{
        //removing previous if they have any
        for (var i = 0; i <myMoneyBoard.length;i++){//clearing previous data (if any)
            if (myMoneyBoard[i][0] == teamData.userid){
                myMoneyBoard.splice(i,1)

                client.leaderboardDB.set('MoneyRep',myMoneyBoard);

            }
        }
    }

    if (teamData.reputation > 0){ //check heros
        while (myHeroBoard[heroIndex] && heroIndex < topBoard && (myHeroBoard[heroIndex][1] > teamData.reputation)){
            heroIndex++;
        }
        if (heroIndex < topBoard ){
            newHeros = true;
    
            myHeroBoard.splice(heroIndex,0,[teamData.userid,teamData.reputation])//adding
            
            for (var i = 0; i <myHeroBoard.length;i++){//clearing previous data (if any)
                if (myHeroBoard[i][0] == teamData.userid && i!=heroIndex){
                    myHeroBoard.splice(i,1)
                }
            }
            if (myHeroBoard[topBoard]){ //removing top
                myHeroBoard.splice(topBoard,1);
            }

            await client.leaderboardDB.set('HeroRep',myHeroBoard)

        }else{
            //removing previous if they have any
            for (var i = 0; i <myHeroBoard.length;i++){//clearing previous data (if any)
                if (myHeroBoard[i][0] == teamData.userid){
                    myHeroBoard.splice(i,1);

                    await client.leaderboardDB.set('HeroRep',myHeroBoard)
                }
            }
        }
    }
    if (teamData.reputation < 0){ //check villains
        while (myVillainBoard[villainIndex] && villainIndex < topBoard && (myVillainBoard[villainIndex][1] < teamData.reputation)){
            villainIndex++;
        }
        if (villainIndex < topBoard ){
            newVillains = true;
    
            myVillainBoard.splice(villainIndex,0,[teamData.userid,teamData.reputation])//adding
            
            for (var i = 0; i <myVillainBoard.length;i++){//clearing previous data (if any)
                if (myVillainBoard[i][0] == teamData.userid && i!=villainIndex){
                    myVillainBoard.splice(i,1)
                }
            }
            if (myVillainBoard[topBoard]){ //removing top
                myVillainBoard.splice(topBoard,1);
            }

            await client.leaderboardDB.set('VillainRep',myVillainBoard);

        }else{
            //removing previous if they have any
            for (var i = 0; i <myVillainBoard.length;i++){//clearing previous data (if any)
                if (myVillainBoard[i][0] == teamData.userid){
                    myVillainBoard.splice(i,1)

                    await client.leaderboardDB.set('VillainRep',myVillainBoard);
                }
            }
        }


    }

    // removing hero/villain roles on washed players
    var myGuild = await client.guilds.cache.get('704458319850373151');
    var myMember = await myGuild.members.cache.get(teamData.userid);
    if  (myMember){
        // hero checko
        if (teamData.reputation < 1000 && myMember.roles.cache.get(heroRoleID)){
            const role = myGuild.roles.cache.get(heroRoleID);
            myMember.roles.remove(role).catch(console.error);
        }
        // villain checko
        if (teamData.reputation > -1000 && myMember.roles.cache.get(villainRoleID)){
            const role = myGuild.roles.cache.get(villainRoleID);
            myMember.roles.remove(role).catch(console.error);
        }
    }
}



module.exports.help = {
    name: "leaderboard",
    description: "Shows top team stats. Can sort by alignment/money/district to see top 10.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}

module.exports.limits = {
    ratelimit: 3,
    cooldown: 2e4
}