// TO DO
/*

- add a help command for traits

*/
const fightModule = require('../structures/fight')
const waveModule = require('./waves')
const armoryModule = require('../structures/armory')
const traitsModule = require('../chargen/traits')
const powerModule = require('../chargen/powers');
const capeModule = require('../commands/cape')



/*
tickgoal: X - how many successes
goalDC: X - 
goalStat: comparison stat.
*/

const diffiCultyMod = 1;

var muggerStats = {
    name: `Mugger`,
    class:"Human",

    weapon: "Pistol",
    items:["Pistol"],

    strength: 3,
    vitality: 5,
    utility: 2,
    control: 2,
    technique: 3
}


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









module.exports.run = (teamData,cape,enemyTeamData,enemyCape,decree) =>{
var foughtResponders = "missed";
var patrolMethod = null;
var story = []

var myPage = []

// discuss briefing
var discussionResult = traitsModule.makeChoice([cape],['Calm','Aggressive']);

switch(discussionResult[0]){
    case("Calm"): // sneak around
        patrolMethod ="Survey"
        myPage.push(`(Calm) ${cape.name} decides to sneak along rooftops and back alleys to catch a crime in action. `);
        break;
    case("Aggressive"): // Go for gang territory
        patrolMethod ="Hunt"
        myPage.push(`(Aggressive) ${cape.name} plans their patrol where recent gang activity has occurred. `.replace('their',cape['pos'] || 'their'));
        break;
    default: // wander the streets
        patrolMethod ="Wander"
        myPage.push(`${cape.name} wanders the streets randomly. `);
}


function mugging(){
    if (patrolMethod = "Survey"){
        myPage.push(`They find a mugging in progress and get the drop on the criminal. `);

    }
    else{
        myPage.push(`They encounter a mugging in progress and move to intercept. `);
    }
    var muggerFightData = fightModule.startFight([cape],[muggerStats],{['compress']:true});
    story.push(myPage)
    myPage = [];

    story = unwrapFightText(muggerFightData[1],story);
    if (muggerFightData[0]){
        myPage.push(` ${cape.name} returns the stolen goods and pockets the rest of their wallet. `.replace('their',cape['pos'] || 'their'));
        story.push(myPage);

        return true;
    }
    else{
        myPage.push(`The mugger runs away, stolen items in hand. ${cape.name} is identified as an interceptor and takes partial blame. `);
        story.push(myPage);
        return false;
    }
}

var result = true;
switch (Math.ceil(Math.random()*1)){

    default:
        result = mugging();
}



//console.log(story)
return([result,story,foughtResponders])
}




var cape1 = capeModule.genCape();
//module.exports.run({name: "Test Team"},cape1);

