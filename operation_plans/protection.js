/*
Protection Detail

// TO DO

*/
const fightModule = require('../structures/fight')
const waveModule = require('./waves')
const armoryModule = require('../structures/armory')
const traitsModule = require('../chargen/traits')
const powerModule = require('../chargen/powers');
const capeModule = require('../commands/cape')


const diffiCultyMod = 1;

function returnFullStat(cape,targetStat){
    if (cape.items){
        var myStat = cape[targetStat]
        for (let item of cape.items){
            const itemData = armoryModule.getData(item)
            const set = itemData.bonus.set;
            const alter = itemData.bonus.alter;
            if (set[targetStat]){
                myStat = set[targetStat]
            }
            if (alter[targetStat]){
                myStat = myStat+alter[targetStat]
                if (myStat < 1){
                    myStat = 1
                }
            }
        }
        return myStat;
    }else{
        return(cape[targetStat])
    }
}
function statCheck(cape, dc, stat,bonus){
    var statTotal = returnFullStat(cape,stat)
    if (bonus){
        statTotal = Math.ceil(statTotal*bonus)
    }
    var measure = statTotal+dc;
    if (Math.floor(Math.random()*measure+1) <= statTotal){
        return true;
    }
    return false;
}
function getHighestStat(capes,stat,bonusClass){
    //bonusClass should give the person x1.5 ability

    var highest = capes[0]
    var maxStat = returnFullStat(highest,stat);
    for (let cape of capes){
        var myStat = returnFullStat(cape,stat)
        if (bonusClass && powerModule.getSubclass(cape)==bonusClass){
            myStat = myStat*1.5
        }
        if (maxStat < myStat){
            highest = cape;
            maxStat = returnFullStat(cape,stat)
        }
    }
    return (highest)
}
function aliveFilter(cape){
    return (cape.vitality > 0)
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

function unwrapFightText(fightLog,story){ //compiles a fightlog into a story
    for (let round of (fightLog)){
            story.push(round);
    }
    return story;
}

function recoverCapes(capes,savedStats){
    for (let cape of capes){
        for (let save of savedStats){
            if (save.id == cape.id && save.vitality > 0){
                var healing = Math.ceil(cape.vitality*.5)
                if (healing+save.vitality > cape.vitality){
                    save.vitality = cape.vitality;
                   // console.log("healing: "+`topped up`+` ${cape.name}(${save.vitality})`)

                }else{
                    save.vitality+=healing;
                   // console.log("healing: "+healing+` ${cape.name}(${save.vitality})`)
                }

            }
        }
    }
    return savedStats;
}



/*
Three potential fights:

Scouting and watching perimiter (Calm) (Reckless).
Main Detail (With other body guard if there is an item.) (Aggressive/Reserved) 
Inner Detail (with the client) (Stubborn, Cautious)

Cooperative will fill a missing slot.


Enemies will either be mercenaries (Alpha, beta, delta, etc)
Or villains

*/

const enemyTypes = [
    "Mercenaries",
    "Villians"
]


const VIPs = [
    "D-list Celebrity",
    "Local Politician",
    "Businessperson"
]


const events = [ //hired to protect
    "protect a [CLIENT] at a public event.",
    "act as security for a [CLIENT].",
]



module.exports.run = (teamData,capes,decree) =>{
var story = []
var myPage = []
var result = true;

var enemyType = enemyTypes[Math.floor(Math.random()*enemyTypes.length)]
var vip = VIPs[Math.floor(Math.random()*VIPs.length)]
var event = events[Math.floor(Math.random()*events.length)]

myPage.push (
    `${teamData.name} is contracted to ${event.replace('[CLIENT]',vip.toLowerCase())} `);

// var calculating traits
var scouts = []; //perimeter
var maindetail = [] //main area
var personaldetail = [] 


var cooperatives = []//get filled in after
for (let cape of capes){
    var traits = traitsModule.getTraits(cape);
    var given = false;
    if (!given && traits.includes("Cooperative")){
        cooperatives.push(cape);
        given = true;
    }
    if (!given && (traits.includes("Stubborn") || traits.includes("Cautious"))){
        personaldetail.push(cape);
        given = true;
    }
    if (!given && (traits.includes("Aggressive") || traits.includes("Reserved"))){
        maindetail.push(cape);
        given = true;
        continue;
    }
    if (!given && (traits.includes("Calm") || traits.includes("Reckless"))){
        scouts.push(cape);
        given = true;
    }
}

for (let cape of cooperatives){
    var given = false;
    if (!given && scouts.length == 0){
        scouts.push(cape);
        given = true;
    }
    if (!given && maindetail.length == 0){
        maindetail.push(cape);
        given = true;
    }
    if (!given && personaldetail.length == 0){
        personaldetail.push(cape);
        given = true;
    }

    if (traits.includes("Stubborn") || traits.includes("Cautious")){
        personaldetail.push(cape);
        given = true;
    }
    if (traits.includes("Aggressive") || traits.includes("Reserved")){
        maindetail.push(cape);
        given = true;
    }
    if (traits.includes("Calm") || traits.includes("Reckless")){
        scouts.push(cape);
        given = true;
    }
    if (!given){
        switch(Math.floor(Math.random()*3)){
            case(0):
                scouts.push(cape)
                break;
            case(1):
                maindetail.push(cape)
                break;
            case(2):
                personaldetail.push(cape)
                break;
        }
    }
    
}
//output text
if (scouts.length == 1){
    myPage.push(`${concatNamesIntoList(scouts)} elects to guard the perimeter and scout for incoming threats.(Calm/Reckless) `)
}else if (scouts.length > 1){
    myPage.push(`${concatNamesIntoList(scouts)} elect to guard the perimeter and scout for incoming threats.(Calm/Reckless) `)
}
if (maindetail.length == 1){
    myPage.push(`${concatNamesIntoList(maindetail)} is assigned to be the main detail.(Aggressive/Reserved) `)
}else if (maindetail.length > 1){
    myPage.push(`${concatNamesIntoList(maindetail)} are assigned to the main detail.(Aggressive/Reserved) `)
}
if (personaldetail.length == 1){
    myPage.push(`${concatNamesIntoList(personaldetail)} acts as a bodyguard.(Stubborn/Cautious) `)
}else if (personaldetail.length > 1){
    myPage.push(`${concatNamesIntoList(personaldetail)} act as personal bodyguards.(Stubborn/Cautious) `)
}

story.push(myPage)
myPage = [];


// attacking
if (Math.floor(Math.random()*5)==0){
    story.push(['The mission is completed without any interuptions. '])
    return([true,story,"missed"])
}


myPage.push([`Their client is attacked by a group of ${enemyType.toLowerCase()}! `])

var enemyWins = 0;

//Scouting battle
var enemyScouts = waveModule.getEnemies(enemyType,Math.floor(Math.random()*2)+1);
var enemyMain = waveModule.getEnemies(enemyType,Math.floor(Math.random()*3)+1,enemyScouts.length);
var enemyBodyguard = waveModule.getEnemies(enemyType,Math.floor(Math.random()*2)+1,enemyScouts.length+enemyMain.length);
//console.log(enemyScouts)
//console.log(enemyMain)
//console.log(enemyBodyguard)

var savedStats= null;
if (scouts.length > 0){
    myPage.push(`${scouts[0].name} notices their initial force and moves to intercept! \n`);
    story.push(myPage);
    myPage= [];
    var scoutFightData = fightModule.startFight(scouts,enemyScouts,{["savestats"]: true,['compress']:true});
    story = unwrapFightText(scoutFightData[1],story);
    if (scoutFightData[0]){
        savedStats = recoverCapes(scouts,scoutFightData[2]);
        var singular = ""
        if (savedStats.filter(aliveFilter).length == 1){
            singular = "s"
        }
        myPage.push(`\n\n${concatNamesIntoList(savedStats.filter(aliveFilter))} retreat${singular} to the main detail. `)
        
    }else{
        myPage.push(`\nThe ${enemyType.toLowerCase()} rush through the perimeter without the need to sneak in. `);
        enemyMain = [...enemyMain,...enemyScouts];
        savedStats = []
    }
}else{
    myPage.push(`\nThey rush through the perimeter without the need to sneak in. `);
    enemyMain = [...enemyMain,...enemyScouts];
    savedStats = []
}

if ((maindetail.length > 0 || savedStats.filter(aliveFilter))){
    const mainForceNames = [...maindetail,...savedStats.filter(aliveFilter)]
    myPage.push(`\n${concatNamesIntoList(mainForceNames)} clash with the incoming forces. `);
    story.push(myPage);
    myPage= [];
    var mainFightData = fightModule.startFight([...maindetail,...scouts],enemyMain,{["loadstats"]: savedStats,["savestats"]: true,['compress']:true});

    story = unwrapFightText(mainFightData[1],story);
    if (mainFightData[0]){
        savedStats = recoverCapes(scouts,mainFightData[2]);
        var singular = ""
        if (savedStats.filter(aliveFilter).length == 1){
            singular = "s"
        }
        myPage.push(`\n${concatNamesIntoList(savedStats.filter(aliveFilter))} back${singular} to  guard the ${enemyType}. `)
        personaldetail = [...maindetail,...personaldetail];
    }else{
        myPage.push(`\nWith nothing else stopping them, the ${enemyType.toLowerCase()} make a final attack on the ${vip.toLowerCase()}. `);
        enemyBodyguard = [...enemyMain,...enemyBodyguard];
        savedStats = []

    }
}else{
    myPage.push(`\nWith nothing else stopping them, the ${enemyType} make a final attack on the ${enemyType}. `);
    enemyBodyguard = [...enemyMain,...enemyBodyguard];
    savedStats = []
}


if ((personaldetail.length > 0 || savedStats.filter(aliveFilter))){
    const personalForceNames = [...personaldetail,...savedStats.filter(aliveFilter)]
    myPage.push(`\n${concatNamesIntoList(personalForceNames)} dive to protect the VIP. `);
    story.push(myPage);
    myPage= [];
    var personalFightData = fightModule.startFight([...personaldetail,...maindetail,...scouts],enemyBodyguard,{["loadstats"]: savedStats,['compress']:true});

    story = unwrapFightText(personalFightData[1],story);
    if (personalFightData[0]){
        myPage.push(`\nThe ${vip.toLowerCase()} is escorted to safety. `);

    }else{
        myPage.push(`\nThe ${vip.toLowerCase()} is taken by the ${enemyType}. ${teamData.name} is forced to give compensation.`);
        result = false;
    }
}else{
    myPage.push(`\nThe ${vip.toLowerCase()} is taken by the ${enemyType}. ${teamData.name} is forced to give compensation.`);
    enemyBodyguard = [...enemyMain,...enemyBodyguard];
    result = false;
}

story.push(myPage)



//console.log(story)
return([result,story,"missed"])
}




var cape1 = capeModule.genCape();
//module.exports.run({name: "Test Team"},cape1);

