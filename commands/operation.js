const {readdirSync} = require('fs');
const { join } = require("path");
const {postchannel,publicguilds} = require("../config.js");

const filePath = join(__dirname,"..","commands");

const { MessageCollector, MessageEmbed, DataResolver} = require("discord.js");

//advanced missions
const heistModule = require("../operation_plans/heist")
const patrolModule = require("../operation_plans/patrol")
const protectionModule = require("../operation_plans/protection")

//modules
const capeModule = require(`${filePath}/cape.js`);
const fightModule = require("../structures/fight.js");
const armoryModule = require('../structures/armory')
const levelModule = require('../structures/level')
const searchModule = require('../structures/search');
const mapModule = require(`${filePath}/maps.js`);

const leaderboardModule = require('./leaderboard.js')

const { table } = require('console');
const denyImage = "https://upload.wikimedia.org/wikipedia/commons/b/bc/Not_allowed.svg"

var activeUsers = []// keeps a list of all of the userids that they are currently processing so people can't override


var nextOpId = 0;

const maps = mapModule.returnMaps();

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

const alignmentShortcuts = {
    ["h"]: "hero",
    ["heroic"]: "hero",
    ["good"]: "hero",
    ["hero"]: "hero",

    ["v"]: "villain",
    ['villain']:'villain',
    ['villainous']:'villain',
    ['evil']: 'villain',
    ['bad']: 'villain',

    ['r']: "rogue",
    ['n']: 'rogue',
    ['rogue']: 'rogue',
    ['neutral']: 'rogue'
}

function returnReadableTime(miliseconds){
    var minutes = Math.floor(miliseconds/1000/60);
    var hours = Math.floor(minutes/60);
    minutes = minutes%60;
    var text = ``;
    if (minutes>0){
        text+=`${minutes}m`
    }
    if (hours > 0){
        text = `${hours}h`+text;
    }
    if (minutes+hours == 0){
        var seconds = Math.floor(miliseconds/1000)
        text=`${seconds}s`
    }
    return text;
}

function statCheck(cape, dc, stat){
    const statTotal = cape[stat]+Math.floor(cape.utility/2)
    var measure = statTotal+dc;
    if (Math.floor(Math.random()*measure+1) <= statTotal){
        return true;
    }
    return false;
}

const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]
function getBattleStats(cape){
    let battlestats = {
        ["strength"]: cape.strength,
        ["vitality"]: cape.vitality,
        ["utility"]: cape.utility,
        ["control"]: cape.control,
        ["technique"]: cape.technique,
    }
    armoryModule.calculateStats(battlestats,cape.items)
    return battlestats;
}

/* Ops
    name
    capereq -   how many capes are needed to patrol
    repreq -    how much reputation they need before they can complete, negative reps measure by less than
    pvp -       if action is respondable
    time -      how long it takes, results displayed at end. Measured in SECONDS
    prize -     what user gets if mission succeeds
    penalty -   % of rewards docked from loser
    timeout -   how many hours failed capes need to recover for
    authority - [Success/Failure/Interupted]

*/

const training = {
    name: "Training",
    info: "Hit the gym, shooting range, or even spar for uninterrupted XP.",

    capereq: 1,
    flexiblemax: true,

    repreq: 0,
    pvp: false,
    time: 60,
    difficulty: 1,

    prize: {
        funds: 0,
        reputation: 0,
        xp: 2,
    },
    penalty: .33,

    ["run"]: (teamData, capes, display) =>{
        
        let classActivities= {
            ['Brute']: [
                "Cape played the Knife Game."
            ],
            ['Breaker']: [
                "Cape played with fire."
            ],
            ['Blaster']: [
                "Cape spent the day at the shooting range."
            ],
            ['Changer']: [
                "Cape stared into a mirror."
            ],
            ['Master']: [
                "Cape practiced by themselves."
            ],
            ['Shaker']: [
                "Cape did some landscaping."
            ],
            ['Stranger']: [
                "Cape spooked your staff."
            ],
            ['Striker']: [
                "Cape gave high fives."
            ],
            ['Thinker']: [
                "Cape visited a library."
            ],
            ['Tinker']: [
                "Cape locked themselves in their lab."
            ],
            ['Trump']: [
                "Cape made friends with their teammates."
            ],
            ['Mover']: [
                "Cape shredded their sneakers."
            ]
        }
        let generalActivities = [
            "Cape sparred with a partner.",
            "Cape lifted weights.",
            "Cape ran a 5k."
        ]


        display.addField("Trainees", concatNamesIntoList(capes));
        var info = "";
        for (let cape of capes){
            //console.log(cape.class)
            var list = [...generalActivities,...(classActivities[cape.class])];
            info+= `${list[Math.floor(Math.random()*list.length)]}\n`.replace(`Cape`,cape.name);
        }

        display.addField("Practice", info);

        return true;

    },
    
    ["authority"]: [0,0,0],
}

const protectionjob = {
    name: "Protection Detail",
    info: "Mercenary work to protect a target. PvE",

    capereq: 5,

    repreq: 0, 
    pvp: false,
    time: 8*60, //should be 8 hours
    difficulty: 1,

    prize: {
        funds: 1500,
        reputation: 0,
        xp: 1,
    },
    penalty: .8,

    ["run"]: (teamData, capes, display) =>{
        var data = protectionModule.run(teamData,capes)
        return (data);
    },
    
    ["authority"]: [0,0,0],
}


const arena = {
    name: "Arena",
    info: "Send your capes to fight without consequence, but also without prizes.",

    capereq: 1,
    repreq: 0,
    pvp: true,
    time: 60,
    difficulty: 0,
    prize: {
        funds: 0,
        reputation: 0,
    },
    penalty: 0,
    ["run"]: (teamData, capes, display) =>{
        var cape = capes[0];

        display.addField("Fighter", cape.name);

        display.addField("Results", "No one responded to your fight request.");
        return (false);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display) => {
        const data = fightModule.startFight(teamCapes,enemyCapes);
        return (data);
    },
}
const patrol = {
    name: "Patrol",
    info: "Walk the streets and look for danger.",

    capereq: 1,
    repreq: 0,
    pvp: true,
    time: 60,

    difficulty: 1,

    
    prize: {
        funds: 50,
        reputation: 10,
    },
    penalty: .3,
    timeout: .5,

    ["run"]: (teamData, capes, display) =>{
        var data = patrolModule.run(teamData,capes[0])
        return (data);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display,decree) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];
        if (decree == "Curfew"){
            decree = "CurfewA"
        }

        const data = fightModule.startFight(teamCapes,enemyCapes,{['decree']: decree});
        const userWin = data[0];
        var fightInfo = `${enemyCape.name} attacked ${cape.name} while they were patroling!`
        
        if (userWin){
            fightInfo += "\n"+cape.name+" fended off the assault.";
        }
        else{
            fightInfo += "\n"+enemyCape.name+"'s attack cut the patrol short.";
        }
        //display.addField("**"+cape.name+"**"+" vs "+"**"+enemyCape.name+"**",fightInfo);
        display.addField("Encounter", fightInfo)

        return (data);
    },

    ["authority"]: [1,-1,0],
}

const minor_crime_spree = {
    name: "Minor Crime Spree",
    info: "Harass locals  for quick cash.",
    capereq: 1,
    repreq: 0,
    pvp: true,
    time: 60,
    difficulty: 2,

    prize: {
        funds: 75,
        reputation: -10,
    },
    penalty: .5,
    timeout: .5,

    ["run"]: (teamData, capes, display) =>{
       // console.log('running for '+teamData.name)
        var cape = capes[0];
        const shops = [
            "the Chicken Soup Burgers fastfood restaurant",
            "a tech shop",
            "an E-Mart",
            "a pharmacy",
            "a car rental",
            "a mall",
            "a fancy restaurant",
        ];
        var encounters = [
            {
                reaction: "a couple of cops were in the area",
                stat: "strength",
                success: cape.name+" was able to overpower the cops and escape with the cash.",
                failure: "Unable to confront the police, "+cape.name+" had to flee.",
            },
            {
                reaction: "any money was difficult to obtain",
                stat: "technique",
                success: cape.name+" was able to break the security and escape with the cash.",
                failure: cape.name+" stalled for too long and was ultimatly unable to produce any valuables.",
            },
        ]

        display.addField("Operator", cape.name);
        //console.log(cape.name);
        const enc = encounters[Math.floor(Math.random()*encounters.length)];
        const shop = shops[Math.floor(Math.random()*shops.length)]
        var info = `${teamData.name} robbed ${shop} but ${enc.reaction}\n`;
        var bStats = getBattleStats(cape)

        const winCon = statCheck(bStats,minor_crime_spree.difficulty,enc.stat);
        if (winCon){
            info += enc.success;
        }
        else{
            info += enc.failure;
        }

        display.addField("Encounter", info);
        return (winCon);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display,decree) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];
        const shops = [
            "the Chicken Soup Burgers fastfood restaurant",
            "a tech shop",
            "an E-Mart",
            "a pharmacy",
            "a car rental",
            "a mall",
            "a fancy restaurant",
        ];
        const shop = shops[Math.floor(Math.random()*shops.length)]
        if (decree == "Curfew"){
            decree = "CurfewB"
        }
        

        const data = fightModule.startFight(teamCapes,enemyCapes,{['decree']: decree});
        const userWin = data[0];
        var fightInfo = `${cape.name} was raiding ${shop} but ${enemyCape.name} came to the rescue!`
        if (userWin){
            fightInfo += "\n"+cape.name+" made off with stolen goods.";
        }
        else{
            fightInfo += "\n"+enemyCape.name+" stopped the would-be villain.";
        }
        display.addField("Encounter", 
            fightInfo
        )
        return (data);
    },
    ["authority"]: [1,-1,0],

}
const robbery = {
    name: "Robbery",
    info: "Rob a wealthy business.",
    capereq: 2,
    repreq: -70,
    pvp: true,
    time: 180,
    difficulty: 3,

    prize: {
        funds: 450,
        reputation: -80,
        xp: 4,
    },
    penalty: .6,

    ["run"]: (teamData, capes, display) =>{
        var cape = capes[0];
        const shops = [
            "a bank",
            "a jewelry store",
            "an art gallery"
        ]
        var encounters = [
            {
                reaction: "the police showed up!",
                stat: "strength",
                success: teamData.name+" were able to fight them off.",
                failure: "The police forced  "+teamData.name+" to flee.",
            },
            {
                reaction: "the hostages  fought back!",
                stat: "technique",
                success: teamData.name+" quickly restrained the hostages  before making off with cash.",
                failure: "Unwilling to kill, "+teamData.name+" was forced to go elsewhere.",
            },
            {
                reaction: "they triggered the silent alarm!",
                stat: "control",
                success: teamData.name+" were able to grab the cash and run before security showed up.",
                failure: teamData.name+" could not get to the money in time."
            },

        ]

        display.addField("Operators", capes[0].name + " & "+capes[1].name);

        const enc = encounters[Math.floor(Math.random()*encounters.length)];
        const shop = shops[Math.floor(Math.random()*shops.length)]
        var info = `${teamData.name} robbed ${shop} but ${enc.reaction}\n`;
        var bStats = getBattleStats(capes[Math.ceil(Math.random(capes.length))])

        const winCon = statCheck(bStats,robbery.difficulty,enc.stat);
        if (winCon){
            info += enc.success;
        }
        else{
            info += enc.failure;
        }

        display.addField("Encounter", info);
        return (winCon);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display,decree) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];
        const shops = [
            "a bank",
            "a jewelry store",
            "an art gallery"
        ]
        const shop = shops[Math.floor(Math.random()*shops.length)]
        
        if (decree == "Curfew"){
            decree = "CurfewB"
        }

        const data = fightModule.startFight(teamCapes,enemyCapes,{['decree']: decree});
        const userWin = data[0];



        var fightInfo = `${teamData.name} robbed ${shop} but ${enemyTeamData.name} came to the rescue!`;
        if (userWin){
            fightInfo += "\n"+teamData.name+" made off with stolen cash.";
        }
        else{
            fightInfo += "\n"+enemyTeamData.name+" prevented the robbery.";
        }
        display.addField("**"+cape.name+" and "+teamCapes[1].name + " vs " + enemyCape.name + " and "+enemyCapes[1].name+"**", 
        fightInfo
        );

        return (data);
    },
    ["authority"]: [2,-2,+2],

}

const pr_event = {
    name: "PR Event",
    info: "Perform for the public to gain trust.",

    capereq: 1,
    repreq: 50,
    pvp: true,
    time: 120,
    difficulty: 2,

    prize: {
        funds: 135,
        reputation: 40,
        xp: 4,
    },
    penalty: .33,

    ["run"]: (teamData, capes, display) =>{
        var cape = capes[0];
        //console.log("Performing Cape: "+cape.name);
        const encounters = [
            {
                prompt: `${cape.name} hosted an autograph signing.`,
                stat: 'control',
                success: `Resulting in a large participant turnout.`,
                failure: `But not that many people showed up.`,
            },
            {
                prompt: `${cape.name} showed off their power with some public stunts!`,
                stat: 'technique',
                success: `Their performance awed the crowd.`,
                failure: `But their stunts did not go over well with the audience.`,
            },
            {
                prompt: `${cape.name} did a school presentation.`,
                stat: 'vitality',
                success: `Their event inspired many young minds.`,
                failure: `But the kids were too exhausting to properly deal with.`,
            },
            {
                prompt: `${cape.name} gave a community speech.`,
                stat: 'utility',
                success: `Impressing many people and gathering a large crowd.`,
                failure: `But they did not seem that knowledgeable on the subject.`,
            },
        ]

        var successes = 0;

        display.addField("Operator", cape.name);
        var bStats = getBattleStats(cape)
        var enc = encounters[Math.floor(Math.random()*encounters.length)];
        var info = enc.prompt;
        if (statCheck(bStats,pr_event.difficulty,enc.stat)){
            successes++;
            info+="\n"+enc.success;
        }
        else{
            info+="\n"+enc.failure;
        }
        display.addField("Encounter", info);

        if (successes > 0){
            return true;
        }else{
            return false;
        }

    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display,decree) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];

        const encounters = [
            {
                prompt: `hosting an autograph signing.`,
                success: `The fight resulted in ${cape.name} garnering even more attention.`,
                failure: `${enemyCape.name}'s disruption caused the event to close early.`,
            },
            {
                prompt: `doing a public stunt.`,

                success: `The battle only ADDED to the audience appeal.`,
                failure: `The display ended in disaster.`,
            },
            {
                prompt: `giving a school presentation.`,
                success: `But they were successfully fought off and arrested.`,
                failure: `${cape.name} received criticism for endangering young lives.`,
            },
            {
                prompt: `giving a community speech.`,
                success: `Impressing many people and gathering a large crowd.`,
                failure: `But they did not seem that knowledgeable on the subject.`,
            },
        ]
        if (decree == "Curfew"){
            decree = "CurfewA"
        }

        var enc = encounters[Math.floor(Math.random()*encounters.length)];
        const data = fightModule.startFight(teamCapes,enemyCapes,{['decree']: decree});
        const userWin = data[0];
        var fightInfo = `${enemyCape.name} attacked ${cape.name} while they were ${enc.prompt}!`;

        if (userWin){
            fightInfo += "\n"+enc.success;
        }
        else{
            fightInfo += "\n"+enc.failure;
        }
        display.addField("**"+cape.name+"**"+" vs "+"**"+enemyCape.name+"**",fightInfo);
        return (data);
    },
    ["authority"]: [1,-1,0],

}

const drugbust = {
    name: "Drug Raid",
    info: "Bust a local drug den",
    capereq: 2,
    repreq: 300,
    pvp: true,
    time: 240,
    difficulty: 3,
    prize: {
        funds: 600,
        reputation: 70,
        xp: 5,
    },
    penalty: .5,

    ["run"]: (teamData, capes, display) =>{
        var encounters = [
            {
                reaction: "But the area was under heavy guard.",
                stat: "strength",
                success: teamData.name+" were able to defeat the goons.",
                failure: teamData.name+" had to flee for their lives.",
            },
            {
                reaction: "They found incriminating financial records.",
                stat: "technique",
                success: teamData.name+" were able to quickly record and escape with the documents.",
                failure: "But when they did not have enough time to obtain the evidence before reinforcements arrived.",
            },
            {
                reaction: "They triggered a silent alarm!",
                stat: "control",
                success: teamData.name+" were able to grab the cash and run before more goons showed up.",
                failure: teamData.name+" could not get to the money in time."
            },
        ]

        display.addField("Operators", capes[0].name + " & "+capes[1].name);

        const enc = encounters[Math.floor(Math.random()*encounters.length)];
        var info = `${teamData.name} busted into a drug den. ${enc.reaction}\n`;
        var bStats = getBattleStats(capes[Math.ceil(Math.random(capes.length))])

        const winCon = statCheck(bStats,drugbust.difficulty,enc.stat);
        if (winCon){
            info += enc.success;
        }
        else{
            info += enc.failure;
        }

        display.addField("Encounter", info);
        return (winCon);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display,decree) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];

        if (decree == "Curfew"){
            decree = "CurfewA"
        }

        const data = fightModule.startFight(teamCapes,enemyCapes,{['decree']: decree});
        const userWin = data[0];
        var fightInfo = `${teamData.name} raided a drug den under ${enemyTeamData.name}'s control.`;
        if (userWin){
            fightInfo += "\n"+teamData.name+" chased"+enemyTeamData.name+" off and ruined their drug operations.";
        }
        else{
            fightInfo += "\n"+enemyTeamData.name+" protected their den, further securing their status.";
        }
        display.addField("**"+cape.name+" and "+teamCapes[1].name + " vs " + enemyCape.name + " and "+enemyCapes[1].name+"**", 
            fightInfo
        );
        return (data);
    },

    ["authority"]: [2,-1,0],

}
const territory_takeover = {
    name: "Territory Takeover",
    info: "Establish ownership in a district.",
    capereq: 3,
    repreq: -500,
    pvp: true,
    time: 300,
    difficulty: 4,
    prize: {
        funds: 1400,
        reputation: -225,
        xp: 5,
    },
    penalty: .7,

    ["run"]: (teamData, capes, display) =>{
        var encounters = [
            {
                reaction: "targetting the criminal organizations in the area.",
                stat: "strength",
                success: teamData.name+" were able to sufficiently cow the local crime bosses into following them for now.",
                failure: teamData.name+" were succinctly chased out of the area, their strength lacking.",
            },
            {
                reaction: " but their key buildings of control were attacked by the locals.",
                stat: "vitality",
                success: teamData.name+"'s capes were able to withstand and scare off the assaulters, establishing their dominance over the district.",
                failure: teamData.name+"'s property fell to the combined efforts, their capes unable to assist in a meaningful way.",
            },
        ]

        display.addField("Operators", capes[0].name + " & "+capes[1].name);

        const enc = encounters[Math.floor(Math.random()*encounters.length)];
        var info = `${teamData.name} made a power play in a target district ${enc.reaction}\n`;
        var bStats = getBattleStats(capes[Math.ceil(Math.random(capes.length))])

        const winCon = statCheck(bStats,drugbust.difficulty,enc.stat);
        if (winCon){
            info += enc.success;
        }
        else{
            info += enc.failure;
        }

        display.addField("Encounter", info);
        return (winCon);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display,decree) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];

        if (decree == "Curfew"){
            decree = "CurfewB"
        }

        const data = fightModule.startFight(teamCapes,enemyCapes,{['decree']: decree});
        const userWin = data[0];
        var fightInfo = `${teamData.name} made a territory push in a district under ${enemyTeamData.name}'s watch.`;
        if (userWin){
            fightInfo += "\n"+teamData.name+" forced "+enemyTeamData.name+" to retreat, leaving the civilians under "+teamData.name+"'s control.";
        }
        else{
            fightInfo += "\n"+enemyTeamData.name+" chased "+teamData.name+" out of their land.";
        }
        
        display.addField("**"+cape.name+" / "+teamCapes[1].name +" / "+teamCapes[2].name+ " vs " + enemyCape.name + " / "+enemyCapes[1].name+" / "+enemyCapes[2].name+"**", 
            fightInfo
        );
        return (data);
    },

    ["authority"]: [3,-2,+3],

}
const heist = {
    name: "Heist",
    info: "**[Action Demo]** Rob a bank.",
    capereq: 4,
    repreq: -4000,
    pvp: true,
    time: 8*60,
    difficulty: 6,
    prize: {
        funds: 2000,
        reputation: -300,
        xp:7,
    },
    penalty: .7,

    ["run"]: (teamData, capes, display) =>{
        var data = heistModule.run(teamData,capes)
        return (data);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display,decree) => {
        var data = heistModule.run(teamData,teamCapes,enemyTeamData,enemyCapes,decree);
        // data[2] is "fought" if they fought enemies, sand "missed" if not
        // that way scripts without data[2] will not always give the enemyTeam no punishments
        return (data);
    },

    ["authority"]: [1,-1,+4],

}
const operations = [
    //heroic
    patrol,
    pr_event,
    drugbust,

    //villainous
    minor_crime_spree,
    robbery,
    territory_takeover,
    heist,

    //Rogue Operations,
    training,
    protectionjob


];

// Respondable Ops
/*
op name:
op id:
userid:
capeids:
time limit:
capereq:

enemyid:
enemycapeIds:
enemyteamname:

questMessage:

message should display a status: Open / Responded, finished ops get deleted from the post

*/


var respondableOps = [];
var recoveryTimers = []; //array of [userid,[capes],timenotifcation]


var cleanedUsers = {};//dictionary of users who have already had their players checked


async function returnResponseLists(client,teamData){ // date (day of month), other keys are userids they have responded to
    const myDate = new Date();
    var responseList = await client.questsDB.get(`${teamData.userid}-ResponseList`, 
        {
            ["date"]: myDate.getDate()
        }
    );

    if (responseList.date != myDate.getDate()){
        responseList = {
            ["date"]: myDate.getDate()
        }
    }
    return responseList;
}

function calculateMaxResponse(HQLevel){
    var result = HQLevel*4
    //return 1;
    if (!HQLevel){
        console.log("Can not find HQLevel")
    }
    return (result)
}


async function postMessage(channel,messages){
    // should recieve the [display, story] and the story
    var story = messages[1];
    var display = messages[0];
   // console.log(story);
    if (story){
        display.setFooter("Fight Log Below","https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2014%2F04%2F03%2F10%2F27%2Fswords-310518_960_720.png&f=1&nofb=1")
    }
    channel.send(display);
    
    if (story){
        var postCollection = []
        var currentPost = "";
        
        for (let round of story){
            for (let roundInfo of round){
                if (currentPost.length+roundInfo.length < 2000-3){
                    currentPost+=roundInfo;
                }
                else{
                    postCollection.push(currentPost);
                    currentPost =  roundInfo;
                }
            }
        }
        postCollection.push(currentPost);

        for (post of postCollection){
            await channel.send(post);
        }
        
    }else{
       // console.log("has no story :(")
    }
}
function concatNamesIntoList(targetList){
    var result = ""
    for (var i = 0; i < targetList.length;i++){
        if (i == targetList.length-1 && i != 0){
            result+= "and "
        }
        result+= targetList[i].name;
        if (i != targetList.length-1 && targetList.length > 2){
            result+= ","
        }
        if (i != targetList.length-1){
            result+= " "
        }
    }
    return result;
}
async function completeOperation(client,op,questObj,preRemoved){
    //console.log('start')
    if (questObj.aborted== true){
        //console.log(questObj.teamname)
        //console.log(questObj.questid)
        //console.log('this be aborted im ending')
        return;
    }
    questObj.aborted = true;
    //console.log('marked aborted')
    //console.log("Resolving "+op.name+".");
    var display = new MessageEmbed();
    
    //getting update Dataset
    var teamData = await client.teamsDB.get(`${questObj.userid}`,0);
    var userchannel = client.channels.cache.get(questObj.userchannel);
    //matching new array of capes to their id in case name changes or something
    var updatedCapes = [];

    var currentDecree = await mapModule.returnDecree(client,questObj.district);
    var myDecree = await mapModule.returnDecree(client,teamData.HQLocal[0])
    for (let id of questObj.capeids){
        var found = false;
        for (let c of teamData.capes){
            if (c.id == id){
                found = true;
                c['activity'] = "none";
                updatedCapes.push(c);

            }
        }
        if (!found){
            console.log("could not reset their id")
        }
    }

    var pingUser = "all";
    var pingEnemy = "all";

    if (teamData.preferences){// checking preferences
        if (teamData.preferences.ping == 'none' || teamData.preferences.ping == 'respond'){
            pingUser = "none";
        }
        if (teamData.preferences.ping == 'private'){
            pingUser = "private";
        }
        if (teamData.preferences.ping == 'done'){
            pingUser = "done"
            for (let cape of teamData.capes){
                if (cape.activity == questObj.name){
                    pingUser = "none"
                }
            }
        }
        
    }
    //setting enemy to private if they did not start from a public server
    if (!publicguilds.includes(userchannel.guild.id)){ // forcing the private option
        pingUser = "private";
    }
    var enemyChannel;

    var result;
    var story;

    if (questObj.enemyid == "null"){
        returnData = op.run(teamData, updatedCapes,display,currentDecree);
        if (returnData.length){
            result = returnData[0];
            story = returnData[1]
        }else{
            result = returnData
        }
        if (result){

            var touristFundBonus = 0;
            var touristRepBonus = 0;
            var touristTxt = ``
            if (currentDecree == "Tourist Destination" && !teamData.HQLocal.includes(questObj.district)){
                //bonus for being out of thes district (20% funds and rep)
                touristFundBonus = Math.ceil(op.prize.funds/5);
                touristRepBonus = Math.ceil(op.prize.reputation/5);
                touristTxt = ` (Tourism)`
            }else if (currentDecree == "Tourist Destination" && teamData.HQLocal.includes(questObj.district)){
                // penalty for being home district (lose 20% funds)
                touristFundBonus = -Math.ceil(op.prize.funds/5);
                touristTxt = ` (Tourism)`
            } 


            if (teamData["image"] && teamData["image"]["approved"]){
                display.setThumbnail(teamData["image"]["url"])
            }
            
            var tributePortion = 0;
            var mapData= await mapModule.returnMapData(client);
            if (currentDecree == "Tribute" && op.prize.reputation < 0){
                if (teamData.userid == mapData[questObj.district].holderid){
                    tributePortion = -1 *mapModule.resetAndReturnTribute();
                    display.addField(`Tribute`,`Collected $${-1*tributePortion} from your ongoing Tribute decree.`)
                } 
                else{
                    tributePortion = Math.ceil(op.prize.funds/20)
                
                    mapModule.addToTribute(tributePortion);
                    display.addField(`Tribute`,`5% of your prize goes to ${mapData[questObj.district].holder}.`)
                }  
            }
            
            display.setColor("GREEN");
            display.setAuthor("SUCCESS! | "+ op.name + " Completed");

            display.addField(`Reputation${touristTxt}`, teamData.reputation+" -> "+(teamData.reputation+op.prize.reputation+touristRepBonus));
            display.addField(`Funds${touristTxt}`, "$"+teamData.funds+" -> "+("$"+(teamData.funds+op.prize.funds-tributePortion+touristFundBonus)));

            teamData.reputation = teamData.reputation + op.prize.reputation+touristRepBonus;
            teamData.funds = teamData.funds + op.prize.funds-tributePortion+touristFundBonus;

            var postReport = "**Training**\n"
            for (cape of updatedCapes){
                var levelUp = levelModule.giveXP(cape,(op.prize.xp || 2));
                postReport += `${cape.name} gained ${op.prize.xp || 2} XP.\n`
                if (levelUp != false){
                    postReport+=levelUp+"\n"
                }
            }
            if (op.name.toLowerCase() != "arena"){
                await mapModule.updateAuth(client,teamData,questObj.district,op.authority[0]);
                postReport+=`:trophy: +${op.authority[0]} authority in ${questObj.district}.`;    
            }



            display.addField("Debrief",postReport);
            
        }else{
            display.setThumbnail(denyImage);
            var repPenalty = Math.floor(op.prize.reputation*op.penalty);

            var prCamp = ''
            if (currentDecree == "PR Campaign" && teamData.reputation > 0 && op.prize.reputation > 0){
                repPenalty = Math.ceil(repPenalty/2)
                prCamp = `(PR Campaign) `
            }else if (currentDecree == "PR Campaign" && teamData.reputation < 0 && op.prize.reputation < 0){
                repPenalty = repPenalty*2
                prCamp = `(PR Campaign) `
            }

            //var fundPenalty = Math.floor(op.prize.funds*op.penalty)
            if (teamData.reputation  >0 && teamData.reputation - repPenalty < 0){
                repPenalty = teamData.reputation;
            }
            if (teamData.reputation  < 0 && teamData.reputation - repPenalty > 0){
                repPenalty = teamData.reputation;
            }
            display.setColor("RED");
            display.setAuthor("FAILURE! | "+ op.name + " Ended");
            
            display.addField("Reputation", `${prCamp}`+teamData.reputation+" -> "+(teamData.reputation-repPenalty));
            //display.addField("Funds", "$"+teamData.funds+" -> "+("$"+(teamData.funds-fundPenalty)));

            teamData.reputation = teamData.reputation -repPenalty;
            //teamData.funds = teamData.funds - fundPenalty;
            var postReport = "**Training**\n"

            var xp = Math.floor(op.prize.xp)/2 || 1
            if (xp){
                for (cape of updatedCapes){
                    var levelUp = levelModule.giveXP(cape,xp);
                    postReport += `${cape.name} gained ${xp} XP.\n`
                    if (levelUp != false){
                        postReport+=levelUp+"\n"
                    }
                }
            }
            
            if (op.name.toLowerCase() != "arena"){
                await mapModule.updateAuth(client,teamData,questObj.district,op.authority[1]);
                postReport+=`:trophy: ${op.authority[1]} authority in ${questObj.district}.`;
            }
            
            display.addField("Debrief",postReport);

        }
        


    }else{

        var missedEnemy = false;

        var recoveryNote = [0,[],0];
        //console.log("Resolving pvp based operation");
        //getting update dataset of enemy
        enemyTeamData = await client.teamsDB.get(`${questObj.enemyid}`,0);
        enemychannel = client.channels.cache.get(questObj.enemychannel);
        
        if (enemyTeamData.preferences){// checking preferences
            if (enemyTeamData.preferences.ping == 'none'){
                pingEnemy = "none";
            }
            if (enemyTeamData.preferences.ping == 'private'){
                pingEnemy = "private";
            }
            if (enemyTeamData.preferences.ping == 'done'){
                pingEnemy = "done"
                for (let cape of enemyTeamData.capes){
                    if (cape.activity == questObj.name){
                        pingEnemy = "none"
                    }
                }
            }
            
        }
        if (!publicguilds.includes(enemychannel.guild.id)){ // forcing the private option
            pingEnemy = "private";
        }
        
        var enemyDecree = await mapModule.returnDecree(client,enemyTeamData.HQLocal[0])
        //matching new array of capes to their id in case name changes or something
        var updatedEnemyCapes = [];
        for (let id of questObj.enemycapeids){
            for (c of enemyTeamData.capes){
                if (c.id == id){
                    c.activity = "none";
                    updatedEnemyCapes.push(c);
                }
            }
        }
        var pvpData = op.runpvp(teamData, updatedCapes,enemyTeamData,updatedEnemyCapes, display,currentDecree);
        result = pvpData[0];
        story = pvpData[1];
        
        
        if (pvpData[2] && pvpData[2] == "missed"){
            //console.log("ignoring")
            missedEnemy = true;
        }

        var repPenalty = Math.floor(op.prize.reputation*op.penalty);
        var fundPenalty = Math.floor(op.prize.funds*op.penalty);
        if (result){

            var penaltyMod = 1;
            if (questObj.district == enemyTeamData.HQLocal[0]){
                penaltyMod = 1;
            }
            if (enemyDecree == "Corruption" && enemyTeamData.HQLocal[0] != questObj.district){
                if (enemyTeamData.reputation < 0 && op.prize.reputation < -0){
                    penaltyMod = penaltyMod * 2
                }
            }
            const penaltyDate = new Date().getTime()+(((op.timeout || (op.time/60/2))/penaltyMod)*1000*60*60);

            if (teamData["image"] && teamData["image"]["approved"]){
                display.setThumbnail(teamData["image"]["url"])
            }
            
            var tributePortion = 0;
            var mapData = await mapModule.returnMapData(client)
            if (currentDecree == "Tribute" && op.prize.reputation < 0){
                
                if (teamData.userid == mapData[questObj.district].holderid){
                    tributePortion = -1 *mapModule.resetAndReturnTribute();
                    display.addField(`Tribute`,`${teamData.name} collected $${-1*tributePortion} from their ongoing Tribute decree.`)
                }else{
                    tributePortion = Math.ceil(op.prize.funds/20)
                    mapModule.addToTribute(tributePortion);
                    display.addField(`Tribute`,`5% of ${teamData.name}'s prize goes to ${mapData[questObj.district].holder}.`)
                }
            }
            

            var prCamp = ''
            if (enemyTeamData.reputation > 0 && repPenalty > 0){
                repPenalty = repPenalty*-2
            }

            var touristFundBonus = 0;
            var touristRepBonus = 0;
            var touristTxt = ``
            if (currentDecree == "Tourist Destination" && !teamData.HQLocal.includes(questObj.district)){
                //bonus for being out of thes district (20% funds and rep)
                touristFundBonus = Math.ceil(op.prize.funds/5);
                touristRepBonus = Math.ceil(op.prize.reputation/5);
                touristTxt = ` (Tourism)`
            }else if (currentDecree == "Tourist Destination" && teamData.HQLocal.includes(questObj.district)){
                // penalty for being home district (lose 20% funds)
                touristFundBonus = -Math.ceil(op.prize.funds/5);
                touristTxt = ` (Tourism)`
            }

            display.setColor("GREEN");
            display.setAuthor("MISSION SUCCESS! | "+ teamData.name + " complete the "+op.name);

            if (enemyTeamData.reputation  > 0 && enemyTeamData.reputation + repPenalty < 0){
                repPenalty = - enemyTeamData.reputation;
            }
            if (enemyTeamData.reputation  < 0 && enemyTeamData.reputation + repPenalty > 0){
                repPenalty = enemyTeamData.reputation;
            }

            display.addField("**"+teamData.name+" Results**",
            `**Reputation${prCamp}${touristTxt}:**`+ teamData.reputation+" -> "+(teamData.reputation+op.prize.reputation+touristRepBonus)+"\n"+
            `**Funds${touristTxt}: **`+ "$"+teamData.funds+" -> "+"$"+(teamData.funds+op.prize.funds-tributePortion+touristFundBonus)
            );
            teamData.reputation = teamData.reputation+op.prize.reputation+touristRepBonus;
            teamData.funds = teamData.funds+op.prize.funds-tributePortion+touristFundBonus;
            
            if (!missedEnemy){
                display.addField("**"+enemyTeamData.name+" Results**",
                `**Reputation${prCamp}:** `+ enemyTeamData.reputation+" -> "+(enemyTeamData.reputation+repPenalty)+"\n");
                //"**Funds: **"+ "$"+enemyTeamData.funds+" -> "+"$"+(enemyTeamData.funds-fundPenalty)
                enemyTeamData.reputation = enemyTeamData.reputation + repPenalty;
                //enemyTeamData.funds = enemyTeamData.funds - fundPenalty;
            }

            { //TRAINING
                var levelInfo = "**Training**\n"
                for (cape of updatedCapes){
                    var levelUp = levelModule.giveXP(cape,(op.prize.xp || 1));
                    levelInfo += `${cape.name} gained ${op.prize.xp || 1} XP.\n`
                    if (levelUp != false){
                        levelInfo+=levelUp+"\n"
                    }
                }

                var xp = Math.floor(op.prize.xp)/2 || 1
                if (xp && !missedEnemy){
                    for (cape of updatedEnemyCapes){
                        var levelUp = levelModule.giveXP(cape,xp);
                        levelInfo += `${cape.name} gained ${xp} XP.\n`
                        if (levelUp != false){
                            levelInfo+=levelUp+"\n"
                        }
                    }
                }
                await mapModule.updateAuth(client,teamData,questObj.district,op.authority[0]);
                levelInfo+=`**Authority**\n${teamData.name} :trophy: +${op.authority[0]} authority in ${questObj.district}.\n`;
                // timeout recovery on pvp capes
                if (!missedEnemy && !enemyTeamData['HQLocal'].includes(questObj.district)){
                    levelInfo+=`**Recovery**\n`
                    recoveryNote[0] = enemyTeamData.userid;
                    recoveryNote[2] = penaltyDate;
                    for (let cape of updatedEnemyCapes){
                        recoveryNote[1].push(cape.name)
                        cape["recoverytime"] = penaltyDate;
                        levelInfo+=`${cape.name} must recover for ${(op.timeout || op.time/60/2)/penaltyMod} hour(s).\n`
                    }
                    if (!enemyTeamData.preferences && !enemyTeamData.preferences['recovery'] || enemyTeamData.preferences['recovery'] == "yes"){
                        recoveryTimers.push(recoveryNote)
                    }
                }
                else{
                    levelInfo+=`**Recovery**\n${enemyTeamData.name} were able to retreat back to their HQ.`
                }

                
                display.addField("Debrief",levelInfo);                
            }
            
        }
        else{
            
            var penaltyMod = 1;
            if (questObj.district == teamData.HQLocal[0]){
                penaltyMod = 1
            }
            if (myDecree == "Corruption" && teamData.HQLocal[0] != questObj.district){
                if (teamData.reputation < 0 && op.prize.reputation < -0){
                    penaltyMod = penaltyMod*2
                }
            }
            const penaltyDate = new Date().getTime()+(((op.timeout || op.time/60/2)/penaltyMod)*1000*60*60);


            if (enemyTeamData["image"] && enemyTeamData["image"]["approved"]){
                display.setThumbnail(enemyTeamData["image"]["url"])
            }
            display.setColor("RED");

            if (!missedEnemy){
                display.setAuthor("MISSION FAILED! | "+ enemyTeamData.name + " interrupted "+teamData.name+"'s "+op.name);

            }else{
                display.setAuthor("MISSION FAILED! | "+teamData.name+" failed the "+op.name);
            }

            var prCamp = ''
            var givenRep = repPenalty;
            if (currentDecree == "PR Campaign" && teamData.reputation > 0 && op.prize.reputation > 0){
                repPenalty = Math.ceil(repPenalty*.5);
                prCamp = ` (PR Campaign)`
            }else if (currentDecree == "PR Campaign" && teamData.reputation < 0 && op.prize.reputation < 0){
                repPenalty = Math.ceil(repPenalty*2);
                prCamp = ` (PR Campaign)`
            }

            if (teamData.reputation  > 0 && teamData.reputation - repPenalty < 0){
                repPenalty = teamData.reputation;
            }
            if (teamData.reputation  < 0 && teamData.reputation - repPenalty > 0){
                repPenalty = -teamData.reputation;
            }
        
            display.addField("**"+teamData.name+" Results**",
            "**Reputation:** "+ teamData.reputation+" -> "+(teamData.reputation-repPenalty)+"\n"
            //"**Funds: **"+ "$"+teamData.funds+" -> "+"$"+(teamData.funds-fundPenalty)
            );
            

            teamData.reputation = teamData.reputation - repPenalty;
            //teamData.funds = teamData.funds + fundPenalty;
            if (!missedEnemy){
                display.addField("**"+enemyTeamData.name+" Results**",
                `**Reputation${prCamp}:** `+ enemyTeamData.reputation+" -> "+(enemyTeamData.reputation-givenRep)+"\n"+
                `**Funds${prCamp}: **`+ "$"+enemyTeamData.funds+" -> "+"$"+(enemyTeamData.funds+fundPenalty)
                );
                enemyTeamData.reputation = enemyTeamData.reputation - givenRep;
                enemyTeamData.funds = enemyTeamData.funds + fundPenalty;
            }

            


            if (op.name.toLowerCase() != "arena"){
                var levelInfo = "**Training**\n"
                if (!missedEnemy){
                    for (cape of updatedEnemyCapes){
                        var levelUp = levelModule.giveXP(cape,(op.prize.xp || 2));
                        levelInfo += `${cape.name} gained ${op.prize.xp || 2} XP.\n`
                        if (levelUp != false){
                            levelInfo+=levelUp+"\n"
                        }
                    }
                }

                var xp = Math.floor(op.prize.xp)/2 || 1
                if (xp){
                    for (cape of updatedCapes){
                        var levelUp = levelModule.giveXP(cape,xp);
                        levelInfo += `${cape.name} gained ${xp} XP.\n`
                        if (levelUp != false){
                            levelInfo+=levelUp+"\n"
                        }
                    }
                }
                
                await mapModule.updateAuth(client,teamData,questObj.district,op.authority[1]);
                if (!missedEnemy){
                    await mapModule.updateAuth(client,enemyTeamData,questObj.district,op.authority[2]);
                }

                levelInfo+=`**Authority**\n${teamData.name} :trophy: ${op.authority[1]} authority in ${questObj.district}.`;
                if (!missedEnemy){
                    levelInfo+=`\n${enemyTeamData.name} :trophy: +${op.authority[2]} authority in ${questObj.district}.\n`;
                }
                if (!teamData['HQLocal'].includes(questObj.district)){
                    levelInfo+=`**Recovery**\n`
                    recoveryNote[0] = teamData.userid;
                    recoveryNote[2] = penaltyDate
                    for (let cape of updatedCapes){
                        cape["recoverytime"] = penaltyDate;
                        recoveryNote[1].push(cape.name);
                        levelInfo+=`${cape.name} must recover for ${(op.timeout || op.time)/60/2/penaltyMod} hour(s).\n`
                    }
                }
                if (!teamData.preferences || !teamData.preferences['recovery'] || teamData.preferences['recovery'] == "yes"){
                    recoveryTimers.push(recoveryNote)
                }
                display.addField("Debrief",levelInfo);
            }
        }


        if (enemyTeamData.preferences){
            if (enemyTeamData.preferences.ping == 'none'){
                pingUser = "none";
            }
            if (enemyTeamData.preferences.ping == 'done'){
                for (let cape of enemyTeamData.capes){
                    if (cape.activity == questObj.name){
                        pingUser = "done"
                    }
                }
            }
        }
        leaderboardModule.update(client,enemyTeamData);
        await client.teamsDB.set(`${questObj.enemyid}`,enemyTeamData);
    }
    
    // giving results
    if (userchannel){
        if (questObj.enemyid != "null" && (questObj.userchannel != questObj.enemychannel || (pingEnemy == "private" || pingUser == "private"))){
            //("posting on other chat")
            
            switch(pingEnemy){
                case("all"):
                    enemychannel.send("<@"+questObj.enemyid+"> "+op.name+ " is finished.");
                    break;
                case("done"):
                    enemychannel.send("<@"+questObj.enemyid+"> Your team has completed their last "+op.name+ ".");
                    break;
                case("none"):
                    enemychannel.send(questObj.enemyteamname+" completed the "+op.name+ " mission.");
                    break;
                case("private"):
                    enemychannel = await client.users.fetch(questObj.enemyid);
                    break;
            }
            
            postMessage(enemychannel,[display,story],)
            switch(pingUser){
                case("all"):
                    userchannel.send("<@"+questObj.userid+"> "+op.name+ " is finished.");
                    break;
                case("done"):
                    userchannel.send("<@"+questObj.userid+"> Your team has completed their last "+op.name+ ".")
                    break;
                case("none"):
                    userchannel.send(questObj.teamname+" completed the "+op.name+ " mission.")
                    break;
                case("private"):
                    userchannel = await client.users.fetch(questObj.userid)
                    break;
            }
            
            postMessage(userchannel,[display,story])
        }else{ // same public channel, yes enemy
            if (questObj.enemyid != "null"){
                var enemyMessage = "<@"+questObj.enemyid+"> "+op.name+ " is finished.";
                var userMessage = "<@"+questObj.userid+">"+op.name+ " is finished.";

                if (pingEnemy == 'none'){
                    enemyMessage = ""
                }
                if (pingEnemy == 'done'){
                    enemyMessage = "<@"+questObj.enemyid+"> Your team has completed their last "+op.name+ "."
                }

                if (pingUser == 'none'){
                    userMessage = ""
                }
                if (pingUser == 'done'){
                    userMessage = "<@"+questObj.userid+"> Your team has completed their last "+op.name+ "."
                } 

                if (pingEnemy == 'all' && pingUser == 'all'){
                    userchannel.send("<@"+questObj.enemyid+"> <@"+questObj.userid+">"+op.name+ " is finished.");
                }else if(pingEnemy == 'none' && pingUser == 'none'){
                    userchannel.send(questObj.enemyteamname + " vs "+ questObj.teamname + " "+questObj.name+" completed.");
                }
                else if (pingEnemy == 'done' && pingUser == 'done'){
                    userchannel.send("<@"+questObj.enemyid+"> <@"+questObj.userid+"> both of your teams have completed their last "+op.name+ ".")
                }
                else{
                    userchannel.send(userMessage+"\n"+enemyMessage);
                }

            }else{// no enemy
                
                switch(pingUser){
                    case("all"):
                        userchannel.send("<@"+questObj.userid+"> "+op.name+ " is finished.");
                        break;
                    case("done"):
                        userchannel.send("<@"+questObj.userid+"> Your team has completed their last "+op.name+ ".")
                        break;
                    case("none"):
                        userchannel.send(questObj.teamname+" completed the "+op.name+ " mission.");
                        break;
                    case("private"):

                        userchannel = await client.users.fetch(questObj.userid)

                        break;
                }
            }
            postMessage(userchannel,[display,story]);
        }
    }else{
        console.log("Could not find user channel. I should PM this to someone");
    }
    

    // removing quest from respondable ops
    if (!preRemoved){
        function opRemovalFilter(indexedOp){
            if (indexedOp.questid != questObj.questid){
                return true;
            }
            return false;
        }
        respondableOps = respondableOps.filter(opRemovalFilter);
        
        await client.questsDB.set("CurrentQuests", respondableOps);
    }


    var totalActives = 0;
    for (let c of teamData.capes){
        if (c.activity != "none"){
            totalActives++;
        }
    }
    
    //console.log("total active capes: "+totalActives)
    // saving data
    leaderboardModule.update(client,teamData);
    await client.teamsDB.set(`${questObj.userid}`,teamData);
    //sleep(1000*5)
    // Removing roles if they drop below 1k

}

async function sendOff(client,teamData,message,args,op,capes,response,myDistrict){

    var currentDecree = await mapModule.returnDecree(client,myDistrict);

    var info = concatNamesIntoList(capes)

    //console.log(capes);
    var timeMod = 1;
    if (currentDecree == "Lockdown" && !teamData.HQLocal.includes(myDistrict)){
        timeMod = 2;
    }

    const sendOffTime = new Date().getTime() + (op.time*60*1000*timeMod);
    var activeIDs = [];
    for (activeCape of capes){
        activeIDs.push(activeCape.id);
    }
    for (activeCape of capes){
        activeCape.activity = op.name;
        activeCape['activitytime'] = sendOffTime;
    }
    if (!response)
        message.channel.send("Sent "+ info + " on "+ op.name.toLowerCase()+ " operation in "+myDistrict+".");
    else
        message.channel.send("Responded to "+op.name.toLowerCase()+" with "+info+".");

    //Saving cape to active list
    await client.teamsDB.set(`${message.author.id}`,teamData);
    
    if (response){
        op.enemycapeids = activeIDs;
        op.enemyteamname = teamData.name;
        op.enemyid = message.author.id;
        op.questid = -1;
        op.enemychannel = message.channel.id;
        let firstUser = client.users.cache.get(op.userid);
        let secondUser = client.users.cache.get(op.enemyid);
        
        /*op.message.edit(op.enemyteamname+" have responded to "
        + op.teamname + "'s "+op.name.toLowerCase()+"."
        );*/
        var results = searchModule.fillCapes(op.name,operations,1);
        
        
        //setting responder's timer
        //                if (responseList[testOp['userid']] && responseList[quetestOpst['userid']] < calculateMaxResponse(testOp.HQLevel)){
        var newResponseList = await returnResponseLists(client,teamData);
        if (newResponseList[op.userid]){
            newResponseList[op.userid] += 1;
        }else{
            newResponseList[op.userid] = 1;
        }
        
        await client.questsDB.set(`${message.author.id}-ResponseList`, newResponseList);

        if (activeUsers.indexOf(op.userid) > -1){
            op['loopcomplete'] = true;
            message.reply("Target user is currently entering operations. Response will resolve momentarily.")
            return;
        }else{
            await completeOperation(client,results[0][0],op);
        }
        
        //await client.questsDB.set("CurrentQuests", respondableOps);
        
        return;
    }

    var questObj = new Object();

    //op data
    questObj["name"] = op.name;
    questObj["userchannel"] = message.channel.id;
    questObj["aborted"] = false;
    questObj['time'] = op.time*timeMod;


    questObj['startdate'] = new Date().getTime();
    //userdata
    questObj['userid'] = teamData.userid;
    questObj['username'] =message.member.user.username;
    questObj['capeids'] = activeIDs;
    questObj['capereq'] = questObj.capeids.length;
    questObj['teamname'] = teamData.name;
    questObj['district'] = myDistrict;
    questObj['HQLevel'] = (teamData.HQ || 1);
    questObj['pvp'] = op.pvp
    questObj['loopcomplete'] = false // turned true when the loop needs to autocomplete
    //Arena flexibility
    if (op.name == "Arena"){
        questObj['capereq'] = activeIDs.length;
    }

    questObj['prize'] = {
        ['funds']: op.prize.funds,
        ['reputation']: op.prize.reputation,
    }
    questObj['penalty'] = op.penalty;

    if (op.pvp == true){
        const channel = await client.channels.cache.get(postchannel);
        var questId = ++nextOpId;
        
        for (actOp of respondableOps){
            if (actOp.questid == questId){
                questId++;
            }
        }
        if (nextOpId >= 9999){
            nextOpId = 0
        }
        questMsg = await channel.send(
            (message.member.nickname || message.member.user.username)
            +" has sent "+teamData.name + " on a "+ op.name+"\n"+
            "Operation requires "+activeIDs.length+" cape(s) "+ "and ends in "+op.time+" minutes.\n"+
            "Use `,respond "+questId+" [capename/id]` to respond!\n"+
            "* * * * * * * * *"
        ); 
        //enemy data
        questObj['enemyid'] = "null";
        questObj['enemycapeids'] = "null";
        questObj['enemyteamname'] = "null";
        questObj["enemychannel"] = message.channel.id;
        //metadata
        questObj['message'] = questMsg;
        questObj["questid"] = questId;
        respondableOps.push(questObj);
        await client.questsDB.set("CurrentQuests", respondableOps);
    }else{
        const channel = await client.channels.cache.get(postchannel);
        var questId = ++nextOpId;
        
        for (actOp of respondableOps){
            if (actOp.questid == questId){
                questId++;
            }
        }
        if (nextOpId >= 9999){
            nextOpId = 0
        }
        questMsg = await channel.send(
            (message.member.nickname || message.member.user.username)
            +" has sent "+teamData.name + " on a "+ op.name+"\n"+
            "Operation requires "+activeIDs.length+" cape(s) "+ "and ends in "+op.time+" minutes.\n"+
            "Use `,respond "+questId+" [capename/id]` to respond!\n"+
            "* * * * * * * * *"
        ); 
        //enemy data
    
        questObj['enemyid'] = "null";
        questObj['enemycapeids'] = "null";
        questObj['enemyteamname'] = "null";
        questObj["enemychannel"] = message.channel.id;
        //metadata
        questObj['message'] = questMsg;
        questObj["questid"] = questId;
        respondableOps.push(questObj);
        await client.questsDB.set("CurrentQuests", respondableOps);
    }

    /*/running final result here
    setTimeout(async function(){
        completeOperation(client,op, questObj);    
    }, op.time*1000*60);*/

}//sendOff

async function startOp(client, teamData, message, args, response){

    var op;

    var myDistrict = teamData.HQLocal[0]

    var altDistrictStringStrength = 3;
    
    if (!response){
        for (let city of maps){
            const districtSearch = searchModule.fillStrings(args.join(" "),city.districts)
            if (districtSearch[1] > altDistrictStringStrength){
                myDistrict = districtSearch[0][0];
                altDistrictStringStrength = districtSearch[1];
            }
        }
        altDistrictStringStrength--;
        if (altDistrictStringStrength > 3){
            if (altDistrictStringStrength > args[0].length){
               // console.log(`${altDistrictStringStrength} > ${args[0]}`)
                args.shift();
            }
            args.shift();
        }
    }

    var argConcat = args.join(" ");

    if (!args[1]){
        message.reply("You must also specify which capes to send.")
        return;
    }

    var offset = 2
    if (!response){
        op = operations[args[0]-1] || undefined;
        if (op && args[0]>9){ // if op num was in double digits offset increases
            offset = 3;
        }
        if (op == undefined){
            var results = searchModule.fillCapes(argConcat,operations,1)
            var collections = results[0];
            if (collections[0]){
                op = collections[0];
                offset = results[1];
            }
        }
    }
    
    // checking if op is a response

    if (!response){
        if (op === undefined){ message.reply(args[0] + " is invalid operation"); return;}
        if ((op.repreq > 0 && teamData.reputation < op.repreq) || (op.repreq < 0 && teamData.reputation > op.repreq)){
            message.reply("You need more reputation before accessing that operation"); return;
        }
        if ((teamData.funds < 0 && op.repreq != 0 && !(op.name == 'Patrol' || op.name == 'Minor Crime Spree'))){
            message.reply("You can not take advanced missions while in debt."); return;
        }
    }else{

        for (var testOp of respondableOps){
            if (testOp.questid == args[0]){
                op = testOp;
            }
        }
        if (op == null){
            message.reply("The operation id you gave is not in use.");
            return;
        }
        if (op.enemyid != "null"){
            message.reply("That operation has already been responded to by "+op.enemyteamname);
            return;
        }
        if (op.userid == message.author.id){
            message.reply("You can not respond to your own operation!");
            return;
        }
        var responseList = await returnResponseLists(client,teamData);

        if (responseList[op.userid] && responseList[op.userid] >= calculateMaxResponse(op.HQLevel)){
            message.reply("You can not respond to that team anymore today!")
            return;
        }
        if (op.aborted){
            message.reply("The operation was aborted.");
            return;
        }
        if (!op.pvp){
            message.reply("That operation is not respondable.");
            return;
        }
    }
    
    var capes = [];
    const currentDate = new Date().getTime()
    if (args[1].toLowerCase() == 'all'){
        for (cape of teamData.capes){
            if (cape.activity == 'none' && (!cape['recoverytime'] || cape['recoverytime'] < currentDate)){
                capes.push(cape);
            }
        }
    }
    else{
        for (var i = 1; i < args.length; i++){
            if (teamData.capes[args[i]-1]){
                capes.push(teamData.capes[args[i]-1]);
                offset += 2
                if (args[i]>9){ // if op num was in double digits offset increases
                    offset++;
                }
            }
            else{
                var found = false;
                var results = searchModule.fillCapes(argConcat.substring(offset),teamData.capes,1);
                var collection = results[0];
                if (collection[0]){
                    found = true;
                    capes.push(collection[0]);
                    offset+= results[1];
                }
    
                if (!found){
                    message.reply(args[i]+" is an invalid cape id/name");
                    return;
                }
            }
        }
    }

    if (capes.length < op.capereq){
        message.reply("You need to send more capes!");
        return;
    }

    // checking if capes were already active
    for (let cape of capes){
        if (cape.activity != 'none'){
            message.reply(cape.name+" is already on a mission. You can not send them until they finish.");
            return;
        }
        if (cape['recoverytime'] && cape['recoverytime'] > currentDate){
            message.reply(`${cape.name} is still recovering from their previous mission (${returnReadableTime(cape['recoverytime']-currentDate)}).`)
            return;
        }
    }

    //cape being sent twice
    for (var i = 0; i < capes.length; i++){
        for (var j = 0; j < capes.length; j++){
            if (capes[i].id == capes[j].id && i !=j ){
                message.reply(`You can not send ${capes[i].name} in multiple cape slots.`)
                return;
            }
        }
    }

    // sending multiple capes at once
    if (capes.length > op.capereq  && !response && !op.flexiblemax){
        //console.log("Multi quest")
        for (var i = 0; i < capes.length; i+=op.capereq){
            var capePod = []
            for (var x = 0; x < op.capereq; x++){
                //console.log(i+" "+x);
                capePod.push(capes[i+x]);
            }
            //console.log("Sending: "+capePod.length);
            //console.log(capePod)
            if (capePod[op.capereq-1]){
                await sendOff(client,teamData,message,args,op,capePod,response,myDistrict);
            }
        }
    }
    else{
        if (!op.flexiblemax || response){
            capes.splice(op.capereq);
        }
        sendOff(client,teamData,message,args,op,capes,response,myDistrict)
    }
}

function compileActiveQuestInfo(quest,currentDate){
    var myIcon = '🎉'
    var enemyIcon = '🎉'
    if (quest['prize']['reputation'] < 0){
        myIcon = '🏅'
        enemyIcon = '☠️'
    }else if (quest['prize']['reputation'] > 0){
        myIcon = '☠️'
        enemyIcon = '🏅'
    }
    var opText = `${quest.questid} **${quest.name}** ${enemyIcon} ${quest.teamname}\n`;

    opText+=`⏳ ${returnReadableTime(quest.startdate-currentDate+(quest.time*60000))} `+`🏙️ ${quest.district} `+
    `🦸 ${quest.capereq} `+
   `💰 $${Math.floor(quest.penalty*quest['prize']['funds'])} ${myIcon} ${Math.floor(-quest.penalty*quest['prize']['reputation'])}\n`;
    return opText;
}


async function reconOperation(client,teamData,message,args){
    
    if (!args[0]){
        message.reply(`Recon: Spend 250 Rep to check what capes are going on an operation.`);
        return
    }
    

    for (let quest of respondableOps){

    }

    
}


async function responseOps(client, message,args,teamData){

    var responseList = await returnResponseLists(client,teamData);

    var display =  new MessageEmbed()
    .setColor("RED");
    display.setAuthor(`Respondable Operations`);

    // only shows one time of open op, prioritized by time until completion
    var shownOps = new Map();
    const currentDate = new Date().getTime();
    var activeTeams = [];
    var activeUsers = []

    var myDistrict = teamData.HQLocal[0]

    var altDistrictStringStrength = 3;
    for (let city of maps){
        const districtSearch = searchModule.fillStrings(args.join(" "),city.districts)
        if (districtSearch[1] > altDistrictStringStrength){
            myDistrict = districtSearch[0][0];
            altDistrictStringStrength = districtSearch[1];
        }
    }
    altDistrictStringStrength--;
    if (altDistrictStringStrength > 3){
        if (altDistrictStringStrength > args[0].length){
            // console.log(`${altDistrictStringStrength} > ${args[0]}`)
            args.shift();
        }
        args.shift();
    }

    for (let quest of respondableOps){

        if (quest.pvp && quest.district === myDistrict && quest.questid > 0 && quest.userid != teamData.userid && !quest.aborted && (!responseList[quest['userid']] || responseList[quest['userid']] < calculateMaxResponse(quest.HQLevel))) {  
            if (shownOps.get(quest.name)){
                if(quest.startdate < shownOps.get(quest.name).startdate){
                    shownOps.set(quest.name, quest)
                }
            }
            else{
                shownOps.set(quest.name, quest)
            }
            if (activeTeams.lastIndexOf(quest.teamname) == -1){
                activeTeams.push(quest.teamname)
            }
            if (activeUsers.lastIndexOf(quest.username) == -1){
                activeUsers.push(quest.username)
            }
        }
    }

    var rogueText = "";
    var heroText = "";
    var villainText = "";

    for (var op of shownOps){
        var quest = op[1];
       
        var opText = compileActiveQuestInfo(quest,currentDate);
        if (quest['prize']['reputation'] > 0){
            heroText+=opText;
        }
        else if (quest.prize.reputation < 0){
            villainText+=opText;
        }
        else if (quest.prize.reputation == 0){
            rogueText+=opText;
        }
    }
    if (rogueText == ""){
        rogueText = "No active rogue operations."
    }
    if (heroText == ""){
        heroText = "No active hero operations."
    }
    if (villainText == ""){
        villainText = "No active villain operations."
    }

    args.splice(0,1);
   // console.log()
    var missionTypeResult = searchModule.fillCapes(args.join(" "),operations,1)
    var teamSearchResult = searchModule.fillStrings(args.join(" "), activeTeams,1)
    var userNameResult = searchModule.fillStrings(args.join(" "), activeUsers,1)
    //console.log("Mission? "+missionTypeResult)
    //console.log("Team? "+teamSearchResult)
    //console.log("Username? "+userNameResult)

    if (args[0] && alignmentShortcuts[args[0].toLowerCase()]){
        //console.log('deteched alignment filture')
        if (alignmentShortcuts[args[0].toLowerCase()]=="hero"){
            display.addField("🏅 **Heroic Operations**",heroText);
        }
        if (alignmentShortcuts[args[0].toLowerCase()]=="villain"){
            display.addField("☠️ **Villainous Operations**",villainText);
        }
        if (alignmentShortcuts[args[0].toLowerCase()]=="rogue"){
            display.addField("💰 **Rogue Operations**",rogueText);
        }
    }
    else if (missionTypeResult[1] > 1 && missionTypeResult[1] > teamSearchResult[1] && missionTypeResult[1] > userNameResult[1]){ // Sort by mission type
        var opName = missionTypeResult[0][0].name;
        //console.log(opName);
        var totalOps = 0
        var baseText = "No active "+opName+ " operations.";
        var searchText = ""
        for (let quest of respondableOps){
            if (quest.questid > 0 && quest.userid != teamData.userid && quest.name == opName && totalOps < 9){
                searchText+= compileActiveQuestInfo(quest,currentDate);
                totalOps++;
            }
        }
        if (totalOps> 0){
            baseText = "";
        }
        display.addField("🔍**Searched: "+opName+"**",baseText+searchText);
    }
    else if (args[0] && teamSearchResult[1] > userNameResult[1] && teamSearchResult[1] >= missionTypeResult[1]){
        var teamName = teamSearchResult[0][0]
        var totalOps = 0
        var baseText = "No active "+teamName+ " operations.";
        var searchText = ""
        for (let quest of respondableOps){
            if (quest.questid > 0 && quest.teamname == teamName && totalOps < 9){
                searchText+= compileActiveQuestInfo(quest,currentDate);
                totalOps++;
            }
        }
        if (totalOps> 0){
            baseText = "";
        }
        display.addField("🔍**Searched: "+teamName+"**",baseText+searchText);
    }
    else if (args[0] && userNameResult[1]>=missionTypeResult[1] && userNameResult[1] >= teamSearchResult[1] ){
        var userName = userNameResult[0][0]
        var totalOps = 0
        var baseText = "No active "+userName+ " operations.";
        var searchText = ""
        for (let quest of respondableOps){
            if (quest.questid > 0 && quest.username == userName && totalOps < 9 && quest.aborted == false){
                searchText+= compileActiveQuestInfo(quest,currentDate);
                totalOps++;
            }
        }
        if (totalOps> 0){
            baseText = "";
        }
    }
    else{
        if (teamData.reputation <= 0){
            display.addField("🏅 **Heroic Operations**",heroText);
        }
        if (teamData.reputation >= 0 ){
            display.addField("☠️ **Villainous Operations**",villainText);
        }
        display.addField("**💰 Rogue Operations**",rogueText);
    }
    
    display.addField("Help","`,respond [op id] [cape ids]` to respond to an ongoing operation."+
    "\n`,re f [alignment/mission/team/user]` to only see missions of that type"
    )

    message.reply(display);
}

async function abortOp(client,teamData,message,args){

    if (!args[0]){
        message.reply("Specify a cape to abort their mission!")
        return;
    }

    var targetCape = teamData.capes[args[0]-1] || null;
    if (targetCape == null){
        var results = searchModule.fillCapes(args.join(' '), teamData.capes, 1);
        var collection = results[0];
        if (collection[0]){
            targetCape = collection[0];
        }
    }
    if (!targetCape && args[0].toLowerCase() != 'all'){
        message.reply("Could not identify cape.");
        return;
    }
    
    if (args[0].toLowerCase() != 'all'){
        if (targetCape.activity == "none"){
            message.reply(`${targetCape.name} is not on a mission.`);
            return;
        }
        if (targetCape == null){
            //console.log("Could not find cape.");
            return;
        }
    }
    

    var activeCapes = [];
    if (args[0].toLowerCase() == 'all'){
        for (let cape of teamData.capes){
            if (cape.activity != 'none'){
                activeCapes.push(cape);
            }
        }
    }
    else{
        activeCapes.push(targetCape)
    }
    var aborts = 0;
    var logMsg = "Aborting: ";
    
    for (let cape of activeCapes){
        logMsg+=`${cape.name} / `;
        var found = false;

        for (var i = 0; i < respondableOps.length; i++){
            var quest = respondableOps[i];

            if (quest.name == cape.activity && quest.userid == teamData.userid){
                for (testId of quest.capeids){
                    if (testId == cape.id){
                      //  console.log("found cape in active ops")
                        found = true;
                    }else{
                        //console.log(`not my cape: ${cape.id} / test: ${testId}`)
                    }
                }
                if (found){
                    //console.log("found")
                    if (quest.enemyid == "null"){
                        //console.log('aborted')
                        quest['aborted'] = true;
                        //console.log('quest is now: '+quest['aborted'])
                        for (var id of quest.capeids){
                            for (var testCape of teamData.capes){
                                if (id == testCape.id){
                                    testCape.activity = "none";
                                }
                            }
                        }
                        // respondableOps.splice(i,1);//problematic
                        if (quest.message){
                            //quest.message.edit(quest.teamname+" has aborted their "+quest.name+".");
                        }
                        aborts++;
                        message.reply(`Aborted ${quest.name}.`);
                        //return;
                    }
                    else{
                        message.reply("You can not abort a mission that has been responded to.");
                        //return;
                    }
                }
                
            }else{
                //console.log(`not MY quest`)

            }
            
        }
        if (cape.activity != "none" && found == false){
            //console.log("could not find quest")
            aborts++;
            cape.activity = "none"
        }
    }
    //console.log(logMsg);
    if (aborts > 0){
        await client.teamsDB.set(`${teamData.userid}`,teamData);
        await client.questsDB.set("CurrentQuests", respondableOps);
        return;
    }

    message.reply("Could not find cape's operation.");
    
    return;

}



module.exports.run = async (client, message, args) =>{
    if (activeUsers.indexOf(message.author.id) > -1){
        return;
    }
    
    activeUsers.push(message.author.id);
    //const backUpData = await client.teamsDB.get(`706955611929313310`,[]);
    //console.log(JSON.stringify(backUpData.capes));

    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        activeUsers.splice(activeUsers.indexOf(message.author.id),1)
        return
    }
    
    // removing broken quests
    if (!cleanedUsers[message.author.id]){

        var collection = teamData.capes;
        if (teamData.reservedcapes){
            collection = [...teamData.capes,...teamData.reservedcapes]
        }
        var usedIds = []// turning replicated ids to a new one
        for (let cape of collection){
            if (!usedIds.includes(cape.id)){
                usedIds.push(cape.id);
            }else{
                teamData.nextid++;
                cape.id = teamData.nextid;
                teamData.nextid++;
                console.log('fixed '+cape.name)
                usedIds.push(cape.id)
            }
        }

        
        for (var cape of teamData.capes){
            var isQuesting = false;
            for (var quest of respondableOps){
                for (var testCape of quest.enemycapeids){
                    if(testCape.id == cape.id){
                        isQuesting = true;
                    }
                }
                for (var testCape of quest.capeids){
                    if(testCape.id == cape.id){
                        isQuesting = true;
                    }
                }
            }
            if (!isQuesting){
                cape.activity = "none"
            }
        }
        

        cleanedUsers[message.author.id] = true;
        await client.teamsDB.set(`${message.author.id}`, teamData)
    }
    
    // checking if operation has set up in a territory or not
    if (!teamData["HQLocal"]){
        message.reply("Welcome to Team Operations! Before you send your group on missions you must first decide where"
        +" to place your team's HQ with `,map HQ`");
        activeUsers.splice(activeUsers.indexOf(message.author.id),1)
        return;
    }

    // response
    if (args[1] || message.content.substring(1,6) == "recon" || message.content.substring(1,8) == "respond" || message.content.substring(1,9) == "response" || message.content.substring(1,3) == "re" || message.content.substring(1,6) == "abort"){
        if (message.content.substring(1,8) == "respond" || message.content.substring(1,3) == "re"|| message.content.substring(1,9) == "response"){
            if (!args[1] || args[0] == 'f' || args[1] == 'f'){
                await responseOps(client,message,args,teamData);
            }
            else{
                await startOp(client, teamData, message, args, true);
            }
        }
        else if(message.content.substring(1,6) == "abort"){
            await abortOp(client,teamData,message,args);
        }
        else if (message.content.substring(1,6) == "recon"){
            await reconOperation(client,teamData,message,args);
        }
        else{
            await startOp(client,teamData, message, args, false).catch(console.error); 
        }
        activeUsers.splice(activeUsers.indexOf(message.author.id),1)
        return;
    }

    // Recon

    var display =  new MessageEmbed()
    .setColor("RED")
    .setAuthor(`Operations | `+teamData.name)
    var statInfo = `💰 $${teamData.funds}  `
    if (teamData.reputation > 0){
        statInfo+=`🏅 ${teamData.reputation}`
    }else if (teamData.reputation < 0){
        statInfo+=`☠️ ${teamData.reputation}`
    }else {
        statInfo+=`🎉 ${teamData.reputation}`
    }
    statInfo+= `  🏙️ ${teamData["HQLocal"][0]}`

    display.addField("**Stats**",statInfo,false)

    var info = "";

    var longestCharName = 0;
    for (cape of teamData.capes){
        //console.log(cape.activity);
        if (cape.name.length > longestCharName){
            longestCharName = cape.name.length+1
        }
    }

    var capeInfo = "";
    const spaceChar = '\xa0'
    const currentTime = new Date().getTime()
    for (var count = 1; count <= teamData.capes.length; count++){
        var cape = teamData.capes[count-1];

        var repeats = longestCharName-cape.name.length//-cape.class.length;
        if (count > 9){
            repeats--;
        }
        if (repeats < 1){ repeats = 1;}
        var battlestats = getBattleStats(cape)

        capeInfo += classEmojis[cape.class]+"`"+count+" "+cape.name+""+spaceChar.repeat(repeats)+"`";
        //cape stats, emoji or text
        if (cape.activity == "none" && (!cape['recoverytime'] || cape['recoverytime'] < currentTime)){
            if (teamData['preferences'] && teamData.preferences['display'] && teamData.preferences["display"] =="text"){
                capeInfo += "` S-"+battlestats.strength
                if (battlestats.strength < 10){
                    capeInfo+=" "
                }
                capeInfo+="| V-"+battlestats.vitality;
                if (battlestats.vitality < 10){
                    capeInfo+=" "
                }
                capeInfo+="| U-"+battlestats.utility
                if (battlestats.utility < 10){
                    capeInfo+=" "
                }
                capeInfo+="| C-"+battlestats.control
                if (battlestats.control < 10){
                    capeInfo+=" "
                }
                capeInfo+="| T-"+battlestats.technique
                if (battlestats.technique < 10){
                    capeInfo+=" "
                }
                capeInfo+="`\n";
            }else{
                capeInfo+=
                `${statEmojis['strength']}`+battlestats.strength;
                if (battlestats.strength < 10){
                    capeInfo+=" "
                }
                capeInfo+=`${statEmojis['vitality']} `+battlestats.vitality;
                if (battlestats.vitality < 10){
                    capeInfo+=" "
                }
                capeInfo+=`${statEmojis['utility']} `+battlestats.utility
                if (battlestats.utility < 10){
                    capeInfo+=" "
                }
                capeInfo+=`${statEmojis['control']} `+battlestats.control
                if (battlestats.control < 10){
                    capeInfo+=" "
                }
                capeInfo+=`${statEmojis['technique']} `+battlestats.technique
                if (battlestats.technique < 10){
                    capeInfo+=" "
                }
                capeInfo+="\n";
            }
        }else if (cape.activity != 'none'){
            var myIcon = '💰'
            for (var tryOp of operations){
                if (tryOp.name == cape.activity){
                    if (tryOp.prize.reputation>0){
                        myIcon = '🏅'
                    }else if (tryOp.prize.reputation<0){
                        myIcon = '☠️'
                    }
                }
            }
            capeInfo+= `${myIcon} ${cape.activity} ⏳ ${returnReadableTime(cape["activitytime"]-currentTime)}\n`;
        }else {
            // needs to recover
            capeInfo+= `🏥 ${returnReadableTime(cape["recoverytime"]-currentTime)}\n`;
        }
        
    }
    
    display.addField("Roster", capeInfo, false);
    
    var rogueText = "";
    var heroText = "";
    var villainText = "";
    

    count = 0;

    
    for(var op of operations){
        var opText = "";
        count++;
        var myIcon = '🎉'

        if (op.repreq > 0){
            myIcon = '🏅'
        }else if (op.repreq < 0){
            myIcon = '☠️'
        }
        var reqlock = " 🔒 ("+op.repreq+" Rep)";

        opText+= `${count} **${op.name}**`
        if ((op.repreq >= 0 && teamData.reputation >= op.repreq) || (op.repreq <= 0 && teamData.reputation <= op.repreq)){
            opText+=` 🕔 ${returnReadableTime(op.time*60*1000)} 🦸 ${op.capereq} `+
            `${'💰'} $${op.prize.funds} ${myIcon} ${op.prize.reputation}`;
        }
        else{
            opText += reqlock;
        }
        opText+= `  📄 *${op.info}*\n`  
        
        if (op.prize.reputation > 0){
            heroText+=opText;
        }
        else if (op.prize.reputation < 0){
            villainText+=opText;
        }
        else if (op.prize.reputation == 0){
            rogueText+=opText;
        }
    }


    if (args[0] && alignmentShortcuts[args[0].toLowerCase()]){
        if (alignmentShortcuts[args[0].toLowerCase()]=="hero"){
            display.addField("🏅 **Heroic Operations**",heroText);
        }
        if (alignmentShortcuts[args[0].toLowerCase()]=="villain"){
            display.addField("☠️ **Villainous Operations**",villainText);
        }
        if (alignmentShortcuts[args[0].toLowerCase()]=="rogue"){
            display.addField("💰 **Rogue Operations**",rogueText);
        }
    }
    else{
        if (teamData.reputation >= 0){
            display.addField("🏅 **Heroic Operations**",heroText);
        }
        if (teamData.reputation <= 0){
            display.addField("☠️ **Villainous Operations**",villainText);
        }
        display.addField("💰 **Rogue Operations**",rogueText);
    }

    display.addField(
        "Help","`,op [optional district] [operation] [cape]` to send a cape on that op."+
        "\n`,abort [cape]` to stop a mission"+
        "\n`,op [alignment]` to only see missions of that type"+
        "\n `,re [optional district] f [keyword: operations, username, teamname, alignment]` to search for a mission type, team, or username in the respondable missions"
    );
    
    message.reply(display);
    activeUsers.splice(activeUsers.indexOf(message.author.id),1)

}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
module.exports.setup = async(client) =>{
    respondableOps = await client.questsDB.get("CurrentQuests", []);
    // completing saved quests
    console.log(respondableOps.length+" Backlogged Quests")

    var abortedMissions = 0
    while (respondableOps.length > abortedMissions)
    {
        console.log("Looping: "+abortedMissions+"/"+respondableOps.length)
        for (op of operations){
            for (questObj of respondableOps){
                if (questObj.name == op.name){
                    //console.log(questObj)
                    if (questObj.aborted == true){
                        abortedMissions++
                    }
                    else{
                        console.log("Completing "+op.name);
                        await completeOperation(client,op,questObj);
                    }
                    
                }
            }
        }
    }
    respondableOps = [];
    console.log("readied quest");

    function getFinished(questObj){
        if (questObj.aborted || activeUsers.indexOf(questObj.userid) != -1 || activeUsers.indexOf(questObj.enemyid) != -1){
            return false;
        }
        if (questObj.loopcomplete && activeUsers.indexOf(questObj.userid) == -1 && activeUsers.indexOf(questObj.enemyid) == -1){
            return true;
        }
        const myDate = new Date();
        if (questObj.startdate+(questObj.time*60*1000) < myDate.getTime() && questObj.aborted != true){
            //console.log(`Expected Time: ${questObj.startdate+(questObj.time*60*1000)}, current: ${myDate.getTime()}`)
            return true;
        }
        return false;
    }

    function getRemaining(questObj){
        if (questObj.aborted){
            return false;
        }
        
        const myDate = new Date();
        if (questObj.startdate+(questObj.time*60*1000) >myDate.getTime() && questObj.aborted != true){
            //console.log(`Expected Time: ${questObj.startdate+(questObj.time*60*1000)}, current: ${myDate.getTime()}`)
            return true;
        }
        if (questObj.loopcomplete && (activeUsers.indexOf(questObj.userid) > -1 || activeUsers.indexOf(questObj.enemyid) > -1)){
            return true;
        }
        if (activeUsers.indexOf(questObj.userid) != -1 || activeUsers.indexOf(questObj.enemyid) != -1){
            return true;
        }
        return false;
    }


    var increment = 30*1000


    function getRecoveryFiter(recoveryObj){ //[userid,[cape names],timenotifcation]
        if (recoveryObj[2] < new Date().getTime()){
            userchannel = client.users.cache.get(recoveryObj[0]);
            if (userchannel){
                userchannel.send(`${recoveryObj[1].join(" / ")} finished recovering.`);
            }
            return false;
        }
        return true;
    }

    setInterval(async function(){ 
        var tobeFinished =  respondableOps.filter(getFinished)
        var remainingOperations = respondableOps.filter(getRemaining)
        for (let questObj of tobeFinished){
            for (let op of operations){
                if (questObj.name == op.name){
                    //console.log(questObj)
                    //console.log("Completing "+op.name);
                    //var startT = new Date().getTime()
                    await completeOperation(client,op,questObj,true);
                    //var endT = new Date().getTime()
                    //console.log(`mili-dif = ${endT-startT}`)
                }
            }
        }
        respondableOps = remainingOperations;
        await client.questsDB.set("CurrentQuests", respondableOps);

        //checking response pings
        recoveryTimers = recoveryTimers.filter(getRecoveryFiter);
    }, increment);

    /*while (true){
        sleep(30*1000);
        task();
    }*/

}

module.exports.help = {
    name: "op",
    description: "Send your capes on a mission to gain funds and reputation with `,op [operation] [capes]`\n"
    +"Other teams can respond to your mission to disrupt you and gain prizes of their own with the `,respond` command",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}

module.exports.limits = {
    ratelimit: 1,
    cooldown: 2000
}

