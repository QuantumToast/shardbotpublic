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

const diffiCultyMod = 1.5;


const goals = [
    {
        name: "cash",
        prompt: "Their goal is to take as much money as possible from the central vault. ",

        goalDC: 5,
        goalStat: "strength",

        goalFlavor: "[USER] attempts to break the vault door with their [WEAPONS]",
        goalFail: " but the vault holds. ",
        goalSuccess: " cracking open the vault!"

    },
    {
        name: "deed",
        prompt: "Their goal is to find and steal a specific property deed for their HQ. ",

        goalDC: 5,
        goalStat: "utility",

        goalFlavor: "[USER] searches for the right lockbox",
        goalFail: " but they  can not find it. ",
        goalSuccess: " and correctly identify where the deed is held!"
    },
    {
        name: "exotic material",
        prompt: "Their goal is to take a rare exotic material being held by the bank. ",

        goalDC: 5,
        goalStat: "technique",

        goalFlavor: "[USER] searches the storage for the material",
        goalFail: " but they can not find it so far. ",
        goalSuccess: " and find a box matching the description!"

    }
]

var guardStats = [
    {
        name: `Door Guard`,
        class:"Human",

        weapon: "Pistol",
        items:["Pistol"],

        strength: 2,
        vitality: 6,
        utility: 2,
        control: 1,
        technique: 3,
    },
    {
        name: `Desk Guard`,
        class:"Human",

        weapon: "Pistol",
        items: ["Pistol"],
        
        strength: 3,
        vitality: 6,
        utility: 2,
        control: 1,
        technique: 3
    }
]




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


module.exports.run = (teamData,capes,enemyTeamData,enemyCapes,decree) =>{
var foughtResponders = "missed";


// scouting bonuses
var mapping = 0;    // Finding objective and escaping the area.
var people = 0;     //Knowledge of people and systems. Helps with response times and avoiding guards.

const missionObjective = goals[Math.floor(Math.random()*goals.length)];
var story = []

var kidnapVictim = null;
var scoutingOption = null;
var initiativeOption = null;
var hostages = false;
var hostageKeeper = null;

var savedStats = null

var myPage = []

// discuss briefing
myPage.push (
    `${concatNamesIntoList(capes)} gather to plan out their heist. ${missionObjective.prompt}`);


//run scouting
var discussionResult = traitsModule.makeChoice(capes,['Calm','Aggressive']);



switch(discussionResult[0]){
    case("Calm"): // the scouting out the area
        scoutingOption ="Survey"
        var scouter = getHighestStat(capes,"technique","Surveillance")

        if (discussionResult[1].length == 1){
            myPage.push (
                `(${discussionResult[0]}) ${concatNamesIntoList(discussionResult[1])} decides to survey the bank personally, ${scouter.name} is elected. `)
    
        }else{
            myPage.push (
                `(${discussionResult[0]}) ${concatNamesIntoList(discussionResult[1])} decide to survey the bank personally, ${scouter.name} is elected. `)
        }

        
        if (statCheck(scouter,Math.ceil(diffiCultyMod*3),"technique")){
            myPage.push(`${scouter.alias.substring(0, scouter.alias.indexOf(' ')) || scouter.alias} walks around the bank and maps out the exterior, noting the exits and entrances. `)
            mapping+=1;
            if (statCheck(scouter,Math.ceil(diffiCultyMod*6),"technique")){
                myPage.push(`They even manage to get into a restricted area that they will explore when they come back. `)
                mapping+=1;
            }
            if (powerModule.getSubclass(scouter) == "Surveillance"){
                myPage.push("Their surveillance abilities gives them more information than expected. ")
                mapping+=1;
            }
        }else{
            myPage.push (
                `${scouter.alias.substring(0, scouter.alias.indexOf(' ')) || scouter.alias} visits the area but is unable to surveil the area without arising suspision. `)
        }

        

        break;
    case("Aggressive"): // the kidnapping option
        scoutingOption ="Kidnap"    
        const kidnnapables = [
            ['guard', 2],
            ['janitor', 1],
        ]
        var text = ""
        if (discussionResult[1].length == 1){
            text = `(${discussionResult[0]}) ${concatNamesIntoList(discussionResult[1])} decides to kidnap a current employee for info before they do the job. `
        }else{
            text = `(${discussionResult[0]}) ${concatNamesIntoList(discussionResult[1])} decide to kidnap a current employee for info before they do the job. `
        }
        
        kidnapVictim = kidnnapables[Math.floor(Math.random()*kidnnapables.length)]
        
        var kidnapper = getHighestStat(capes,"strength","Ambush")
        var ambushBonus = 1;
        if (powerModule.getSubclass(kidnapper)=="Ambush"){
            ambushBonus = 1.5
        }
        if (statCheck(kidnapper,Math.ceil(diffiCultyMod*Math.ceil(kidnapVictim[1]*2)),'strength',ambushBonus)){
            text+= `They find a ${kidnapVictim[0]} that ${kidnapper.name} is able to subdue`
            if (ambushBonus > 1){
                text+=" with the help from their power. "
            }else{
                text+=". "
            }
            text+= `The ${kidnapVictim[0]} gives them info on the personnel in the building, making it easier to avoid attention.`

            people += (kidnapVictim[1]);

        }else{
            text+= `They find a ${kidnapVictim[0]} but ${kidnapper.name} fails to restrain them in time. `
            kidnapVictim = null
        }

        myPage.push(text);
        break;
    default: // dumb blitz option
        scoutingOption ="Blitz"
        if (discussionResult[1].length > 0){
            myPage.push (
                `${concatNamesIntoList(discussionResult[1])} are unable to agree so the team doesn't plan ahead. `);
        }else{
            myPage.push (
                `They are unable to come up with a solid plan. `);

        }
         
    }

// Run Entrance
discussionResult = traitsModule.makeChoice(capes,['Impulsive','Reserved']);
var disguise = false;
var stealth = false;
switch(discussionResult[0]){
    case('Impulsive'):
        var plur = ""
        if (discussionResult[1].length == 1){
            plur = 's'
        }
        myPage.push(`\n(${discussionResult[0]}) When ${teamData.name} reaches the bank ${concatNamesIntoList(discussionResult[1])} decide${plur} to go loud, guns blazing. `)
        myPage.push('They crash through the entrance and attack the on site security guards.\n');
        story.push(myPage);
        myPage = [];
        var guardFightData = fightModule.startFight(capes,guardStats,{["savestats"]: true,['compress']:true});
        story = unwrapFightText(guardFightData[1],story);
        savedStats = recoverCapes(capes,guardFightData[2]);
        if (guardFightData[0]){
            // need to add the fight logs to the story
            
            hostageKeeper = getHighestStat(capes,"control","Environment")
            hostages = true;
            if (hostageKeeper.class == "Shaker" || hostageKeeper.class == "Master"){
                myPage.push(`With the guards down the team secures hostages, leaving ${hostageKeeper.name} to contain them with ${hostageKeeper.power.shape}. `);
            }else{
                myPage.push(`With the guards down the team secures hostages, leaving ${hostageKeeper.name} to watch over them. `);
            }
            
        }else{
            //failure
            story.push(myPage);
            return ([false,story]);
        }
        break;
    case('Reserved'):
        if (people > 0){
            // impersonation
            var plur = ""
            if (discussionResult[1].length == 1){
                plur = 's'
            }
            myPage.push(`\n(${discussionResult[0]}) Using the employee's credentials ${concatNamesIntoList(discussionResult[1])} decide${plur} to impersonate their victim to get direct access. `)
            
            var disguiser = getHighestStat(capes,"utility");

            myPage.push(`${disguiser.name} changes into the stolen uniform walks into the bank through the employee entrance. `);
            
            disguise = statCheck(disguiser,Math.ceil(diffiCultyMod*4),"utility");
            if (disguise){
                myPage.push(`They are able to confidently go through security and open a backdoor for the rest of the team without trouble. `)
            }else{
                myPage.push(`An employee doesn't recognize their face and pulls an alarm! The two on-site guards run towards ${disguiser.name} as the rest of their team roll in for backup. `)
            
                story.push(myPage);
                myPage = [];
                var guardFightData = fightModule.startFight(capes,guardStats,{["savestats"]: true,['compress']:true});
                story = unwrapFightText(guardFightData[1],story);
                savedStats = recoverCapes(capes,guardFightData[2]);

                if (guardFightData[0]){
                    // need to add the fight logs to the story
                    myPage.push(`The team races towards the objective, ignoring the fleeing civilians. `);
                }else{
                    //failure
                    return ([false,story]);
                    ;
                }
            }

        }else{
            // normal sneak
            var plur = ""
            if (discussionResult[1].length == 1){
                plur = 's'
            }
            myPage.push(`\n(${discussionResult[0]}) ${concatNamesIntoList(discussionResult[1])} decide${plur} to sneak into the bank late at night. `)
            
            var sneaker = getHighestStat(capes,"technique","Infiltrator");

            myPage.push(`${sneaker.name} stealthily breaks into the bank. `);
            var infilBonus = 1;
            if (powerModule.getSubclass(sneaker)=="Infiltrator"){
                infilBonus = 1.5
            }
            stealth = statCheck(sneaker,Math.ceil(diffiCultyMod*5)-mapping,'technique',infilBonus);
            if (stealth){
                if (mapping>0){
                    var infilDesc = ""
                    if (infilBonus > 1){
                        infilDesc = ` and infiltration abilities`
                    }
                    myPage.push(`With the help of the survey intel${infilDesc} they manage to avoid any cameras or alarms. `)
                   
                }
            }else{
                myPage.push(`As they work their way in they trip an alarm, alerting the late night security guards! `)
            
                story.push(myPage);
                myPage = [];
                var guardFightData = fightModule.startFight(capes,guardStats,{["savestats"]: true,['compress']:true});
                story = unwrapFightText(guardFightData[1],story);
                savedStats = recoverCapes(capes,guardFightData[2]);

                if (guardFightData[0]){
                    // need to add the fight logs to the story
                    myPage.push(`The team races towards the objective. `);
                }else{
                    //failure
                    return ([false,story]);
                    ;
                }
            }
        }

        break;
    default: // dumb blitz option
        initiativeOption ="Blitz"
        if (discussionResult[1].length > 0){
            myPage.push (
                `\n${concatNamesIntoList(discussionResult[1])} are not able to coordinate and blitz into the bank right for the objective. `); 
        }
        else{
            myPage.push (
                `\nNo one takes the initiative so when they show up to the bank they scramble for the objective. `);
        }
        myPage.push('Running into the building, the security guards intercept them!\n');
        story.push(myPage);
        myPage = [];
        var guardFightData = fightModule.startFight(capes,guardStats,{["savestats"]: true,['compress']:true});
        story = unwrapFightText(guardFightData[1],story);
        savedStats = recoverCapes(capes,guardFightData[2]);

        if (guardFightData[0]){
            // need to add the fight logs to the story
            myPage.push(`The team races towards the objective, ignoring the fleeing civilians. `);
        }else{
            //failure
            return ([false,story]);
            ;
        }

} 
// run guard fight



// collect hostages?


story.push(myPage);
myPage = [];

// getting towards objective

var enemyDifficulty = 0;
var wavesCompleted = 0;


function inactiveCapeFilter(cape){
    if (hostageKeeper && hostageKeeper.id == cape.id){
        return false;
    }
    if (savedStats){
        for (let save of savedStats){
            if (save.id == cape.id && save.vitality < 1){
                return false;
            }
        }
    }
    return true;
}
function deadCapeFilter(cape){

    if (savedStats){
        for (let save of savedStats){
            if (save.id == cape.id && save.vitality < 1){
                return false;
            }
        }
    }
    return true;
}


if (hostages){
    myPage.push (
        `${getHighestStat(capes.filter(inactiveCapeFilter),'technique').name} grabs a worker to give directions to where the ${missionObjective.name} is stored. `);
}else if (disguise){
    myPage.push (
        `The team uses the stolen credentials to access and find where the ${missionObjective.name} is stored. `);
}
else if (stealth){
    myPage.push (
        `They find where the ${missionObjective.name} is located without being seen. `);
}
else{
    //console.log(story)
    var searcher = getHighestStat(capes.filter(inactiveCapeFilter),'technique')
    myPage.push (
        `${searcher.name} leads the group through the building. `);
    if (mapping > 0){
        myPage.push (
            `The intel on the building layout assists their search. `); 
    }
    if (statCheck(searcher,Math.ceil(diffiCultyMod*5)-mapping,"technique")){
        if (statCheck(searcher,Math.ceil(diffiCultyMod*6)-mapping,"technique")){
            myPage.push(`They quickly find the ${missionObjective.name}'s location before any reinforcements arrive. `)
            enemyDifficulty = 0;
        }else{
            myPage.push(`They are able to find the ${missionObjective.name} but authorities are incoming. `)
            enemyDifficulty = 1;
        }
    }else{
        myPage.push(`By the time they find the ${missionObjective.name}, heavy reinforcements have shown up. `)
        enemyDifficulty = 2;
    }
}

var opened = false;
var hostageHoldTime = 0;
while (!opened){
    var openCape = getHighestStat(capes.filter(inactiveCapeFilter),missionObjective.goalStat);
    var attemptString
    if (openCape.weapon){
        attemptString = missionObjective.goalFlavor.replace("[USER]",openCape.name).replace("[WEAPONS]",openCape.weapon.toLowerCase())
    }else{
        attemptString = missionObjective.goalFlavor.replace("[USER]",openCape.name).replace("[WEAPONS]",openCape.power.shape.toLowerCase())
    }
    
    if (statCheck(openCape,missionObjective.goalDC,missionObjective.goalStat) || enemyDifficulty > 3){
        attemptString+=missionObjective.goalSuccess;
        opened = true;
    }else{
        attemptString+=missionObjective.goalFail;
    }

    if (!hostages || opened){
        if (hostages && hostageHoldTime > 0){
            if (hostageHoldTime == 1){
                myPage.push(`After ${hostageHoldTime} failure, `+attemptString);
            }else{
                myPage.push(`After ${hostageHoldTime} faiures, `+attemptString);
            }
            myPage.push("Reinforcements have shown up, the hostages were keeping them at bay until now. ");
        }
    }

    if (!opened){
        
        // check if hostages are being kept and if the hostage keeper is still fucking alive
        if (hostages){
            hostageHoldTime++;
            enemyDifficulty++;
        }else if ((disguise || stealth) && statCheck(openCape,Math.ceil(diffiCultyMod*4),'technique')){
            myPage.push("No one notices or hears their attempt. ");
        }
        else{
            var enemies = null;
            stealth = false;
            disguise = false;
            if (enemyTeamData && foughtResponders == "missed"){
                myPage.push(`${enemyTeamData.name} responds to the alarm, intercepting ${teamData.name}!`);
                enemies = enemyCapes;
                foughtResponders = "fought";
            }
            else{
                switch(enemyDifficulty){
                    case(0):
                        myPage.push("No one shows up, yet. ");
                        break;
                    case(1): 
                        myPage.push("Guards rush in! ");
                        enemies = waveModule.getWave(enemyDifficulty);
                        break;
                    case(2): 
                        myPage.push("Police cars arrive at the scene. ");
                        enemies = waveModule.getWave(enemyDifficulty);
                        break;
                    case(3): 
                        myPage.push("A squad of PRT agents rush in. ");
                        enemies = waveModule.getWave(enemyDifficulty);
                        break;
                    case(4): 
                        myPage.push("A team of heros enter the bank. ");
                        enemies = waveModule.getWave(enemyDifficulty);
                        break;
                    default:
                        myPage.push("There's no one left to respond. ");
                        break;
                }
            }
            
            
            story.push(myPage);
            myPage = [];
            
            if (enemies){
                var enemyFightData = fightModule.startFight(capes,enemies,{["loadstats"]: savedStats,["savestats"]: true,['compress']:true});
                story = unwrapFightText(enemyFightData[1],story);
                savedStats = recoverCapes(capes,enemyFightData[2]);
                if (enemyFightData[0] == false){
                    //console.log(story);
                    return([false,story,foughtResponders])
                }else{
                    wavesCompleted = enemyDifficulty;
                }
            }
            enemyDifficulty++;
        }
    }

}

//Escaping
story.push(myPage);
myPage = [];

var escaped = false;
myPage.push(`${teamData.name} grab the ${missionObjective.name} and leaves. `);

while (!escaped && (!stealth && !disguise)){
    var enemies = false;
    if (enemyTeamData && foughtResponders == "missed"){
        myPage.push(`${enemyTeamData.name} responds to the alarm, intercepting ${teamData.name}!`);
        enemies = enemyCapes;
        foughtResponders = "fought";
        escaped = true;
    }else{
        switch(enemyDifficulty){
            case(1): 
                myPage.push("\n__There are guards waiting at the exit. __");
                enemies = waveModule.getWave(enemyDifficulty);
                break;
            case(2): 
                myPage.push("\n__Police cars are barricading the streets. __");
                enemies = waveModule.getWave(enemyDifficulty);
                break;
            case(3): 
                myPage.push("\n__PRT Vans drive into the scene, surrounding the area.__ ");
                enemies = waveModule.getWave(enemyDifficulty);
                break;
            case(4): 
                myPage.push("\n__A team of heros is called in for backup!__ ");
                enemies = waveModule.getWave(enemyDifficulty);
                break;
            default:
                myPage.push("They run into a squad of police after they leave.");
                escaped = true;
                enemies = waveModule.getWave(2);
                break;
        }
    }
    
    story.push(myPage);
    myPage = [];
    //console.log(savedStats);
    //console.log(capes)
    var enemyFightData = fightModule.startFight(capes,enemies,{["loadstats"]: savedStats,["savestats"]: true,['compress']:true});
    story = unwrapFightText(enemyFightData[1],story);
    savedStats = recoverCapes(capes,enemyFightData[2]);
    if (enemyFightData[0] == false){
        //console.log(story);
        return([false,story,foughtResponders])
    }else{
        wavesCompleted = enemyDifficulty;
    }
    for (let save of savedStats){
        if (hostages && save.id == hostageKeeper.id && save.vitality < 1){
            hostages = false;
            myPage.push("The hostages run free with "+hostageKeeper.name+" incapacitated. ")

        }
    }
    enemyDifficulty++;
    if (enemyDifficulty > 4){
        escaped = true;
        myPage.push(`With no responders left remaining, the team cleanly gets away. `);
        break;
    }
    
    var discussionResult = traitsModule.makeChoice(capes.filter(inactiveCapeFilter),['Reckless','Cautious']);

    switch(discussionResult[0]){
    case("Reckless"):

        if (discussionResult[1].length > 1){
            myPage.push(`(${discussionResult[0]}) ${concatNamesIntoList(discussionResult[1])} work out a plan to create a distraction and run! `);
        }
        else{
            myPage.push(`(${discussionResult[0]}) ${concatNamesIntoList(discussionResult[1])} wants to create a distraction and run. `);
        }
        
        var strongman = getHighestStat(capes.filter(inactiveCapeFilter),"strength");
        
        var distractionResult = statCheck(strongman,enemyDifficulty,"strength");
        if (distractionResult){
            myPage.push(`${strongman.name} runs around creating havoc, giving ${teamData.name} the opportunity they need to escape! `);
            escaped = true;
        }else{
            myPage.push(`${strongman.name} runs around creating havoc but they are unable to distract the incoming forces. `);
        }


        break;
    case("Cautious"): // the kidnapping option
        if (discussionResult[1].length > 1){
            myPage.push(`(${discussionResult[0]}) ${concatNamesIntoList(discussionResult[1])} want to take a hostage to cover their escape. `);
        }
        else{
            myPage.push(`(${discussionResult[0]}) ${concatNamesIntoList(discussionResult[1])} wants to take a hostage to cover their escape. `);
        }

        if (hostages){
            myPage.push(`${hostageKeeper.name} secures a victim and drags them away in an escape! `)
        }else{ 
            hostageKeeper = getHighestStat(capes.filter(inactiveCapeFilter),"control");
            if (statCheck(hostageKeeper,"control",Math.ceil(diffiCultyMod*5)-people)){
                if (people >0 ){
                    myPage.push(`${scouter.name}'s intel helps ${hostageKeeper.name} nap a victim and drags them away in an escape! `)
                }else{
                    myPage.push(`${hostageKeeper.name} snags a body and hurries away in an escape! `)
                    
                }
                escaped = true;
            }else{
                myPage.push(`But they can not secure a hostage in time. `)
            }
        }
        break;
    default: // dumb blitz option
        if (discussionResult[1].length > 0){
            myPage.push(`${concatNamesIntoList(discussionResult[1])} can't work out a plan. `)
        }
        else{
            myPage.push (
                `No one could decide what to do so they continue to fight. `);
        }
         
    }
}
if (stealth){
    myPage.push(`${teamData.name} manage to cleanly sneak away, their operation goes unnoticed until the next morning. `);
}
if (disguise){
    myPage.push(`${teamData.name} safely walk out the front door in disguise with their prize hidden away. `);
}
story.push(myPage);


// on escape if they finish off to level four they just run into some police along the way


// check if hostage keeper is still up


//console.log(story)
return([true,story,foughtResponders])
}


/*
var cape2 = capeModule.genCape(['Thinker']);

var cape1 = capeModule.genCape(['Shaker']);

var cape3 = capeModule.genCape(['Blaster']);

var cape4 = capeModule.genCape(['Changer']);

cape2.technique = 9;
cape2.name = "Thinker"
cape1.technique = 1;
cape1.name = "Shaker"
cape3.name = "Blaster"
cape4.name = "Changer"

cape1.id = 1;
cape2.id = 2;
cape3.id = 3;
cape4.id = 4;
cape1['power'] = {
    ['shape']:"Fire walls",
    ['subclass']: 'Environment'
};

cape2['power'] = {
    ['subclass']: "Surveillance",
    ['shape']:"fists"
};
cape3['power'] = {
    ['subclass']: "Nuker",
    ['shape']:"nukes"
};
cape4['power'] = {
    ['subclass']: "Feast",
    ['shape']:"dragon form"
};

//cape2['item'] = {['name']: "Knife"}
//cape2['weapon'] = "Knife"
module.exports.run({name: "Test Team"},[cape1,cape2,cape3,cape4])*/

