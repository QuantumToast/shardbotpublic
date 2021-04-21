/*
- To Do -
new rewards

*/

const leaderID= '783331011253633135';

const leaderRoles = {
    ["Brooklyn"]: '783337748769013791',
    ["Bronx"]: '783337969213636618',
    ["Staten Island"]: '783338032643309609',
    ["Manhattan"]: '783338083730194473',
    ["Queens"]: '783338124112953354',

}

const { join } = require("path");
const Canvas = require('canvas');
const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const searchModule = require('../structures/search');
const decreeModule = require('./decree');
const { table } = require("console");

var loadedMap = false;
var lastDecay = null;

const decayRate = .95;

const mapsDirName = join(__dirname,'../assets/maps')


var tributeBank = 0;

// movement costs by HQ level
const hqMoveCosts = [
    50,
    2000,
    40000,
    80000,
    200000,
]


//defaultTeamcolors
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


const maps = [
    {name: "New York",
    
    districts: ["Bronx","Manhattan","Queens","Brooklyn","Staten Island"]
    },
]

var mapData = {
    ["Bronx"]: {
        holder: "None",
        color: "#FFFFFF",
        authority: 0,
        holderid: 0,
    },
    ["Manhattan"]: {
        holder: "None",
        color: "#FFFFFF",
        authority: 0,
        holderid: 0,
    },
    ["Queens"]: {
        holder: "None",
        color: "#FFFFFF",
        authority: 0,
        holderid: 0,
    },
    ["Brooklyn"]: {
        holder: "None",
        color: "#FFFFFF",
        authority: 0,
        holderid: 0,
    },
    ["Staten Island"]: {
        holder: "None",
        color: "#FFFFFF",
        authority: 0,
        holderid: 0,
    }
}


// mapAuthorityBoard should be, [userid, auth]

var mapAuthorityBoard = {
    ["Bronx"]: [],
    ["Manhattan"]: [],
    ["Queens"]: [],
    ["Brooklyn"]: [],
    ["Staten Island"]: []
}

async function update(client){
    //loading map
    if (!loadedMap){
        mapData = await client.questsDB.get("MapData", mapData);
        mapAuthorityBoard = await client.questsDB.get("MapAuthority", mapAuthorityBoard);
        lastDecay = await client.questsDB.get("MapDecayDate",null);
        loadedMap = true;
    }
    //checking decay
    if (lastDecay == null){
        lastDecay = new Date().getDay();
    }
    if (lastDecay != new Date().getDay()){
        //run decay/filter (.95%, remove if under 1)

        function decayPair(pair) {
            pair[1] = Math.floor(pair[1]*decayRate);
            for (let district of maps[0].districts){
                if (pair[0]==mapData[district].holderid){
                    mapData[district].authority = pair[1];
                }
            }
            return (pair[1] >=1);
        }
        for (let district of maps[0].districts){
            mapAuthorityBoard[district] = mapAuthorityBoard[district].filter(decayPair)
        }

        lastDecay = new Date().getDay()
        
        await client.questsDB.set("MapDecayDate",lastDecay)
    }

}

async function setHQLocal(client,message,args){
    if (!args[1]){
        message.reply("Select one of the districts in New York to set your HQ in: "+`[ ${maps[0].districts.join(" / ")} ]`)
        return;
    }
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData ==0){
        message.reply("You do not have game data. Type `,start` to begin!")
        return;
    }
    if (!teamData["HQLocal"]){
        var strength = 0;
        var currentDistrict = "";
        for (let city of maps){
            var result = searchModule.fillStrings(args[1],city.districts,1);
            if (result[1] > strength){
                currentDistrict = result[0][0]
            }
        }
        if (!currentDistrict || currentDistrict.length == 0){
            message.reply("Could not find the target district.");
            return;
        }

        teamData["HQLocal"] = [currentDistrict];
        await client.teamsDB.set(`${message.author.id}`, teamData)
        message.reply(`${teamData.name}'s headquarters are now located in ${currentDistrict}. They will not be penalized for failing missions there. `);

    }else{
        var strength = 0;
        var currentDistrict = "";
        for (let city of maps){
            var result = searchModule.fillStrings(args[1],city.districts,1);
            if (result[1] > strength){
                currentDistrict = result[0][0]
            }
        }
        if (currentDistrict.length == 0){
            message.reply("Could not find the target district.");
            return;
        }
        
        const offer = await message.channel.send("React with 🧳 in the next 5 minutes to move your headquarters to: "+currentDistrict+
        ` for $${hqMoveCosts[(teamData.HQ || 1)-1]}.` );

        offer.react("🧳");  
        const filter = (reaction, user) => {
            return reaction.emoji.name === '🧳' && user.id === message.author.id;
        };
        
        offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
        .then( async collected =>  {
            teamData = await client.teamsDB.get(`${message.author.id}`, 0);
            if (teamData.funds < hqMoveCosts[(teamData.HQ || 1)-1]){
                message.reply("You do not have enough funds to move your headquarters.");
                return;
            }
            teamData.funds -= hqMoveCosts[(teamData.HQ || 1)-1];
            teamData["HQLocal"] = [currentDistrict];
            await client.teamsDB.set(`${message.author.id}`, teamData)
            message.reply(`${teamData.name}'s headquarters are now located in ${currentDistrict}. They will not be penalized for failing missions there.`);
            return;

        })
        .catch(collected => {
            message.reply('You have not responded in time.');
        });
    }
}

module.exports.run = async (client, message, args) => {

    await update(client)

    if (args[0] && args[0].toLowerCase() == "hq"){
        setHQLocal(client,message,args);
        return;
    }


    const myMap = maps[0]
    const mapName = myMap.name;
    const myDistricts = myMap.districts;

    var display = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`${mapName} Territories`);

    var terrInfo = ""

    // Set a new canvas to the dimensions of 1000x978 pixel
    const canvas = Canvas.createCanvas(1000, 978);
    // ctx means context, used to modify our canvas
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation='lighter';

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }
    
    for (let tile of myDistricts){
        var district = mapData[tile];
        //console.log(`Checking tile`)
        //console.log(district)
        terrInfo+=`**${tile}:** ${district.holder}  🏆 ${district.authority}`
        if (district['decree']){
            terrInfo+=`  ⚖️ ${district['decree']}\n*${decreeModule.getDecreeInfo(district['decree'])}*\n`
        }else{
            terrInfo+="\n"
        }
        //adding image
        var tileFolder= mapsDirName+`/${mapName}/${tile}/`
        const colorData = hexToRgb(teamColors[district.color.toLowerCase()] || district.color)

        var redTile = await Canvas.loadImage(tileFolder+`red.png`);
        ctx.globalAlpha = colorData.r/255
        ctx.drawImage(redTile,0,0,canvas.width,canvas.height);

        var blueTile = await Canvas.loadImage(tileFolder+`blue.png`);
        ctx.globalAlpha = colorData.b/255
        ctx.drawImage(blueTile,0,0,canvas.width,canvas.height);

        var greenTile = await Canvas.loadImage(tileFolder+`green.png`);
        ctx.globalAlpha = colorData.g/255
        ctx.drawImage(greenTile,0,0,canvas.width,canvas.height);
    }
    ctx.globalCompositeOperation='source-over';
    const background = await Canvas.loadImage(mapsDirName+`/${mapName}/backdrop.png`);
    ctx.globalAlpha = 1

    ctx.drawImage(background,0,0,canvas.width,canvas.height);

    //const attachment = new Discord.MessageAttachment(canvas.toBuffer());
    var attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'territorymap.png')
    display.attachFiles([attachment])
    display.setImage(`attachment://territorymap.png`)
  
    display.addField("Authorities",terrInfo)


    //add HQ data
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData != 0 ) {
        var info = ""
        if (teamData["HQLocal"]){
            // show HQ data
            var info = "HQ Location: "+teamData.HQLocal[0]

            // adding authority data as well
            var authorities = [];
            for (let city of maps){
                for (let district of city.districts){
                    for (let datapair of mapAuthorityBoard[district]){
                        if (datapair[0] == teamData.userid){
                            authorities.push([district,datapair[1]])
                        }
                    }
                }
            }
            // displaying the data
            
            if (authorities.length >0 ){
                var authList = " "
                for (let auth of authorities){
                    if (!teamData["HQLocal"].includes(auth[0])){
                        authList+=`${auth[0]} | 🏆 ${auth[1]}\n`
                    }else{
                        authList =`**${auth[0]}** | 🏆 ${auth[1]}\n` + authList
                    }
                }
                display.addField(info,authList)
            }else{
                display.setFooter(info);
            }
            display.setFooter(`Change HQ ($${hqMoveCosts[(teamData.HQ || 1)-1]}): ,map HQ [district]`)
        }else{
            info = "Set an HQ with `,map HQ [district]`"
            display.setFooter(info);
        }
    }
    

    message.reply(display);

}


async function checkLeaderRoles(client,teamData){

    if (!teamData){
        return;
    }

    var isLeader = false;
    var ownedDistricts = [];

    for (let map of maps){
        for (let district of map.districts){
            if (mapData[district].holderid==teamData.userid){
                isLeader = true;
                ownedDistricts.push(district)
            }
        }
    }

    var myGuild = await client.guilds.cache.get('704458319850373151');
    var myMember = await myGuild.members.fetch(teamData.userid);
    if  (myMember){

        // removing leader role if they have it
        if (!isLeader && myMember.roles.cache.get(leaderID)){
            const leaderRole = myGuild.roles.cache.get(leaderID);

            myMember.roles.remove(leaderRole).catch(console.error);
            for (let map of maps){
                for (let district of map.districts){
                    if (myMember.roles.cache.get(leaderRoles[district])){
                        const removedRole = myGuild.roles.cache.get(leaderRoles[district]);
                        myMember.roles.remove(removedRole).catch(console.error);
                    }
                }
            }
        }
        //granting leadership role/roles
        if (isLeader & !myMember.roles.cache.get(leaderID)){

            const leaderRole = myGuild.roles.cache.get(leaderID);
            myMember.roles.add(leaderRole).catch(console.error);
        }
        if (ownedDistricts.length > 0){

            for (let map of maps){
                for (let district of map.districts){
                    if (!ownedDistricts.includes(district) && myMember.roles.cache.get(leaderRoles[district])){
                        const removedRole = myGuild.roles.cache.get(leaderRoles[district]);
                        myMember.roles.remove(removedRole).catch(console.error);
                    }
                    if (ownedDistricts.includes(district) && !myMember.roles.cache.get(leaderRoles[district])){
                        const givenRole = myGuild.roles.cache.get(leaderRoles[district]);
                        myMember.roles.add(givenRole).catch(console.error);
                    }
                }
            }
        }
        
    }else{
        console.log(myGuild.members.cache)
    }

}

module.exports.updateAuth = async(client,teamData,district,modifier) =>{
    if (!district){
        return;
    }
    // change teamdata modifier (adding the data if needed) then comparing it to the leaderboard
    await update(client)

    function checkData(pair) {
        if (pair[0] == teamData.userid){
            return true;
        }
    }

    var myAuthority = 0;
    var myPair = mapAuthorityBoard[district].find(checkData);
    if (myPair){
        myAuthority = myPair[1]
    }
    myAuthority += modifier;
    if (myAuthority < 0){
        myAuthority = 0;
    }
    if (!myPair){
        myPair = [teamData.userid,myAuthority]
        mapAuthorityBoard[district].push(myPair)
    }else{
        for (let pair of mapAuthorityBoard[district]){
            if (pair == myPair){
                pair[1] = myAuthority;
            }
        }
    }
    //console.log("Current Data:")
    //console.log(myPair)
    
    // check if higher than current leader, or, if current leader and modifier is negative, recalculate the leader
    if (teamData.userid == mapData[district].holderid){
        // refresh leader
        // update main map data, auth and color, teamname, etc
        mapData[district].authority = myAuthority;
        mapData[district].color = teamData.preferences.color;
        mapData[district].holder = teamData.name;
        // recalc who the leader is
        var highestIndex = 0;
        var highestAuthority = 0;
        var highestUserId = 0;
        for (var i = 0; i < mapAuthorityBoard[district].length; i++){
            if (mapAuthorityBoard[district][i][1] > highestAuthority){
                highestAuthority = mapAuthorityBoard[district][i][1];
                highestIndex = i;
                highestUserId = mapAuthorityBoard[district][i][0];
            }
        }
        if (highestAuthority > 0){
            if (highestUserId == teamData.userid){
                //retains ownership, updating styles
                mapData[district].authority = myAuthority;
                mapData[district].color = teamData.preferences.color;
                mapData[district].holder = teamData.name;
            }else{
                console.log(` - New Owner over Takes ${district} - `);
                console.log(`Previous ownerid: ${teamData.userid} (${myAuthority})// New Userid: ${highestUserId} (${highestAuthority})`);
                // new owner
                const newOwnerData = await client.teamsDB.get(`${mapAuthorityBoard[district][highestIndex][0]}`, 0);
                //mapData[district]["decree"]= "";
                mapData[district].authority = mapAuthorityBoard[district][highestIndex][1];
                mapData[district].color = newOwnerData.preferences.color;
                mapData[district].holder = newOwnerData.name;
                mapData[district].holderid = newOwnerData.userid
            }
        }else{

        //console.log('no highest')
        }
        
        await client.questsDB.set("MapData", mapData);
    }else{
        // check if greater than current leader
        if (myAuthority > mapData[district].authority){
            //kicking out old leader
            var oldId = mapData[district].holderid


            // claiming ownership for self
            mapData[district].authority = myAuthority;
            mapData[district].color = teamData.preferences.color;
            mapData[district].holder = teamData.name;
            mapData[district].holderid = teamData.userid;
            await client.questsDB.set("MapData", mapData);
            await checkLeaderRoles(client,await client.teamsDB.get(`${oldId}`,null))

        }
    }

    //save both map data and authority
    await client.questsDB.set("MapAuthority", mapAuthorityBoard);
    await client.questsDB.set("MapData", mapData);

    await checkLeaderRoles(client,teamData)
}

module.exports.updateFlavor = async(client,teamData)=>{
    await update(client)

    for (let district of maps[0].districts)
    {    
        if (mapData[district].holderid == teamData.userid){
            mapData[district].color = teamData.preferences.color;
            mapData[district].holder = teamData.name;
        } 
    }
}


module.exports.getRandomDistrict = async()=>{
    
    const myMap = maps[Math.floor(Math.random()*maps.length)];
    const myTerritory = myMap.districts[Math.floor(Math.random()*myMap.districts.length)];
    return(myTerritory);
}


module.exports.returnMaps = ()=>{
    return(
        maps
    )
}

module.exports.returnDistrictBoard = async(client,district)=>{
    await update(client)

    return (mapAuthorityBoard[district])
}

module.exports.returnMapData = async(client)=>{
    await update(client);

    return mapData;
}

module.exports.removeAllAuth = (userid)=>{ // in case they reset their data
    function removeAuth(pair) {
        return (pair[0] != userid);
    }
    for (let district of maps[0].districts){

        mapAuthorityBoard[district] = mapAuthorityBoard[district].filter(removeAuth)
    }
}

module.exports.addToTribute = (number)=>{
    tributeBank+=number;
}
module.exports.resetAndReturnTribute = ()=>{
const result = tributeBank;
tributeBank = 0;
return result;
}

module.exports.returnDecree = async(client,myDistrict)=>{
    await update(client);
    for (let district of maps[0].districts){
        if (myDistrict == district){
            return(mapData[district]["decree"]);
        }
    }
}

module.exports.setDecree = async (client, teamData,myDistrict,decree)=>{
    await update(client);
    var result = false;

    // pull the district out instead of looping u dummy
    var districtTile = mapData[myDistrict];

    if (districtTile.holderid == teamData.userid && (!districtTile['decree'] || districtTile['decree'] != decree)){
        mapData[myDistrict]["decree"] = decree;
        result = true;
    }

    if (result){
        await client.questsDB.set("MapData", mapData);
    }
    return result;
}


module.exports.help = {
    name: "map",
    description: "Displays the territory map."
}

module.exports.requirements = {
    userPerms: ["EMBED_LINKS"],
    clientPerms: [],
    ownerOnly: false,
}
module.exports.limits = {
    ratelimit: 3,
    cooldown: 1000
}
module.exports.setup = async (client)=>{
    update(client);
}
