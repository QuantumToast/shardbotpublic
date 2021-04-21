const {readdirSync, realpath} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const capeModule = require(`${filePath}/cape.js`)
const searchModule = require('../structures/search');
const armoryModule = require('../structures/armory')
const HQModule = require(`./headquarters`);
const { strict } = require('assert');
const denyImage = "https://upload.wikimedia.org/wikipedia/commons/b/bc/Not_allowed.svg"

// cost of keep a cape in reserve per level per day
const pricingPerDay = [0,50,100,200,300,400,500,600,700,800,900,1000]

// also use their recovery time?? that miiight clash with others


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


const activities = {
    ['general']:[
        'has taken up knitting as a hobby.'
        ,'has recently suffered a drug addiction.'
        ,'recently have gone to jail.'
        ,"is doing physical therapy to recover from recent wounds."
        
        ,"has lost a loved one."
        
        ,'is doing a PR tour.'
        ,'is promoting their latest book.'
        
        ,'is getting a new costume fitted.'
        ,'is currently for hire as a party clown.'
        ,'is taking care of a sibling.'
        ,'is currently involved in a court case.'
        ,'is learning a new skill.'
        ,'is spending some time with their partner.'
        ,'is tracking someone they want to take down.'
        ,'is on an alcohol binge.'
        ,'is in therapy.'
        ,'is visiting a movie studio.'
        ,'is visiting another country.'
        ,'is taking a cooking class. Yum!'
        ,'is trying to start a political career.'
        ,'has taken a leave of absence.'
        ,'is gone and refuses to say why.'
        ,'is seeking treatment for a master parasite.'
        ,"has vanished without a trace. They'll be back. Probably."
        ,'is buying a new pet.'
        ,'is getting married.'
        ,'is going through a tough breakup.'
        ,'has been in a minor accident.'
        ,'is having trouble with their allergies acting up.'
        ,'has failed security checks.'
        ,'is stuck in a remote location.'
        ,'is trying to find the lost city of Atlantis.'
        ,'is trying their best to lose some weight and get into shape.'
        ,'has just taken a vacation to meet their pen pal.'
        ,'is living on their couch for too long.'
        ,'is moving to a new neighborhood.'
        ,'has sent their costume for dry-cleaning.'
        ,'is taking a day off.'
        ,'Had a relative trigger, and is helping them adjust.'
        ,' overslept.'
        ,'is on an undercover mission.'
        ,'Is on a mission under their covers.'
        ,'Is under a cover on their missions.'
        ,'is sitting down and thinking about what they did.'
        ,'is justifying their actions to themselves.'
        ,'took up an intern.'
        ,'Is visiting the church of Staten Island.'
        ,'is relaxing in the shade.'
        ,'is sunbathing.'
        ,"is on a corporate-sponsored retreat about why eating someone's car while they watch is not okay."
        ,'needs remedial physics classes.'
        ,'is with the PRT.'
        ,'is in jail.'
        ,'is being recruited by the PRT. Maybe. If they can sit still for longer than 5 seconds. Probably back tomorrow, honestly.'
        ,'is taking time off to find themselves.'
        ,'is stuck down a well.'
        ,'has inherited a house on a hill, and all the associated problems.'
        ,'has decided to take some time off to study.'
        ,'has been chucked into Master/Stranger confinement.'
        ,'is busy on a stakeout.'
        ,'has been told to sit on the naughty step.'
        ,'claims to be on a secret mission.'
        ,'is on mandatory timeout following the noodle incident.'
        ,'is really into a new book.'
        ,'is waiting for Cyberpunk 2077 to come out.'
        ,'fighting off a sleep-class threat.'
        ,'is trying to plug in a usb drive correctly.'
        ,'is playing this new idle game about managing a team of capes.'
        ,"should be doing work. Isn't that right, [capename]?"
        ,'has a report due.'
        ,'muttered something about australia as they were leaving.'
        ,'is moonlighting as a superhero.'
        ,'ran into an old friend.'
        ,'ran into an old enemy.'
        ,'ran into a spiteful ex-lover.'
        ,'stayed up all night on PHO.'
        ,'called in sick.'

    ],
    ['tinker']: [
        'is tinkering (obviously).'

    ],
    ['stranger']: [
        'Who?'
    ],
    ['minor']: [
        'is doing homework' 
        ,'had a dog eat their homework.' 

    ],
    ['adult']: [
        'is stuck at the DMV.'  // older capes only
       ,'is working at their day job.'
        ,'got lost on their way to work.'

    ],
}







module.exports.returnReserveFlavor= (cape)=>{
    var list = [...activities.general]

    if (cape.age <= 18){
        for (let quip of activities.minor){
            list.push(quip);
        }
    }
    if (cape.age <= 18){
        for (let quip of activities.adult){
            list.push(quip);
        }
    }
    if (cape.class == 'Tinker'){
        for (let quip of activities.tinker){
            list.push(quip);
        }
    }
    if (cape.class == 'Stranger'){
        for (let quip of activities.stranger){
            list.push(quip);
        }
    }
    var activity = list[Math.floor(Math.random()*list.length)];
    return (activity)

}


function days_between(date1, date2) {

    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date1 - date2);

    // Convert back to days and return

    

    return Math.ceil(differenceMs / ONE_DAY);
}


module.exports.reserveData = function (team){

    const currentTime = new Date().getTime()

    var result = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(team.name)

    var statInfo = `💰 $${team.funds} `

    if (team['preferences'] && team['preferences']['color']){
        result.setColor(team.preferences.color)
    }
    if (team["image"] && team["image"]["approved"]){
        result.setThumbnail(team["image"]['url']);
    }
    if (team["image"] && team["image"]["denied"]){
        result.setThumbnail(denyImage);
    }

    statInfo += `🦸 ${team.capes.length}/${HQModule.getMaxCapes(team)}  💤 ${team.reservedcapes.length}/${HQModule.getMaxReserve(team)}`

    result.addField(`Stats`,statInfo)

    // adding capes
    var count = team.capes.length;
    const spaceChar = `\xa0`;

    var longestCharName = 0;
    for (let cape of team.reservedcapes){
        if (cape.name.length > longestCharName){
            longestCharName = cape.name.length+1
        }
    }
    var infoBar = [];
    var info = "";

    for (let cape of team.reservedcapes){
    
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

        var days = days_between(currentTime, cape.recoverytime)
        
        var returnPrice = pricingPerDay[(cape.level || 1)]*days
        if (days > 14){
            returnPrice = pricingPerDay[(cape.level || 1)]*14
        }
        info += "`"+` 🤝 $${returnPrice} ⛱️ ${days}d\n`
        
        info += `*${cape.activity.replace(`[capename]`,cape.name).replace(`[capename]`,cape.name)}*\n`

    }
    if (info == ""){
        info = "No reserved capes."
    }
    result.addField(`**Reserved Capes ${team.reservedcapes.length}/${HQModule.getMaxReserve(team)}**`, info, false);

    result.setFooter("Move to roster: ,recall [cape id] [optional replacement id]\n"+
    "Move to reserve: ,reserve [cape id] [optional replacement id]");

    return result;
}


// reserve: reserves a cape from Roster
// Recall: pay to take a cape back from Roster.

module.exports.run = async (client, message, args) =>{
    const teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    const currentTime = new Date().getTime()

    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }
    if (!teamData.reservedcapes){
        teamData['reservedcapes']=[];
    }

    if (args[0]){

        if (message.content.substring(1,7)=='recall'){

            var replaceCape = null
            
            if (args[1]){
                replaceCape=teamData.capes[args[1]-1] || null;
            }

            var targetCape = teamData.reservedcapes[args[0]-1-(teamData.capes.length)] || null

            // if they typed the name of the cape
            if (!targetCape) {
                var results = searchModule.fillCapes(args.join(' '), teamData.reservedcapes, 1);
                var collection = results[0];
                if (collection[0]){
                    targetCape = collection[0];
                }
            }
            if (!replaceCape && args[1]) {
                var results = searchModule.fillCapes(args[1], teamData.capes, 1);
                var collection = results[0];
                if (collection[0]){
                    replaceCape = collection[0];
                }
            }

            if (!targetCape){
                message.reply("Could not identity cape."); 
                return;
            }
            if (teamData.capes.length >= HQModule.getMaxCapes(teamData) && !replaceCape){
                message.reply("Your roster is full, you need to also select an active cape to swap out.")
                return;
            }
            const days = days_between(currentTime, targetCape.recoverytime)
            var returnPrice = pricingPerDay[(targetCape.level || 1)]*days
            if (days > 14){
                returnPrice = pricingPerDay[(targetCape.level || 1)]*14
            }
            function targetCapeFilter(potentialCape){
                if (potentialCape.id != targetCape.id){
                    return true;
                }
                return false;
            }
            function replaceCapeFilter(potentialCape){
                if (potentialCape.id != replaceCape.id){
                    return true;
                }
                return false;
            }
            if (teamData.funds < returnPrice){
                message.reply("You do not have enough funds to recall "+targetCape.name+" ($"+returnPrice+").");
                return;
            }

            if (replaceCape){
                if (replaceCape['activity'] && replaceCape['activity'] != 'none'){
                    message.reply(`${replaceCape.name} can not be recalled while on an operation.`);
                    return;
                }
                if (replaceCape['recoverytime'] && replaceCape['recoverytime'] > currentTime){
                    message.reply(`${replaceCape.name} can not be recalled while recovering.`);
                    return;
                }
            }

            targetCape.activity = 'none'
            teamData.funds = teamData.funds - returnPrice;
            //console.log(returnPrice)
            teamData.reservedcapes = teamData.reservedcapes.filter(targetCapeFilter);

            if (replaceCape){
                teamData.capes = teamData.capes.filter(replaceCapeFilter);
            }

            teamData.capes.push(targetCape);
            
            var replaceFlavor = "";
            if (replaceCape){
                replaceFlavor = ` and put ${replaceCape.name} on reserve`
                teamData.reservedcapes.push(replaceCape);
                replaceCape['activity'] = `[capename] ${this.returnReserveFlavor(replaceCape)}`;
                replaceCape['recoverytime'] = currentTime;
                
                replaceCape['items'] = [];
                if(replaceCape.weapon){
                    replaceCape.weapon = null;
                }
            }

            
            await client.teamsDB.set(`${message.author.id}`, teamData);
            message.reply(`Recalled ${targetCape.name}${replaceFlavor} for $${returnPrice}.`);
        }
        else{

            var replaceCape = null
            
            if (args[1]){
                replaceCape=teamData.reservedcapes[args[1]-1-(teamData.capes.length)] || null;
            }

            var targetCape = teamData.capes[args[0]-1] || null

            // if they typed the name of the cape
            if (!targetCape) {
                var results = searchModule.fillCapes(args.join(' '), teamData.capes, 1);
                var collection = results[0];
                if (collection[0]){
                    targetCape = collection[0];
                }
            }
            if (!replaceCape && args[1]) {
                var results = searchModule.fillCapes(args[1], teamData.reservedcapes, 1);
                var collection = results[0];
                if (collection[0]){
                    replaceCape = collection[0];
                }
            }

            if (!targetCape){
                message.reply("Could not identity cape."); 
                return;
            }
            if (teamData.reservedcapes.length >= HQModule.getMaxReserve(teamData) && !replaceCape){
                message.reply("Your reserve is full, you need to also select a reserved cape to swap out.")
                return;
            }
            if (targetCape['activity'] && targetCape['activity'] != 'none'){
                message.reply(`${targetCape.name} can not be reserved while on an operation.`);
                return;
            }
            if (targetCape['recoverytime'] && targetCape['recoverytime'] > currentTime){
                message.reply(`${targetCape.name} can not be reserved while recovering.`);
                return;
            }
    
            function targetCapeFilter(potentialCape){
                if (potentialCape.id != targetCape.id){
                    return true;
                }
                return false;
            }
            function replaceCapeFilter(potentialCape){
                if (potentialCape.id != replaceCape.id){
                    return true;
                }
                return false;
            }

            var returnPrice = 0;
            if (replaceCape){
                const days = days_between(currentTime, replaceCape.recoverytime)
                returnPrice = pricingPerDay[(replaceCape.level || 1)]*days
                if (days > 14){
                    returnPrice = pricingPerDay[(replaceCape.level || 1)]*14
                }
                if (teamData.funds < returnPrice){
                    message.reply("You do not have enough funds to recall "+replaceCape.name+" ($"+returnPrice+").");
                    return;
                }
                targetCape.activity = 'none'
                //console.log(returnPrice)
                teamData.funds = teamData.funds - returnPrice;
            }

            if (replaceCape){
                teamData.reservedcapes = teamData.reservedcapes.filter(replaceCapeFilter);
            }
            teamData.capes = teamData.capes.filter(targetCapeFilter);

            teamData.reservedcapes.push(targetCape);
            
            var replaceFlavor = "";
            if (replaceCape){
                replaceFlavor = ` and recalled ${replaceCape.name} for $${returnPrice}`
                teamData.capes.push(replaceCape);
                replaceCape['activity'] = `none`;
               
            }

            for (let oldItem of teamData.armory){
                if (oldItem.holderid==targetCape.id){
                    oldItem.holderid = -1;
                }
            }
            targetCape['items'] = [];
            if(targetCape.weapon){
                targetCape.weapon = null;
            }
            targetCape['activity'] = `[capename] ${this.returnReserveFlavor(targetCape)}`;
            targetCape['recoverytime'] = currentTime;

            
            await client.teamsDB.set(`${message.author.id}`, teamData);
            message.reply(`Reserved ${targetCape.name}${replaceFlavor}.`);
            
        }
        return;
    }
    

    //team info
    message.reply(this.reserveData(teamData));
}

module.exports.help = {
    name: "reserve",
    description: "Manage team's reserved capes. Reserved capes rack up a recall cash requirement the more they are in reserve.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}
module.exports.limits = {
    ratelimit: 1,
    cooldown: 1000*5
}
