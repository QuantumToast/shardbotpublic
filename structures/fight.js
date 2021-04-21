const {readdirSync, stat} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");

//modules
const capeModule = require(`${filePath}/cape.js`)
const flavorModule = require("../chargen/flavor.js")
const armoryModule = require('../structures/armory');

const powerModule = require('../chargen/powers');
const shakerModule = require('../chargen/classifications/shaker');
const masterModule = require('../chargen/classifications/master');

const { table } = require('console');
const { SSL_OP_NO_TICKET } = require('constants');
const { getPackedSettings } = require('http2');


const statList = [
    "strength",
    "utility",
    "technique",
    "control",
    "vitality"
];
const statAbb = {
    ["strength"]: "👊",
    ["vitality"]: "❤️",
    ["utility"]: "⚡",
    ["control"]: "⌚",
    ["technique"]: "🎯",
};
/*const statAbbOld = { // Abbreviations
    ["strength"]: "STR",
    ["vitality"]: "VIT",
    ["utility"]: "UTL",
    ["control"]: "CTR",
    ["technique"]: "TEQ",


}*/
function adaptChangerPower(cape,stat,info,isAttacking){// fighting should not replace other adaptations
    if (isAttacking && !cape.battlestats.subbonus.adaptedAttack){
        return info;
    }
    if (isAttacking){
        cape.battlestats.subbonus.adaptedAttack=true;
    }
    
    if (cape.battlestats.subbonus.bonusstat != "null"){
        cape.battlestats[cape.battlestats.subbonus.bonusstat] -=cape.battlestats.subbonus.utlbonus;
    }
    if (cape.battlestats.vitality < 0&& cape.battlestats.subbonus.bonusstat == 'vitality'){
        cape.battlestats.vitality = 1;
    }
    var utlMod = 1;
    if (cape.battlestats.minors.includes("Adaption")){
        utlMod=utlMod/2
    }
    cape.battlestats.subbonus.utlbonus = Math.ceil(getStatPowerMod(cape,'utility')*utlMod);
    cape.battlestats[stat] += cape.battlestats.subbonus.utlbonus;
    info = info+ `${cape.name}'s form adapts (+${cape.battlestats.subbonus.utlbonus} ${statAbb[stat]}). `;
    return info;
}

function getStatPowerMod(cape,stat,ignore){//returns the cape's stat after bonuses have been calculated
    // ignore is a string used to specify if a specific type of bonus should be ignored in the stat check

    //finding the set modifiers first, modifiers should prefer the higher stat

    var baseStat = cape.battlestats[stat];

    if (!ignore){
        ignore = "";
    }

    // running sets
    for (let mod of cape.battlestats.statbonus){
        if (mod[0] != ignore && mod[1] == stat && mod[2]=='set' && (!mod[4] || mod[4].battlestats.vitality > 0)) {
            if (mod[3] > baseStat){
                baseStat = mod[3];
            }
        }
    }
    // now doing bonuses
    var stratbonus=0 // strategist and infiltrators should be blocked from stacking
    var infilBonus=0
    for (let mod of cape.battlestats.statbonus){
        if (mod[0] != ignore && mod[1] == stat && mod[2]=='mod' && (!mod[4] || mod[4].battlestats.vitality > 0)) {
            if (mod[0]=="Strategist" && !mod[4].battlestats.powernull){
                if ( mod[3] > stratbonus){
                    baseStat -= stratbonus;
                    stratbonus = mod[3];
                    baseStat += mod[3];       
                }
            }else if (mod[0]=="Infiltrator" && !mod[4].battlestats.powernull){
                if ( mod[3] > infilBonus){
                    baseStat-= infilBonus;
                    infilBonus=mod[3];
                    baseStat += mod[3];       
                }
            } else{
                baseStat += mod[3];       
            }
            //console.log('edited '+stat+' by '+mod[3])
        }
    }

    // adding utility for Anchor Masters (Get Utility to control)
    if (cape.battlestats.subclass.includes("Anchor")&& !cape.battlestats.powernull  && stat == "control"){
        var utlMod = 1;
        if (cape.battlestats.minors.includes("Anchor")){
            utlMod=utlMod/2
        }
        baseStat+=(getStatPowerMod(cape,"utility")*utlMod);
    }

    //slippery gaining their ramping ctr bonus
    if (cape.battlestats.subclass.includes("Slippery")&& !cape.battlestats.powernull && stat == "control"){
        baseStat+=cape.battlestats.subbonus['slipperyctrbonus'];
    }

    // Extrasensory Feat
    if (cape.battlestats.feats['Extrasensory'] && stat=='technique' && cape.battlestats.vitality >= Math.ceil(cape.battlestats.topvitality/2)){
        baseStat+=2
    }

    //Execution feat STR debuff
    if (cape.battlestats.feats['Execution'] && stat=='strength'){
        if (cape.battlestats['executionbonus']){
            baseStat-=cape.battlestats['executionbonus']
        }
    }


    // Ego Feat
    if (cape.battlestats.feats['Ego'] && stat=='strength' && cape.battlestats.vitality >= cape.battlestats.topvitality){
        baseStat+=2
    }

    // Adrenaline Feat
    if (cape.battlestats.feats['Adrenaline'] && stat=='strength' && cape.battlestats.vitality <= Math.ceil(cape.battlestats.topvitality/2)){
        baseStat= Math.ceil(baseStat*1.5)
    }

    // checking for environment trap
    for (let status of cape.battlestats.status){
        if (stat=='control'&&status[0] == "Environment" && status[1].battlestats.vitality > 0 &&  !status[1].battlestats.powernull){
            baseStat = Math.floor(baseStat/2);
        }
    }


    if (baseStat < 1){
        return 1;
    }
    return baseStat;
} 

function statContest(cape, target, stat, secondaryStat,bonus,isAttacking){
    
    //check for stat bonuses
    var challengeStat = cape['battlestats'][stat]
    var targetStat = target['battlestats'][stat]

    var enemyStatName = stat;

    if (secondaryStat){
        enemyStatName=secondaryStat
        targetStat = target['battlestats'][secondaryStat]
    }


    //apply power modifiers
    challengeStat = getStatPowerMod(cape,stat)
    targetStat = getStatPowerMod(target,enemyStatName)
    
    // check Surveilance debuff on either cape
    if (!bonus){
        bonus = 1;
    }

    const surveillance_modifier = .5
    if (isAttacking && isAttacking == "Attack"){
        for (status of cape.battlestats.status){
            if (status[0] == "Surveilance" && status[1].battlestats.vitality > 0 && !status[1].battlestats.powernull){
                bonus = bonus *(1-surveillance_modifier);
            }
        }
        for (status of target.battlestats.status){
            if (status[0] == "Surveilance" && status[1].battlestats.vitality > 0 && !status[1].battlestats.powernull){
                bonus =bonus*(1+surveillance_modifier);
            }
        }
    }
    
    //Lunge feat
    var lungeBonus = 0;
    if (cape.battlestats.feats['Lunge'] && (cape.battlestats.prevtargets.includes(target))){
        lungeBonus=5
    }
    //Isolation
    if (cape.battlestats.feats['Isolation'] && (!target.battlestats.preftargets.includes(cape))){
        lungeBonus-=3;
    }

    if (isAttacking && isAttacking == "Attack" && getStatPowerMod(cape,'control')+lungeBonus < getStatPowerMod(target,'control')){
        targetStat = targetStat+(getStatPowerMod(target,'control') - getStatPowerMod(cape,'control')-lungeBonus);
    }
  

    // Retreat Feat
    if (target.battlestats.feats['Retreat'] && isAttacking && isAttacking == "Attack" && cape.battlestats.preftargets > 0){
        targetStat +=3;
    }

    //Deadeye tech bonus
    if (cape.battlestats.feats['Deadeye'] && isAttacking && isAttacking == "Attack"){
        if (cape.battlestats['deadeyeaimed']){
            bonus+=1;
        }
    }

    //Execution tech bonus
    if (cape.battlestats.feats['Execution'] && isAttacking && isAttacking == "Attack"&& stat=='technique'){
        if (cape.battlestats['executionbonus']){
            challengeStat+=cape.battlestats['executionbonus']
        }
    }


    // Rebound Feat
    if (cape.battlestats.feats['Rebound'] && isAttacking && isAttacking == "Attack"&& stat=='technique'){
        if (cape.battlestats.preftargets.includes(target)){
            challengeStat +=2;
        }
    }

    // Aura Feat
    if (cape.battlestats.feats['Aura'] && isAttacking && isAttacking == "Attack"&& stat=='technique'){
        if (getStatPowerMod(cape,'control')>getStatPowerMod(target,'control')){
            challengeStat +=2;
        }
    }

    if (cape.battlestats.feats['Tracking'] && isAttacking && isAttacking == "Attack" && stat=='technique'){
        if (cape.battlestats.prevtargets.includes(target)){
            challengeStat +=2;
        }
    }

    // Monolithic Feat
    if (cape.battlestats.feats['Monolithic'] && !isAttacking){
        challengeStat+=3
    }
    if (target.battlestats.feats['Monolithic'] && !isAttacking){
        targetStat+=3
    }

    

    // applying debuff mod
    for (let status of cape.battlestats.status){
        if (status[0] == "Debuff" && status[1].battlestats.vitality > 0 && status[2] > 0){
            status[2]--;
            bonus = bonus * .5;
        }
    }
    for (let status of target.battlestats.status){
        if (status[0] == "Debuff" && status[1].battlestats.vitality > 0 && status[2] > 0){
            status[2]--;
            bonus = bonus * 2;
        }
    }
    
    
    //apply bonus
    challengeStat = Math.ceil(challengeStat*bonus)

    

    //make sure no instawin
    if (challengeStat < 0){
        challengeStat = 1;
    }
    if (targetStat < 0){
        targetStat = 1;
    }

    const measure = challengeStat+targetStat
    const num = Math.floor(Math.random()*measure+1);

    var result = false;
    if ( num <= challengeStat){
        result = true;
    }
    /*// Master Anchor v1.0: Reroll stat check with UTL
    if (!isAttacking){    //occurs for attacking,defending, and initial init placing
        if (cape.battlestats.subclass == 'Anchor' && result == false){
            //console.log('rerolled for initiator anchor')
            result = statContest(cape,target,"utility",secondaryStat,bonus,"Anchor")
        }
        if (target.battlestats.subclass == 'Anchor' && result == true){
            //console.log('rerolled for responder anchor')
            result = statContest(cape,target,stat,"utility",bonus,"Anchor")
        }
    }*/

    return result;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
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

function assembleInitiative(teamA,teamB,round,modifiers){
    var responderIntMod = 1;
    if (round == 1 && modifiers && modifiers['decree'] && modifiers['decree'] == "CurfewB"){ // operations modify it to curfew a or B to see who to give the bonus too
        responderIntMod = 2; //giving bonus to responders
    }else if (round == 1 && modifiers && modifiers['decree'] && modifiers['decree'] == "CurfewA"){ 
        responderIntMod = .5; // giving bonus to operators
    } 
    //console.log(finalInit);

    if (teamA[0]['battlestats']['team'] != 'A'){
        for(cape of teamA){
            cape['battlestats']['team'] = 'A'
        }
        for (cape of teamB){
            cape['battlestats']['team'] = 'B'
        }
    }

    //initial shuffle
    var totalList = shuffleArray([...teamA, ...teamB])
    
    function sortInit(a,b){
        if (a.battlestats.feats['Twitchy']){
            a.battlestats.control+=10;
        }
        if (b.battlestats.feats['Twitchy']){
            b.battlestats.control+=10;
        }
        var aInt = getStatPowerMod(a,'control');
        var bInt = getStatPowerMod(b,'control');

        if (a.battlestats.feats['Twitchy']){
            a.battlestats.control-=10;
        }
        if (b.battlestats.feats['Twitchy']){
            b.battlestats.control-=10;
        }

        if (a.battlestats.team=='B'){
            aInt *= responderIntMod
        }
        if (b.battlestats.team=='B'){
            bInt *= responderIntMod
        }
        return(
             bInt-aInt
        );
    }
    
    var finalInit = totalList.sort(sortInit);

    //finalInit.splice(4,4)
    
    //console.log("list: "+finalInit.length)
    //console.log("usurping initiative");
    
    /*console.log('final initiative')
    for (cape of finalInit){
        if (cape){
            console.log("team: "+cape.battlestats.team+" - "+cape.name+" - "+cape.battlestats.control)
        }
    }*/
    return finalInit;
}

function checkIfValidTarget(cape,target,ignoreTeams){ //testing targetting for cleaves
    var canTarget = false;
    var ignorables = []
    for (status of cape.battlestats.status){
        if (status[0] == "ArtilleryGhost"){
            ignorables.push(status[1].name)
        }
    }
    


    //checking pref targets, newest to oldest as newest will be closer in initiative
    if (target.battlestats.vitality > 0 && ((ignoreTeams && target.battlestats.team == cape.battlestats.team) || (!ignoreTeams && target.battlestats.team != cape.battlestats.team) )&& ignorables.lastIndexOf(target.name)==-1){
        canTarget = true
    }
    if (cape.battlestats.subbonus['previousblitztargets'] && cape.battlestats.subbonus['previousblitztargets'].includes(target)){ //blitzes cant repeat targets
        return false;
    }

    //Carry-through Feat
    //checking carry through movers, if mover is alive and in pref nothing else is valid
    for (let pref of cape.battlestats.preftargets){
        if (pref.battlestats.feats['Carry-through'] && pref.battlestats.vitality > 0){
            return false;
        }
    }

    return canTarget;   
}

function findTarget(capeList, cape, startIndex, endIndex){
    var target = null;
    var myTeam = cape.battlestats.team;
    var retalitory = false;
    var selfGhosted = false;
    var ignoreTeams = false;

    //checking target removal (Artillery ghosting etc)
    var ignorables = []
    for (let status of cape.battlestats.status){
        if (status[0] == "ArtilleryGhost"){
            ignorables.push(status[1].name)
        }
        if (status[0] == "Swarm"){
            selfGhosted = true;
        }
        if (status[0] == "Strife"){
            ignoreTeams = true;
        }
    }


    //checking pref targets, newest to oldest as newest will be closer in initiative
    for (var i = cape.battlestats.preftargets.length-1; i >=0 ;i--){
        var testCape = cape.battlestats.preftargets[i];
        if (!target && checkIfValidTarget(cape,testCape,ignoreTeams) && ignorables.lastIndexOf(testCape.name)==-1){
            target = testCape
            retalitory = true
        }
    }

    var i = startIndex+1;
    while (target == null && i < capeList.length && i != endIndex){
        if (checkIfValidTarget(cape,capeList[i],ignoreTeams) && ignorables.lastIndexOf(capeList[i].name)==-1 ){
            target = capeList[i];
        }
        i++;
    }
    
    // returning from top of list 
    if (!target && !cape.battlestats.subbonus['blitzing']){
        i = 0;
        while (target == null && i < startIndex && i < endIndex){
            if (((ignoreTeams && capeList[i].battlestats.team == myTeam) || (!ignoreTeams &&  capeList[i].battlestats.team != myTeam)) && capeList[i].battlestats.vitality > 0 && ignorables.lastIndexOf(capeList[i].name)==-1){
                target = capeList[i]
            }
            i++;
        }
    }

    
    if (selfGhosted){
        target = null;
    }
    return ([target,retalitory])
}

function prepSubclasses(cape){
    for (var sub of cape.battlestats.subclass){
        switch(sub){
            case("Regeneration"):
                cape.battlestats.subbonus['maxvit']= cape.battlestats.vitality;
                cape.battlestats.subbonus['injuredOnRound']= false;
                
                break;
            case("Focus"):
                cape.battlestats.subbonus['focusutlbonus'] = 0
                cape.battlestats.subbonus['injuredOnRound'] = false
                break;
            case("Slippery"):
                cape.battlestats.subbonus['slipperyctrbonus'] = 0;
                cape.battlestats.subbonus['slipperystreak'] = false       
                break;
            case("Blitz"):
                cape.battlestats.subbonus['blitzing']= false;
                cape.battlestats.subbonus['previousblitztargets'] = []
                break;
            case("Cycle"):
                cape.battlestats.subbonus['utlbonus']= 0
                cape.battlestats.subbonus['currenttick']= 0
                cape.battlestats.subbonus['maxvit']= cape.battlestats.vitality
                
                break;
            case("Ambush"):
                cape.battlestats.subbonus['hasAttacked']= false
                break;
            case("Flurry"):
                cape.battlestats.subbonus['active']= false
                break;
            case("Adaption"):
                cape.battlestats.subbonus['utlbonus']= 0;
                cape.battlestats.subbonus['bonusstat']= "null";
                cape.battlestats.subclass['adaptedAttack']=false;

                break;
            case("Feast"):
    
                cape.battlestats.subbonus['LastDowned']= 0
                cape.battlestats.subbonus['strength']= 0
                cape.battlestats.subbonus['vitality']= 0
                cape.battlestats.subbonus['technique']= 0
                cape.battlestats.subbonus['control']= 0
                
                break;
            case("Siege"):
                cape.battlestats.subbonus['SiegeShell']= 0;
                //cape.battlestats.subbonus['SiegeSummon']= false;
                break;
            case("Grant"):
    
                cape.battlestats.subbonus = {
                    ['CurrentTarget']: null,
                }
                break;
        }
    }
}

function readyCape(cape,modifiers){ //giving cape battle stats and checking item
    var preLoadedStats = false;
    //console.log(cape)
    if (modifiers && modifiers['loadstats'] != null){

        for (let oldStats of modifiers['loadstats'] ){
            if (oldStats['id'] == cape['id']){
                preLoadedStats = true;
                cape['battlestats'] = {
                    ["strength"]: oldStats.strength,
                    ["vitality"]: oldStats.vitality,
                    ["utility"]: oldStats.utility,
                    ["control"]: oldStats.control,
                    ["technique"]: oldStats.technique,
                    ['topvitality']: oldStats.topvitality
                }
            }
        }
        if (!preLoadedStats){
            cape['battlestats'] = {
                ["strength"]: cape.strength,
                ["vitality"]: cape.vitality,
                ["utility"]: cape.utility,
                ["control"]: cape.control,
                ["technique"]: cape.technique
            }
        }
        
    }else{
        cape['battlestats'] = {
            ["strength"]: cape.strength,
            ["vitality"]: cape.vitality,
            ["utility"]: cape.utility,
            ["control"]: cape.control,
            ["technique"]: cape.technique,
        }
    }
    cape.battlestats['subclass'] = [powerModule.getSubclass(cape)]; // string subclass name
    cape.battlestats['subbonus'] = {}; //internal sub class calculations
    cape.battlestats['status'] = []; //collection of status effects [name, owner, duration, uses]
    cape.battlestats['statbonus'] = [];

    cape.battlestats['preftargets'] = []; //target preference (who has attack them in that round)
    cape.battlestats['prevtargets'] = []; //previous targets of their attacks

    cape.battlestats['powernull'] = false;
    if (!preLoadedStats || (!modifiers || !modifiers['loadstats'])){
        armoryModule.calculateStats(cape.battlestats,cape.items);
        cape.battlestats['topvitality'] = cape.battlestats.vitality
    }
    
    cape.battlestats.subbonus = {}

    cape.battlestats.minors = []

    //creating minorpowers,
    if (cape.power && cape.power.minors){
        for (let minorData of cape.power.minors){
            if (minorData[2] != cape.battlestats.subclass[0]){ // if minor is same as primary, minor is ignored
                cape.battlestats[minorData[2].toLowerCase()+"flavor"] = minorData[0];
                cape.battlestats.subclass.push(minorData[2]);
                cape.battlestats.minors.push(minorData[2])
            }
        }
    }

    //adding feats
    cape.battlestats['feats'] = {};
    if (cape.feats){
        for (let feat of cape.feats){
            cape.battlestats['feats'][feat[0]] = feat[1] || true;
        }
    }
    //console.log(cape.battlestats['feats'])

    prepSubclasses(cape)
    
}

function startFight(teamA,teamB,modifiers){

    // Modifier

    rounds = 0;

    // getting items preped


    for (let i= 0; i< teamA.length;i++){
        var cape = teamA[i]
        readyCape(cape,modifiers)
        if (cape.battlestats.feats['Sidekick']&& cape.battlestats.vitality > 0){
            var newMinion = masterModule.getSidekickData(cape);
            readyCape(newMinion)
            teamA.push(newMinion)
        }
    }
    for (let cape of teamB){ // new teams will always be fresh
        readyCape(cape,modifiers)
        if (cape.battlestats.feats['Sidekick']&& cape.battlestats.vitality > 0){
            var newMinion = masterModule.getSidekickData(cape);
            readyCape(newMinion)
            teamB.push(newMinion)
        }
    }

    

    var initiative = assembleInitiative(teamA,teamB)

    var downedCapes_A = 0;
    var downedCapes_B = 0;

    var round = 1;

    var lb = "" //line break
    if (!modifiers || !modifiers["compress"]){
        lb="\n"
    }


    // team based start of combat shit like Strat thinker
    var preFightDeclarations = []//may want to add stuff like mech suits in here as well


    //start of fight shit should go here or above

    // Copy subclass must activate first
    for (let cape of initiative){
        if (cape.battlestats.vitality > 0){
            for (var sub of cape.battlestats.subclass){
                switch(sub){
                    case("Copy"):
                        //run down list till find cape, mark spot, doesnt copy trump powers
                        var mySlot = null;
                        for (let i = 0; i < initiative.length && !mySlot;i++){
                            if (initiative[i].battlestats.team==cape.battlestats.team && cape.id == initiative[i].id){
                                mySlot = i;
                            }
                        }
                        var lowerTargetSlot = null;
                        var higherTargetSlot = null;
                        var mimics = []
                        if (initiative[mySlot+1]){//checking for bottom
                            for (let i = mySlot+1; i < initiative.length && !lowerTargetSlot;i++){
                                if (initiative[i].class != 'Trump' && !initiative[i].minion && initiative[i].class != 'Human' && initiative[i].battlestats.vitality > 0){
                                    lowerTargetSlot = i;
                                }
                            }
                        }
                        if (initiative[mySlot-1]){//checking for higher
                            for (let i = mySlot-1; i >= 0 && !higherTargetSlot;i--){
                                if (initiative[i].class != 'Trump' && !initiative[i].minion&& !initiative[i].minion && initiative[i].class != 'Human' && initiative[i].battlestats.vitality > 0){
                                    higherTargetSlot = i;
                                }
                            }
                        }
                        if (!higherTargetSlot){ //rechecking lower if not a higher one.
                            if (initiative[mySlot+1]){//checking for bottom
                                for (let i = mySlot+1; i < initiative.length && !higherTargetSlot;i++){
                                    if (initiative[i].class != 'Trump' && !initiative[i].minion && i != lowerTargetSlot && initiative[i].class != 'Human' && initiative[i].battlestats.vitality > 0){
                                        higherTargetSlot = i;
                                    }
                                }
                            }
                        }
                        if (!lowerTargetSlot)//rechecking higher capes if cant copy a lower one
                        {
                            if (initiative[mySlot-1]){//checking for higher
                                for (let i = mySlot-1; i >= 0 && !lowerTargetSlot;i--){
                                    if (initiative[i].class != 'Trump' && !initiative[i].minion && i != higherTargetSlot && initiative[i].class != 'Human' && initiative[i].battlestats.vitality > 0){
                                        lowerTargetSlot = i;
                                    }
                                }
                            }
                        }
                        if (initiative[lowerTargetSlot]){
                            mimics.push(initiative[lowerTargetSlot])
                        }
                        if (initiative[higherTargetSlot]){
                            mimics.push(initiative[higherTargetSlot])
                        }
                        if (mimics.length > 0){
                            preFightDeclarations.push(`${cape.name} uses ${concatNamesIntoList(mimics)}'s powers to ${cape.power.description} their ${cape.power.shape}. `.replace('their',cape['pos'] || 'their'))
                            for (let mimic of mimics){// should only copy one subclass
                                if (!cape.battlestats.subclass.includes(mimic.battlestats.subclass[0])){
                                    cape.battlestats.subclass.push(mimic.battlestats.subclass[0])
                                }
                                /*for (let copiedClass of mimic.battlestats.subclass){
                                    if (!cape.battlestats.subclass.includes(copiedClass)){
                                        cape.battlestats.subclass.push(copiedClass)
                                    }
                                }*/
                            }
                        }
                        prepSubclasses(cape)
                        break;
                }
            }
        }
    }

    

    // Priority start of fight (Strategist)
    for (let cape of initiative){
        if (cape.battlestats.vitality > 0){
            for (var sub of cape.battlestats.subclass){
                switch(sub){
                    case("Strategist"):
                        var targetTeam = teamA;
                        if (cape.battlestats.team == "B"){
                            targetTeam = teamB;
                        }
                        var utlMod = 1;
                        if (cape.battlestats.minors.includes("Strategist")){
                            utlMod=utlMod/2
                        }
                        for (let giftedCape of targetTeam){
                            if (giftedCape != cape){
                                giftedCape.battlestats.statbonus.push(["Strategist","utility",'mod',Math.ceil(getStatPowerMod(cape,'utility','Strategist')/2*utlMod),cape]);
                            }
                        }
                        preFightDeclarations.push(`${cape.name} strategic prowess grants their teammates +${Math.ceil(getStatPowerMod(cape,'utility','Strategist')/2*utlMod)} ⚡. `.replace('their',cape['pos'] || 'their'))
                        break;
                }
            }
        }
    }

    // Start of Fight subclasses
    for (let cape of initiative){
        if (cape.battlestats.vitality > 0){
            for (var sub of cape.battlestats.subclass){
                switch(sub){
                    case("Grant"):
                        var targetTeam = teamA;
                        if (cape.battlestats.team == "B"){
                            targetTeam = teamB;
                        }
                        var weakestCape = null
                        var targetStat = cape.power.trumpstats.targetstat
                        for (var targetCape of targetTeam){
                            if (targetCape != cape){
                                if (!weakestCape || getStatPowerMod(targetCape,targetStat) < getStatPowerMod(weakestCape,targetStat)){
                                    weakestCape = targetCape;
                                }
                            }
                        }
                        if (weakestCape){
                            // Boost Feat
                            var boostText = "";
                            if (cape.battlestats.feats['Boost']){
                                weakestCape.battlestats.statbonus.push(["Boost","utility",'mod',1,cape]);
                                boostText = ` (+1 ${statAbb['utility']})`
                            }
                            if (getStatPowerMod(weakestCape,targetStat) < getStatPowerMod(cape,'utility')){
                                preFightDeclarations.push(`${cape.name}'s ${cape.power.description} grants ${weakestCape.name} ${Math.ceil(getStatPowerMod(cape,'utility'))} ${statAbb[targetStat]}${boostText}. `);
                            
                                if (targetStat == 'vitality'){
                                    weakestCape.battlestats.vitality = Math.ceil(getStatPowerMod(cape,'utility'))
                                }else{
                                    weakestCape.battlestats.statbonus.push(["Grant",targetStat,'set', Math.ceil(getStatPowerMod(cape,'utility')),cape]);
                                }
                            }else{
                                preFightDeclarations.push(`${cape.name}'s ${cape.power.description} grants ${weakestCape.name} the ${cape.power.trumpstats.subclass} subclass${boostText}. `);
                            }
                            
                            
                            weakestCape.battlestats.subclass.push(cape.power.trumpstats.subclass);
                            switch(cape.power.trumpstats.subclass){
                                case("Environment"):
                                    weakestCape.battlestats['environmentflavor'] = cape.power.trumpstats.flavor;
                                    break;
                                case("Siege"):
                                    weakestCape.battlestats['siegeflavor'] = cape.power.trumpstats.flavor;
                                    break;
                            }

                            //adding subclass tracker
                            cape.battlestats.status.push(["Granting",weakestCape]);
                            
                            

                            prepSubclasses(weakestCape)
                            //console.log(weakestCape)
                        }
                        else if (getStatPowerMod(cape,targetStat) < getStatPowerMod(cape,'utility')){
                            // Boost Feat
                            var boostText = "";
                            if (cape.battlestats.feats['Boost']){
                                cape.battlestats.statbonus.push(["Boost","utility",'mod',1,cape]);
                                boostText = ` (+1 ${statAbb['utility']})`
                            }
                            preFightDeclarations.push(`${cape.name}'s ${cape.power.description} grants themself ${Math.ceil(getStatPowerMod(cape,'utility'))} ${statAbb[targetStat]}${boostText}. `);
                            if (targetStat == 'vitality'){
                                cape.battlestats.vitality = Math.ceil(getStatPowerMod(cape,'utility'))
                            }else{
                                cape.battlestats.statbonus.push(["Grant",targetStat,'set',Math.ceil(getStatPowerMod(cape,'utility')),cape]);
                            }
                            cape.battlestats.subclass.push(cape.power.trumpstats.subclass);
                            switch(cape.power.trumpstats.subclass){
                                case("Environment"):
                                    cape.battlestats['environmentflavor'] = cape.power.trumpstats.flavor;
                                    break;
                                case("Siege"):
                                    cape.battlestats['siegeflavor'] = cape.power.trumpstats.flavor;
                                    break;

                            }

                            prepSubclasses(cape)
                        }
                        break;
                }
            }

            // Extrasensory Feat
            if (cape.battlestats.feats['Extrasensory']){
                preFightDeclarations.push(`${cape.name}'s minions enhance their senses. `);
            }

        }
        else{
            preFightDeclarations.push(`${cape.name} is down. `)
            downedCapes_A++;
        }
    }
    if (modifiers && modifiers["decree"] && modifiers['decree'] == "Curfew"){
        preFightDeclarations.push(`Due to the curfew in place, the responders get a bonus to initiative. `);
    }
    var story = [];
    if (preFightDeclarations.length > 0){
        preFightDeclarations.push("\n");
        story.push(preFightDeclarations);
    }

    var roundLimit = 25;

    if (teamA.length+teamB.length > 6){
        roundLimit = (teamA.length+teamB.length)*5
    }
    
    while (downedCapes_A < teamA.length && downedCapes_B < teamB.length && round <= roundLimit){
        //start of round shit
        var infoPack = ["\n**Round "+round+"**\n"];
        var preroundDeclare = []

        // initial(heh)  initiative calc
        initiative = assembleInitiative(teamA,teamB,round,modifiers)

        //priority subclasses
        for (let capeIndex = 0; capeIndex < initiative.length; capeIndex++){
            var cape = initiative[capeIndex];
            if (cape.battlestats.vitality > 0 && !cape.battlestats.powernull){
                var ignoreTeams = false;
                for (let status of cape.battlestats.status){
                    if (status[0] == "Strife"){
                        ignoreTeams = true;
                    }
                }

                for (var sub of cape.battlestats.subclass){
                    switch(sub){
                        case ("Deny"): //Trump Deny: SoR, find a target UTL vs UTL to disable subclass for a round
                            var successfullyTraped = [];
                            var targetTeam = teamA;
                            if (cape.battlestats.team == "A"){
                                targetTeam = teamB;
                            }
                            var denyTarget=findTarget(initiative,cape,capeIndex,capeIndex)[0]

                            const statBaseline = {
                                ['strength']: 3,
                                ['vitality']: 5,
                                ['utility']: 2,
                                ['control']: 2,
                                ['technique']: 3,
                            }
                            if (denyTarget){
                                denyTarget.battlestats.powernull = statContest(cape,denyTarget,'utility');
                                if (denyTarget.battlestats.powernull){
                                    // Drain Feat
                                    let drainTxt= ''
                                    if (cape.battlestats.feats['Drain']){
                                        drainTxt+=` to feed their own (+1 ${statAbb['utility']})`
                                        cape.battlestats.utility+=1;
                                    }
                                    let enfeedbleText = ''
                                    if (cape.battlestats.feats['Enfeeblement']){
                                        var deadStat = cape.battlestats.feats['Enfeeblement']
                                        enfeedbleText+=`(=1 ${statAbb[deadStat]})`
                                        denyTarget.battlestats['deadStat'] =1;
                                    }

                                    preroundDeclare.push(`${cape.name} ${cape.power.description.toLowerCase()} ${denyTarget.name}'s power${enfeedbleText}${drainTxt}. `);

                                    for (let i = 0; i<4; i++){
                                        var debuffedStat = statList[i]
                                        if (denyTarget.battlestats[debuffedStat] > statBaseline[debuffedStat]){
                                            denyTarget.battlestats.statbonus.push(["Deny",debuffedStat,'set',statBaseline[debuffedStat],cape,1]);
                                        }
                                    }
                                }
                                
                            }

                            break;
                    }
                }

                // Prototype Feat
                if (cape.battlestats.feats['Prototype'] && round==1){
                    preroundDeclare.push(`${cape.name} experiment's with their tech (+3 ${statAbb['utility']}). `)
                    cape.battlestats.statbonus.push(["Prototype","utility",'mod',3,cape,1]);
                }else if (cape.battlestats.feats['Prototype'] && round==2){
                    preroundDeclare.push(info += `${cape.name}'s tech malfunctions (-1 ${statAbb['utility']}). `)
                    cape.battlestats.statbonus.push(["Prototype","utility",'mod',-1,cape]);
                }
            }
        }
        //subclasses
        for (var cape of initiative){
            if (cape.battlestats.vitality > 0 && !cape.battlestats.powernull){

                //Improvisation Feat
                if (cape.battlestats.feats['Improvisation'] && round%2==0){
                    preroundDeclare.push(`${cape.name} improvises (+1 ${statAbb['utility']}). `);
                    cape.battlestats.statbonus.push(["Improvisation","utility",'mod',1,cape]);
                }

                for (var sub of cape.battlestats.subclass){
                    switch(sub){
            
                    case("Artillery"): // BLASTER ARTILLERY: UTL vs CTR against each enemy, on success that enemy can not target them
                        //console.log('testing artillery')
                        var enemyTeam = teamA;
                        if (cape.battlestats.team == 'A'){
                            enemyTeam = teamB;
                        }
                        var ghostedEnemies = []
                        for (let enemyCape of enemyTeam){
                            var utlMod = 1;
                            if (cape.battlestats.minors.includes("Nuker")){
                                utlMod=utlMod/2
                            }
                            var coverResult = statContest(cape,enemyCape,'utility','control',utlMod)
                            //console.log(coverResult)
                            if (enemyCape.battlestats.vitality > 0 && coverResult){
                                //console.log(cape.name+" takes cover from: "+enemyCape.name)
                                ghostedEnemies.push(enemyCape)
                                //add ghost marker
                                enemyCape.battlestats.status.push(["ArtilleryGhost",cape,1])
                            
                            }else{
                                //console.log(cape.name+" failed to find cover from: "+enemyCape.name)
                            }
                        }
                        var ghoststring = concatNamesIntoList(ghostedEnemies);
                        if (ghostedEnemies.length > 0){
                            preroundDeclare.push(`${cape.name} takes cover from ${ghoststring}. `)
                            //console.log('artillery against: '+ghoststring)
                            // running adaption
                            for (ghostedCape of ghostedEnemies){
                                if (ghostedCape.battlestats.subclass.includes('Adaption') && !ghostedCape.battlestats.powernull){
                                    preroundDeclare.push(adaptChangerPower(ghostedCape,'control', ""));   
                                }
                            }
                        }
                        break;
                    case("Focus"): // Breaker Focus: UTL adds boost to all stats if they were not hit since the previous round. Can use same taggage as the regeneration, if they weren't hit in the EoR removal process, it adds the temp bonuses for 1 round. To be then removed
                        //console.log('testing artillery')
                            if (round != 1 && cape.battlestats.subbonus.injuredOnRound == false){
                                var utlBonus = getStatPowerMod(cape,'utility');
                                if (cape.battlestats.minors.includes("Focus")){
                                    utlBonus=Math.ceil(utlBonus/2)
                                }

                                preroundDeclare.push( `${cape.name}'s ${cape.battlestats.focusflavor || cape.power.shape} powers up for a round (+${utlBonus} 👊 / +${Math.ceil((utlBonus)/2)} 🎯). `);
                                cape.battlestats.statbonus.push(["Focus","strength",'mod',utlBonus,cape,1]);
                                cape.battlestats.statbonus.push(["Focus","technique",'mod',Math.ceil(utlBonus)/2,cape,1])

                            }else if (round != 1){
                                //preroundDeclare = preroundDeclare+ `${cape.name}'s ${cape.power.shape} breaker state loses focus.`
                            }
                            cape.battlestats.subbonus.injuredOnRound = false;
                        
                        break;
                    case("Cycle")://Floating Stat bonus to STR > VIT > TEQ every round then repeating based on 1/2 UTL?
                        //console.log(`${cape.name}-${cape.battlestats.powernull}`)
                        //should not take away vitality if they will go down from it
                        var utlBonus = getStatPowerMod(cape,'utility');
                        if (cape.battlestats.minors.includes("Cycle")){
                            utlBonus=Math.ceil(utlBonus/2)
                        }else{
                            utlBonus = Math.ceil(utlBonus*3/4);
                        }
                        
                        switch(cape.battlestats.subbonus.currenttick){

                            case(0)://boast STR
                                if (cape.class != 'Tinker'){
                                    preroundDeclare.push(`${cape.name}'s ${cape.battlestats.cycleflavor || cape.power.shape} shifts (+${utlBonus} 👊 / -🎯). `);
                                }else{
                                    preroundDeclare.push(`${cape.name}'s tech reconfigures (+${utlBonus} 👊 / -🎯). `);
                                }
                                cape.battlestats.statbonus.push(["Cycle","strength",'mod',utlBonus,cape,1]);

                                cape.battlestats.subbonus.currenttick = 1;
                                break;
                            case(1): // Boaost VIT
                                if (cape.class != 'Tinker'){                
                                    preroundDeclare.push(`${cape.name}'s ${cape.battlestats.cycleflavor || cape.power.shape} shifts (+${utlBonus} ❤️ / -👊). `);
                                }else{
                                    preroundDeclare.push(`${cape.name}'s tech reconfigures (+${utlBonus} ❤️ / -👊). `);
                                }
                                
                                cape.battlestats.subbonus.currenttick = 2;
                                cape.battlestats.subbonus.utlbonus = utlBonus;
                                cape.battlestats.vitality += utlBonus;
                                break;
                            case(2): // Boost TEQ
                                if (cape.class != 'Tinker'){
                                    preroundDeclare.push(`${cape.name}'s ${cape.battlestats.cycleflavor || cape.power.shape} shifts (+${utlBonus} 🎯)`);
                                }else{
                                    preroundDeclare.push(`${cape.name}'s tech reconfigures (+${utlBonus} 🎯)`);
                                }

                                if (cape.battlestats.vitality - cape.battlestats.subbonus.utlbonus>0){
                                    cape.battlestats.vitality -= cape.battlestats.subbonus.utlbonus;
                                    preroundDeclare.push( ` (-${cape.battlestats.subbonus.utlbonus} ❤️). `);
                                }else{
                                    preroundDeclare.push(". ");
                                }
                                cape.battlestats.statbonus.push(["Cycle","technique",'mod',utlBonus,cape,1]);
                                cape.battlestats.subbonus.currenttick = 0;
                                break;
                        }
                        break;
                    case ("Infiltrator"): // Mover Infiltrator: gives allies bonuses to CTR with mover's UTL (1/2)
                        var utlBonus = getStatPowerMod(cape,"utility");
                        if (cape.battlestats.minors.includes("Infiltrator")){
                            utlBonus/=2
                        }
                        utlBonus = Math.ceil(utlBonus/2)
                        var myTeam = teamA;
                        if (cape.battlestats.team == 'B'){
                            myTeam = teamB;
                        }
                        var giftedCapes = 0;
                        for (giftCape of myTeam){
                            if (giftCape != cape && giftCape.battlestats.vitality > 0){
                                giftedCapes++;
                                giftCape.battlestats.statbonus.push(["Infiltrator","control",'mod',utlBonus,cape,1]);
                            }
                        }
                        if (giftedCapes > 0){
                            preroundDeclare.push(`${cape.name} maneuvers their allies granting (+${utlBonus} ⌚). `.replace('their',cape['pos'] || 'their'));
                        }

                        break;
                    case ("Surveillance"): //Thinker Surveillance: UTL vs UTl check against every alive enemy, team gains bonus to attack and defend against them for that round.
                        var successfullySurveiled = [];
                        var targetTeam = teamA;
                        if (cape.battlestats.team == "A"){
                            targetTeam = teamB;
                        }
                        var utlBonus = 1;
                        if (cape.battlestats.minors.includes("Surveillance")){
                            utlBonus/=2
                        }
                        for (targetCape of targetTeam){
                            if (targetCape.battlestats.vitality > 0 && statContest(cape,targetCape,"utility","utility",utlBonus)){
                                successfullySurveiled.push(targetCape);
                                targetCape.battlestats.status.push(["Surveilance",cape,1]);
                            }
                        }
                        if (successfullySurveiled.length > 0){
                            preroundDeclare.push(`${cape.name}'s surveilance gets insight on ${concatNamesIntoList(successfullySurveiled)}. `);
                        }
                        break;
                    case ("Environment"): //Environment Shaker: UTL vs VIT check against every alive enemy, halves their CTR on success, stacking until shaker dies.
                        var successfullyTraped = [];
                        var targetTeam = teamA;
                        if (cape.battlestats.team == "A"){
                            targetTeam = teamB;
                        }
                        var utlMod = 1;
                        if (cape.battlestats.minors.includes("Environment")){
                            utlMod=utlMod/2
                        }
                        for (targetCape of targetTeam){
                            
                            if (statContest(cape,targetCape,"utility","vitality",utlMod) && targetCape.battlestats.vitality > 0){
                                successfullyTraped.push(targetCape);
                                targetCape.battlestats.status.push(["Environment",cape]);
                            }
                        }
                        if (successfullyTraped.length > 0){
                            preroundDeclare.push(`${cape.name}'s ${(cape.battlestats.environmentflavor || cape.power.shape)} trap ${concatNamesIntoList(successfullyTraped)} (${statAbb['control']}/2). `);
                        }
                        break;
                    
                    }
                }

                

                //Positioning Feat
                if (cape.battlestats.feats['Positioning'] && round < 5 && round != 1){
                    preroundDeclare.push(`${cape.name} shifts their positioning (+1 ${statAbb['control']}). `);
                    cape.battlestats.statbonus.push(["Positioning","control",'mod',1,cape]);
                }

            }
        }

        // reshuffling initiative (after control altering effects have proced)
        initiative = assembleInitiative(teamA,teamB,round,modifiers)


        if (preroundDeclare.length > 0){
            for (var txt of preroundDeclare){
                infoPack.push(txt);
            }
            infoPack.push("\n");
        }
        
        var index = 0;

        // looping through character turns
        while (index < initiative.length){
            if (infoPack.length > 1800){
                story.push(infoPack)
                infoPack = []
            }
            //start of turn/attacking
            var cape = initiative[index]
            if (cape.battlestats.vitality > 0){//making sure they are alive

                var targetingData = findTarget(initiative,cape,index,index);
                var targetCape = targetingData[0]

                var additionalTargets = []
                var info = ""

                if (cape.battlestats.subclass.includes( 'Nuker') && !cape.battlestats.powernull) {// Shaker and Blaster Nuker subclass, hits everyone(change to up to 2 other people?) with their UTL stat
                    //console.log('found nuker')
                    for (var i = index+1; i < initiative.length;i++){
                        var tCape = initiative[i]
                        if (additionalTargets.length < 2 && tCape != targetCape && checkIfValidTarget(cape,tCape,ignoreTeams)){
                            additionalTargets.push(tCape);       
                        }
                    }
                    //adding from start
                    if (additionalTargets.length < 2){
                        for (var i = index-1; i >=0 ;i--){
                            var tCape = initiative[i]
                            if (additionalTargets.length < 2 && tCape != targetCape && checkIfValidTarget(cape,tCape,ignoreTeams)){
                                additionalTargets.push(tCape);       
                            }
                        }
                    }
                   // console.log('extra targets: '+additionalTargets.length)
                }
                if (cape.battlestats.subclass.includes('Swarm') && !cape.battlestats.powernull){
                    for (var i = index+1; i < initiative.length;i++){
                        var tCape = initiative[i]
                        if (!additionalTargets.includes(tCape) && tCape != targetCape && checkIfValidTarget(cape,tCape,ignoreTeams)){
                            additionalTargets.push(tCape);       
                        }
                    }
                    //adding from start
                    if (additionalTargets.length < 2){
                        for (var i = index-1; i >=0 ;i--){
                            var tCape = initiative[i]
                            if (!additionalTargets.includes(tCape) && tCape != targetCape && checkIfValidTarget(cape,tCape,ignoreTeams)){
                                additionalTargets.push(tCape);       
                            }
                        }
                    }
                }
                

                if (targetCape){//checking trample stun
                    var stunned = false;
                    for (let s of cape.battlestats.status){
                        if (s[0]=='Trample' && s[1] && s[1].vitality > 1){
                            var utlMod = 1;
                            if (s[1].battlestats.minors.includes("Trample")){
                                utlMod=utlMod/2
                            }
                            if (statContest(s[1],cape,"utility","utility",utlMod) || s[1].battlestats.powernull){
                                infoPack.push(`${cape.name} fights off ${s[1].name}'s ${s[1].battlestats.trampleflavor || s[1].power.shape}.\n`)
                                
                            }else{
                                infoPack.push(`${s[1].name}'s ${s[1].battlestats.trampleflavor || s[1].power.shape} knock ${cape.name} around.\n`);
                                stunned = true;
                            }
                        }
                    }
                    if (stunned == true){
                        targetCape = null;
                    }
                }

                if (cape.battlestats.subclass.includes("Siege") && !cape.battlestats.subbonus.SiegeSummon && cape.battlestats.subbonus.SiegeShell < 1 && !cape.battlestats.powernull){
                    var desc = cape.power.description || "";

                    if (desc!=""){
                        desc+=" "
                    }

                    var utlMod = 1;
                    if (cape.battlestats.minors.includes("Siege")){
                        utlMod=utlMod/2
                    }
                    cape.battlestats.subbonus.SiegeShell += Math.ceil(getStatPowerMod(cape,'utility')*utlMod);
                    cape.battlestats.subbonus.SiegeSummon= true;

                    var targetTeam = teamA;
                    if (cape.battlestats.team == "B"){
                        targetTeam = teamB;
                    }
                    for (let shieldedCape of targetTeam){
                        shieldedCape.battlestats.status.push(["Siege",cape]);
                    }
                    if (targetTeam.length > 1){
                        info += `${cape.name} protects their team with ${cape.battlestats.siegeflavor || (desc + cape.power.shape)} (+${cape.battlestats.subbonus.SiegeShell} 💙). `.replace('their',cape['pos'] || 'their');
                    }else{
                        info += `${cape.name} guards themself with ${cape.battlestats.siegeflavor || (desc + cape.power.shape)} (+${cape.battlestats.subbonus.SiegeShell} 💙). `.replace('themself',(cape['sub'] || 'them')+"self");
                    }
                }


                
                if (cape.battlestats.feats['Overload'] && round==1){
                    info += `${cape.name}'s tech overloads (+3 ${statAbb['strength']}). \n`;
                    cape.battlestats.statbonus.push(["Overload","strength",'mod',3,cape]);
                }

                if (cape.battlestats.feats['Deadeye'] && targetCape){
                    if (!cape.battlestats['deadeyeaimed']){
                        cape.battlestats['deadeyeaimed']= true;
                        info+=`${cape.name} takes aim. `;
                        targetCape= null;
                    }else{
                        cape.battlestats['deadeyeaimed']= false;
                        cape.battlestats.statbonus.push(["Deadeye",'strength','mod',getStatPowerMod(cape,'strength'),cape,1]);
                    }
                }

                //bodyguard feat
                if (targetCape && targetCape.battlestats.feats['Bodyguard']){
                    for (let stat of targetCape.battlestats.status){
                        if (stat[0]=='Granting' && stat[1].vitality > 0){
                            targetCape==stat[1];
                        }
                    }
                }
                if (targetCape){//if they can even target anyone
                    
                    // Counter Feat
                    if (cape.battlestats.feats['Counter']){
                        if (cape.battlestats.feats['Counter']==targetCape.class){
                            info += `${cape.name}'s power counter's ${targetCape.name} (+2 ${statAbb['utility']})\n `
                            cape.battlestats.utility+=2;
                            cape.battlestats['countering']= true;
                        }else{
                            if (cape.battlestats['countering']){
                                cape.battlestats.utility-=2;
                                cape.battlestats['countering']= false;
                            }
                        }
                    }

                    //Execution Feat
                    if (cape.battlestats.feats['Execution']){
                        if (getStatPowerMod(cape,'strength') > targetCape.battlestats.vitality){
                            var diff = getStatPowerMod(cape,'strength')-targetCape.battlestats.vitality;
                            cape.battlestats['executionbonus']= diff;
                        }else{
                            cape.battlestats['executionbonus']=null;
                        }
                    }

                    // Unexpected Feat
                    if (cape.battlestats.feats['Unexpected'] && round == 1){
                        info += ` ${cape.name}'s transformation takes ${targetCape.name} by suprise!\n `
                        cape.battlestats.statbonus.push(["Unexpected","technique",'mod',2,cape,1]);
                    }

                    // On attacking/being attacked triggers go here                    
                    
                    //on attacking
                    var adaptionInfo = [] // [cape, string]
                    
                    //for cleaving others
                    //var extraHits = [] //list of string names? to see who got hit. First is included for sake of flavor module detection but not worked on here
                    var targettingResults = []
                    var totalTargets  = [targetCape, ...additionalTargets]

                    //ambush buffing
                    var ambushBonus = 0;
                    if (cape.battlestats.subclass.includes('Ambush') && cape.battlestats.subbonus.hasAttacked == false && !cape.battlestats.powernull){
                        
                        ambushBonus = getStatPowerMod(cape,'utility')
                        if (cape.battlestats.minors.includes("Ambush")){
                            ambushBonus = Math.ceil(ambushBonus/2)
                        }
                        cape.battlestats.technique += ambushBonus;
                        cape.battlestats.strength += ambushBonus;
                    }

                    //Striker Debuff
                    if (cape.battlestats.subclass.includes('Debuff') && !cape.battlestats.powernull){
                        var utlMod = 1;
                        if (cape.battlestats.minors.includes("Debuff")){
                            utlMod= utlMod/2
                        }
                        if (statContest(cape,targetCape,"utility","technique",utlMod)){
                            info += ` ${cape.name}'s ${cape.battlestats.debuffflavor || cape.power.shape} weaken ${targetCape.name}. `
                            targetCape.battlestats.status.push(["Debuff",cape,3,2])
                            if (targetCape.battlestats.subclass.includes('Adaption') && !targetCape.battlestats.powernull){
                                var adaptInfo = [targetCape,adaptChangerPower(targetCape,'technique', "")]
                                adaptionInfo.push(adaptInfo)
                            }
                        }
                    }

                    //striker flurry check
                    
                    for (var i = 0; i < totalTargets.length; i++ ){

                        var doTheyHit = false;
                        var loopedCape = totalTargets[i]

                        var combatThinkerBonus = null;
                        
                        
                        

                        var extraTag = ""
                        if (i != 0 && cape.battlestats.subclass.includes('Nuker') && !cape.battlestats.subclass.includes('Swarm')){//nukers should attack with utility
                            //console.log('running cleave attack')]
                            if (cape.battlestats.minors.includes("Nuker")){
                                combatThinkerBonus=.5
                            }
                            doTheyHit = statContest(cape,loopedCape,'utility','technique',combatThinkerBonus,"Attack")
                            //console.log('secondary attack: '+doTheyHit)
                            // running adaption
                            if (doTheyHit && loopedCape.battlestats.subclass.includes('Adaption') && !loopedCape.battlestats.powernull ){
                                var adaptInfo = [loopedCape,adaptChangerPower(loopedCape,'technique', "Attack")]
                                adaptionInfo.push(adaptInfo)
                                //console.log("adapting ")
                            }
                        }else{

                            if (cape.battlestats.subclass.includes("Blitz")){
                                if (cape.battlestats.minors.includes("Blitz")){
                                    combatThinkerBonus=.5
                                } 
                                doTheyHit = statContest(cape,loopedCape,'utility','technique',combatThinkerBonus,"Attack");
                            }else{
                                doTheyHit = statContest(cape,loopedCape,'technique',null,combatThinkerBonus,"Attack");
                            }
                            
                            // Striker Flurry: On miss, attacks again with UTL for half damage
                            if (!doTheyHit && cape.battlestats.subclass.includes("Flurry" )&& !cape.battlestats.powernull){
                                cape.battlestats.subbonus['active'] = true;
                                var utlMod = 1;
                                if (cape.battlestats.minors.includes("Flurry")){
                                    utlMod=utlMod/2
                                }
                                doTheyHit = statContest(cape,loopedCape,'utility','technique',combatThinkerBonus*utlMod,"Attack");
                            }
                            
                            if (doTheyHit && loopedCape.battlestats.subclass.includes ('Adaption') && !loopedCape.battlestats.powernull){//hits an adaption cape
                                var adaptInfo = [loopedCape,adaptChangerPower(loopedCape,'technique', "")]
                                adaptionInfo.push(adaptInfo)
                            }

                            //console.log('primary attack: '+doTheyHit)
                        }


                        //also check avoidance here if they hit
                        
                        if (loopedCape.battlestats.subclass.includes('Avoidance')  && !loopedCape.battlestats.powernull)
                        {
                            var utlMod = 1;
                            if (loopedCape.battlestats.minors.includes("Avoidance")){
                                utlMod=utlMod/2
                            }
                            if (!statContest(cape,loopedCape,'control','utility',combatThinkerBonus/utlMod)){
                                doTheyHit = false;
                                extraTag = 'Avoidance'
                                if (cape.battlestats.subclass.includes ('Adaption') && !cape.battlestats.powernull){
                                    var adaptInfo = [cape,adaptChangerPower(cape,'control', "")]
                                    adaptionInfo.push(adaptInfo)
                                }
                            }
                        }

                        // checking regeneration styme
                        if (doTheyHit && loopedCape.battlestats.subclass.includes('Regeneration')){
                            //console.log('reduced regeneration')
                            loopedCape.battlestats.subbonus.injuredOnRound = true;
                        }
                        //checking focus
                        if (doTheyHit && loopedCape.battlestats.subclass.includes('Focus')){
                            //console.log('reset Breaker focus')
                            loopedCape.battlestats.subbonus.injuredOnRound = true;
                        }
                        // reseting Slippery
                        if (doTheyHit && loopedCape.battlestats.subclass.includes("Slippery")){
                            loopedCape.battlestats.subbonus['slipperyctrbonus']= 0;
                            //slipperystreak = false;
                        }else if (!loopedCape.battlestats.powernull && loopedCape.battlestats.subclass.includes("Slippery")){
                            var utlMod = 1;
                            if (loopedCape.battlestats.minors.includes("Slippery")){
                                utlMod=utlMod/2
                            }
                            loopedCape.battlestats.subbonus['slipperyctrbonus']+= Math.ceil(getStatPowerMod(loopedCape,'utility')*utlMod);
                            if (loopedCape.battlestats.subbonus['slipperyctrbonus'] > getStatPowerMod(loopedCape,'control')*2){
                                loopedCape.battlestats.subbonus['slipperyctrbonus'] = getStatPowerMod(loopedCape,'control')*2
                            }
                        }
                        

                        if (loopedCape.battlestats.subclass.includes('Mitigation') && !loopedCape.battlestats.powernull){
                            //console.log("Cape has mitigation and:")
                            extraTag = 'Mitigation'
                        }
                        if (loopedCape.battlestats.subclass.includes('Negation')  && !loopedCape.battlestats.powernull){
                            var utlMod = 1;
                            if (loopedCape.battlestats.minors.includes("Negation")){
                                utlMod=utlMod/2
                            }
                            if (statContest(loopedCape,cape,'utility','technique',utlMod)){
                                extraTag = 'Negation'
                                if (cape.battlestats.subclass.includes('Adaption') && !cape.battlestats.powernull){
                                    var adaptInfo = [cape,adaptChangerPower(cape,'technique', "")]
                                    adaptionInfo.push(adaptInfo)
                                   
                                }
                            }
                        }
                        if (!doTheyHit && cape.battlestats.subclass.includes('Adaption') && !cape.battlestats.powernull){//adaption cape misses
                            var adaptInfo = [cape,adaptChangerPower(cape,'technique', "")]
                            adaptionInfo.push(adaptInfo)
                        }
                        
                        // [target, did they get hit, extra details like negation or mitigation or avoidance] change to miss if avoidance procs
                        targettingResults.push([loopedCape,doTheyHit,extraTag])
                    }
                    
                    var result = targettingResults[0][1]
                    // check if the avoidance(stranger) triggered and if so change it to a miss

                    //basic  flavor

                    info = info+flavorModule.flavorAttack(cape,totalTargets,[],targetingData[1],lb)
                    
                    var damage = getStatPowerMod(cape,'strength');
                    if (cape.battlestats.subclass.includes('Swarm')){
                        var tempUtl = getStatPowerMod(cape,"utility")
                        if (cape.battlestats.minors.includes("Swarm")){
                            tempUtl = Math.ceil(tempUtl/2)
                        }
                        damage = Math.ceil((damage+tempUtl)/targettingResults.length)
                    }
                    //ambush debuffing
                    var newturn = false;

                    if (result){
                         //checking if they have bonuses or penalties to str
                        
                        //here we should check for negation or mitigation 
                        var sufferedDamage = damage;

                        //Underdog Feat part 1
                        if (cape.battlestats.feats['Underdog'] && cape.battlestats.vitality < targettingResults[0][0].battlestats.vitality){
                            sufferedDamage+=2
                        }


                        //Assasinate Feat part 1
                        if (cape.battlestats.feats['Assasinate'] && getStatPowerMod(cape,'strength') < getStatPowerMod(targettingResults[0][0],'strength')){
                            sufferedDamage+=3
                        }

                        //Thick Hide Feat part 1
                        if (targettingResults[0][0].battlestats.feats['Thick Hide']){
                            sufferedDamage--;
                        }

                        //Meat Shield Feat part 1
                        if (targettingResults[0][0].battlestats.feats['Meat Shield'] && targettingResults[0][0].battlestats.strength > 1){
                            if (targettingResults[0][0].battlestats.strength==2 || sufferedDamage == 1){
                                targettingResults[0][0].battlestats.strength--;
                                sufferedDamage--;
                            }else{
                                targettingResults[0][0].battlestats.strength-=2
                                sufferedDamage-=2;
                            }
                        }

                        // Overload Feat part 1
                        if (targettingResults[0][0].battlestats.feats['Overload']){
                            sufferedDamage++;
                        }
                        if (sufferedDamage<0){
                            sufferedDamage=0;
                        }

                        var instantKO = false;

                        var shellText = "";
                        var shellReduc = 0;
                        
                        if (cape.battlestats.subclass.includes("Combat" )&& !cape.battlestats.powernull){
                            var utlBonus = 1;
                            if (cape.battlestats.minors.includes("Combat")){
                                utlBonus/=2
                            }
                            if (statContest(cape,targetCape,"utility","technique",utlBonus)){
                                sufferedDamage = Math.ceil(sufferedDamage*2);
                                info += " landing a critical hit"
                                if (targetCape.battlestats.subclass.includes('Adaption') && !targetCape.battlestats.powernull){
                                    var adaptInfo = [targetCape,adaptChangerPower(targetCape,'technique', "")]
                                    adaptionInfo.push(adaptInfo)
                                }
                            }
                        }
                        if (cape.battlestats.subclass.includes("All or Nothing") && !cape.battlestats.powernull){// UTL vs tech to instantly down opponent
                            var utlMod = 1;
                            if (cape.battlestats.minors.includes("All or Nothing")){
                                utlMod=utlMod/2
                            }
                            if (statContest(cape,targetCape,"utility","technique",utlMod)){
                               // console.log('instantly KOed')
                                instantKO = true;
                            }
                        }
                        

                        if (targettingResults[0][2] == 'Mitigation'){
                            //console.log('notcicing that the attack has mitigation and adjusting damage')
                            sufferedDamage = damage-(Math.ceil(Math.random()*getStatPowerMod(targettingResults[0][0],'utility')))
                            if (sufferedDamage< 1){
                                sufferedDamage = 1
                            }
                            if (targettingResults[0][0].battlestats.vitality -sufferedDamage >0 && !instantKO){
                                info+=` but the attack gets mitigated`
                            }
                        }
                        if (targettingResults[0][2] == 'Negation' && !instantKO){
                           // console.log('notcicing that the attack has negation and adjusting damage')
                            sufferedDamage = 0
                            if (targettingResults[0][0].battlestats.vitality -sufferedDamage >0){
                                info+=` but ${targettingResults[0][0].name} negates the blow`
                            }
                        }

                        // calculating shell reduction (from seige)
                        for (let status of targetCape.battlestats.status){
                            if (!instantKO && status[0] == 'Siege' && status[1].vitality > 0){
                                if (sufferedDamage > shellReduc){
                                    if (sufferedDamage-status[1].battlestats.subbonus.SiegeShell-shellReduc < 0){
                                        status[1].battlestats.subbonus.SiegeShell = -1*(sufferedDamage-status[1].battlestats.subbonus.SiegeShell-shellReduc);
                                        shellReduc += sufferedDamage;
                                    }else{
                                        shellReduc +=status[1].battlestats.subbonus.SiegeShell;
                                        status[1].battlestats.subbonus.SiegeShell = 0;
                                    }
                                }
                            }
                        }
                        if (shellReduc > 0){
                            shellText = ` -${shellReduc} 💙` 
                        }

                        if (instantKO == true){
                            info += ` instantly eliminating them! `.replace('their',targetCape['pos'] || 'their');
                            targetCape.battlestats.vitality = 0;
                        }else{
                            targetCape.battlestats.vitality -= (sufferedDamage - shellReduc);
                        }
                        

                        //checking if down
                        if (targetCape.battlestats.vitality < 1){
                            if (!instantKO){
                                if (targettingResults.length>1){
                                    info+=(` knocking ${targetCape.name} out!`);
                                }else{
                                    info+=(` knocking them out!`.replace('them',targetCape['obj'] || 'them'));
                                }
                                info += ` (${shellText}-${sufferedDamage-shellReduc}❤️) `
                            }
                            
                            if (targetCape.battlestats.team == 'A'){
                                downedCapes_A++;
                            }else{
                                downedCapes_B++;
                            }
                        }else{
                            info += ` (${shellText}-${sufferedDamage-shellReduc}❤️)`
                            info+=". ";
                        }
                    }
                    else{
                        // on miss

                        if (targettingResults[0][2] == 'Avoidance'){
                            info+= ` but they could not find their target! `.replace('they',cape['sub'] || 'they').replace('their',cape['pos'] || 'their')
                        }
                        else{
                            info+= " and misses! "
                            if (cape.battlestats.feats['Accuracy'] && targetCape.battlestats.vitality > 1){
                                targetCape.battlestats.vitality-=1;
                                info+=` (-1 ${statAbb['vitality']}) `
                            }

                        }
                    }
                    

                    // resolve damage for additional multiple targets
                    var KOedList = [];
                    var totalShellReduc = 0;
                    if (targettingResults.length>1){
                        var struckTargets = [];
                        var initialAttackFlavor = ""//flavorModule.flavorAttack(cape,totalTargets,[])
                        var secondaryDamage = getStatPowerMod(cape,'strength')
                        if (cape.battlestats.subclass.includes('Swarm')){
                            var tempUtl = getStatPowerMod(cape,"utility")
                            if (cape.battlestats.minors.includes("Swarm")){
                                tempUtl = Math.ceil(tempUtl/2)
                            }
                            secondaryDamage = Math.ceil((secondaryDamage+tempUtl)/targettingResults.length)
                        }
                        
                        var secondaryAtkFlavor = '' //stuff that happens post attack like
                        for (var i = 1; i < targettingResults.length;i++){
                            //stringExtraNames.push(targettingResults[i][0])
                            if (targettingResults[i][1]==true){
                                // mitigation and negation CALCULATIONS (not flavor) here as well!
                                var sufferedDamage = secondaryDamage;

                                
                                // Underdog Feat part 2
                                if (cape.battlestats.feats['Underdog'] && cape.battlestats.vitality < targettingResults[i][0].battlestats.vitality){
                                    sufferedDamage+=2
                                }
                                //Assasinate Feat part 2
                                if (cape.battlestats.feats['Assasinate'] && getStatPowerMod(cape,'strength') < getStatPowerMod(targettingResults[i][0],'strength')){
                                    sufferedDamage+=3
                                }

                                // Thick Hide Feat part 2
                                if (targettingResults[i][0].battlestats.feats['Thick Hide']){
                                    sufferedDamage--;
                                }

                                // Overload Feat part 2
                                if (targettingResults[i][0].battlestats.feats['Overload']){
                                    sufferedDamage++;
                                }

                                //Meat Shield Feat part 2
                                if (targettingResults[i][0].battlestats.feats['Meat Shield'] && targettingResults[i][0].battlestats.strength > 1){
                                    if (targettingResults[i][0].battlestats.strength==2 || sufferedDamage == 1){
                                        targettingResults[i][0].battlestats.strength--;
                                        sufferedDamage--;
                                    }
                                    else{
                                        targettingResults[i][0].battlestats.strength-=2
                                        sufferedDamage-=2;
                                    }
                                }

                                if (sufferedDamage<0){
                                    sufferedDamage = 0;
                                }

                                var shellReduc = 0;
        
                                if (targettingResults[i][2] == 'Mitigation'){
                                    var utlMod = getStatPowerMod(targettingResults[i][0],'utility')
                                    if (cape.battlestats.minors.includes("Mitigation")){
                                        utlMod=Math.ceil(utlMod/2)
                                    }
                                    sufferedDamage = sufferedDamage-(Math.ceil(Math.random()*utlMod))
                                    if (sufferedDamage < 1){
                                        sufferedDamage = 1
                                    }
                                    if (targettingResults[i][0].battlestats.vitality -sufferedDamage >0){
                                        secondaryAtkFlavor+=`${targettingResults[i][0].name} mitigates the blow (-${sufferedDamage}) `
                                    }
                                }
                                if (targettingResults[i][2] == 'Negation'){
                                   // console.log('notcicing that the attack has negation and adjusting damage')
                                    sufferedDamage = 0
                                    secondaryAtkFlavor+=`${targettingResults[i][0].name} negates the blow.`
                                }else{
                                    struckTargets.push(targettingResults[i][0]);
                                }
                                
                                // calculating shell reduction (from siege)
                                for (let status of targettingResults[i][0].battlestats.status){
                                    if (!instantKO && status[0] == 'Siege' && status[1].vitality > 0){
                                        if (sufferedDamage > shellReduc){
                                            if (sufferedDamage-status[1].battlestats.subbonus.SiegeShell-shellReduc < 0){
                                                status[1].battlestats.subbonus.SiegeShell = -1*(sufferedDamage-status[1].battlestats.subbonus.SiegeShell-shellReduc);
                                                shellReduc += sufferedDamage;
                                            }else{
                                                shellReduc +=status[1].battlestats.subbonus.SiegeShell;
                                                status[1].battlestats.subbonus.SiegeShell = 0;
                                            }
                                        }
                                    }
                                }
                                

                                targettingResults[i][0].battlestats.vitality -=(sufferedDamage-shellReduc);
                                totalShellReduc+= shellReduc
                                if (targettingResults[i][0].battlestats.vitality <1){
                                    KOedList.push(targettingResults[i][0]);
                                    if (targettingResults[i][0].battlestats.team == 'A'){
                                        downedCapes_A++;
                                    }else{
                                        downedCapes_B++;
                                    }
                                }
                                //mitigation or negation targets should NOT get added to struck as they are flavored differently

                            }
                        }
                        if (struckTargets.length>0){
                            var shellText = "";;
                            if (totalShellReduc > 0){
                               shellText = ` -${totalShellReduc} 💙` 
                            }
                            initialAttackFlavor+= "Also hits "+concatNamesIntoList(struckTargets)+  ` (${shellText}-${secondaryDamage})`;
                        }
                        

                        // go thru secondary damage to see if anyone was KOed, probably concat into a string eng list?
                        if (KOedList.length>0){
                            initialAttackFlavor += `, knocking out ${concatNamesIntoList(KOedList)}. `
                        }else if (struckTargets.length>0){
                            initialAttackFlavor += `. `
                        }
                        

                        info += initialAttackFlavor;
                        info+= secondaryAtkFlavor;
                    
                    
                    }else if (targetCape.battlestats.vitality < 1){
                        KOedList.push(targetCape)
                    }

                    // ambush debuffing
                    if (cape.battlestats.subclass.includes('Ambush') && cape.battlestats.subbonus.hasAttacked == false){
                        cape.battlestats.technique -= ambushBonus;
                        cape.battlestats.strength -= ambushBonus;
                        cape.battlestats.subbonus.hasAttacked = true;
                    }
                    
                    // Removing Flurry tag
                    if (cape.battlestats.subclass.includes('Flurry') && cape.battlestats.subbonus['active'] == true){
                        cape.battlestats.subbonus['active'] == false;
                    }
                    
                    // Changer Feast subclass, gets their UTL spread across all other stats when they kill
                    if (cape.battlestats.subclass.includes('Feast') && !cape.battlestats.powernull){
                        var newDowns = 0;
                        if (cape.battlestats.team == 'A'){
                            newDowns = downedCapes_B;
                        }else{
                            newDowns = downedCapes_A;
                        }
                        if (newDowns > cape.battlestats.subbonus.LastDowned){
                            info+= `Their ${cape.power.shape} gains strength from the downed ( `
                            var bonusList = {
                                ["strength"]: 0,
                                ["vitality"]: 0,
                                ["control"]: 0,
                                ["technique"]: 0,
                            }
                            var deadCapes = newDowns-cape.battlestats.subbonus.LastDowned;
                            cape.battlestats.subbonus.LastDowned = newDowns;
                            if (targetCape.battlestats.vitality < 1){
                                //deadCapes++;
                            }
                            var tempUtl = getStatPowerMod(cape,"utility")
                            if (cape.battlestats.minors.includes("Feast")){
                                tempUtl = Math.ceil(tempUtl/2)
                            }
                            var tick = 0;
                            for (var i = 0; i < deadCapes; i++){
                                for (var j = 0; j < tempUtl; j++){
                                    tick++;
                                    switch(tick){
                                        case (1):
                                            bonusList.strength++;
                                            break;
                                        case (2):
                                            bonusList.vitality++;
                                            break;
                                        case (3):
                                            bonusList.control++;
                                            break;
                                        case (4):
                                            bonusList.technique++;
                                            tick = 0;
                                    }
                                }
                            }
                            //console.log(bonusList)
                            for (let s of statList){
                                if (bonusList[s] && bonusList[s] > 0){
                                    cape.battlestats[s] += bonusList[s];
                                    info +=`+${bonusList[s]} ${statAbb[s]} `
                                    cape.battlestats.subbonus[s]+=bonusList[s];
                                }
                            }
                            info+="). "
                        }
                    }
                    

                    //Flow Feat
                    if (cape.battlestats.feats['Flow'] && (KOedList.length > 0 || targetCape.battlestats.vitality < 1)){
                        newturn= true;
                    }

                    // go thru targetting results and apply on hit effects and other types of damage


                    //AFTER attacking effects, if avoidance occured this SHOULD NOT trigger
                    for (var sub of cape.battlestats.subclass){
                        switch(sub){
                            case ("Blitz"):
                                if (!result && !cape.battlestats.powernull ){
                                    cape.battlestats.subbonus.blitzing = true;
                                    cape.battlestats.preftargets = [];
                                    cape.battlestats.subbonus.previousblitztargets.push(targetCape)
                                    newturn=true; //relooping their turn
                                }
                                break;
                            case("Suppression")://On miss, reduces target's TEQ by 1/3rd UTL.
                                if (!result && targettingResults[2] != 'Avoidance' && targetCape.battlestats.vitality > 0  && !cape.battlestats.powernull){
                                    
                                    var debuffMod = getStatPowerMod(cape,'utility')
                                    if (cape.battlestats.minors.includes("Suppression")){
                                        debuffMod= Math.ceil(debuffMod/2)
                                    }
                                    if(debuffMod<1){debuffMod = 1;}
                                    info += `Their volley of blasts pins down ${targetCape.name} (-${debuffMod}${statAbb['control']}). `
                                    targetCape.battlestats.statbonus.push(["Suppression",'control','mod',-debuffMod,cape,2])
                                }
                                break;
                            case ("Trample"): //Master Trample. On hit, locks enemy down until they succeed a UTL vs UTL contest on their turns.
                                if (result && targettingResults[2] != 'Avoidance' && targetCape.battlestats.vitality > 0  && !cape.battlestats.powernull){
                                    var trampledStacked = false;
                                    for (let status of targetCape.battlestats.status){
                                        if (status[0]='Trample' && status[1].id == cape.id){
                                            trampledStacked= true
                                        }
                                    }
                                    if (!trampledStacked){
                                        targetCape.battlestats.status.push(["Trample",cape])
                                    }
                                }
                                break;
                        }
                    }

                    // Recoil Feat
                    if (cape.battlestats.feats['Recoil'] && targettingResults[2] != 'Avoidance'){
                        info += `The blast pushes them back (+2 ${statAbb['control']}). `
                        cape.battlestats.statbonus.push(["Recoil","control",'mod',2,cape,1]);
                    }
                    if (cape.battlestats.feats['Challenger'] && targettingResults[2] != 'Avoidance' && cape.battlestats.vitality > 0){
                        var highStat = 'strength';
                        for (let stat of statList){
                            if (getStatPowerMod(targetCape,highStat) < getStatPowerMod(targetCape,stat)){
                                highStat=stat
                            }
                        }
                        info += ` ${cape.name}'s form mimics ${targetCape.name} (+1${statAbb[highStat]}). `
                        cape.battlestats.statbonus.push(["Challenge",highStat,'mod',1,cape]);
                    }

                    //After defending effects
                    for (let i = 0; i<totalTargets.length; i++){
                        var oldTarget = totalTargets[i]
                        //console.log(totalTargets)
                        for (var sub of oldTarget.battlestats.subclass){
                            switch(sub){
                                case("Strife"):// UTL vs UTL to force Strife targeting (attacks random teammate)
                                    if (!oldTarget.battlestats.powernull && oldTarget.battlestats.team != cape.battlestats.team){
                                        var utlMod = 1;
                                        if (oldTarget.battlestats.minors.includes("Strife")){
                                            utlMod=utlMod/2
                                        }
                                        if (statContest(oldTarget,cape,"utility","utility",utlMod)){
                                            info += `${oldTarget.name} confuses ${cape.name}. `
                                            cape.battlestats.status.push(["Strife",oldTarget,2])
                                        }
                                    }
                                    break;
                                case("Slippery"):
                                    if (oldTarget.battlestats.subbonus.slipperyctrbonus > 0){
                                        info += `${oldTarget.name} speeds up (${getStatPowerMod(oldTarget,'control')}${statAbb['control']})! `
                                    }
                            }
                        }

                        // Outplay Feat
                        if (oldTarget.battlestats.feats['Outplay'] && !targettingResults[i][1]){
                            info+= `${oldTarget.name} outplay's ${cape.name} (-2 ${statAbb['control']}). `;
                            cape.battlestats.statbonus.push(["Outplay","control",'mod',-2,oldTarget,2]);
                        }

                        // Menacing Feat
                        if (oldTarget.battlestats.feats['Menacing'] && !targettingResults[i][1]){
                            info+= `${oldTarget.name} intimidates ${cape.name} (-1 ${statAbb['strength']}). `;
                            cape.battlestats.statbonus.push(["Menacing","strength",'mod',-1, oldTarget]);
                        }

                        // Rage Feat
                        if (oldTarget.battlestats.feats['Rage'] && targettingResults[i][1] && oldTarget.battlestats.vitality>0){
                            info+= `The blow enrages ${oldTarget.name} (+2 ${statAbb['strength']}). `;
                            oldTarget.battlestats.statbonus.push(["Rage","strength",'mod',2,oldTarget]);
                        }

                        // Regurgitate Feat
                        if (oldTarget.battlestats.feats['Regurgitate'] && targettingResults[i][1] && oldTarget.battlestats.vitality>0){
                            if (!oldTarget.battlestats['regurgitate'] && oldTarget.battlestats.vitality < Math.ceil(oldTarget.battlestats.topvitality/2)){
                                info+= `${oldTarget.name}'s form discards the damaged parts (+5 ${statAbb['vitality']}). `;
                                oldTarget.battlestats['regurgitate']= true;
                                oldTarget.battlestats.vitality+=5;
    
                            }
                        }

                        // Unstoppable Feat
                        if (oldTarget.battlestats.feats['Unstoppable'] && targettingResults[i][1] && oldTarget.battlestats.vitality>0){
                            info+= `${oldTarget.name}'s state quickly recovers (+2 ${statAbb['vitality']}). `;
                            oldTarget.battlestats.vitality+=2;
                        }

                        // Absorption Feat
                        if (oldTarget.battlestats.feats['Absorption'] && targettingResults[i][1] && oldTarget.battlestats.vitality>0){
                            info+= `${oldTarget.name}'s ${oldTarget.power.shape} absorbs part of the power (+1 ${statAbb['utility']}). `;
                            oldTarget.battlestats.utility+=1;
                        }


                        // Reaper Feat
                        if (cape.battlestats.feats['Reaper'] && oldTarget.battlestats.vitality < 1 && targettingResults[i][1]){
                            if (cape.battlestats.vitality < cape.battlestats.topvitality && cape.battlestats.vitality > 0){
                                info+= `The strike refreshes ${cape.name} (=${cape.battlestats.topvitality}${statAbb['vitality']}). `;
                                cape.battlestats.vitality = cape.battlestats.topvitality;
                            }
                        }

                        // Puppetry Feat
                        if (cape.battlestats.feats['Puppetry'] && oldTarget.battlestats.vitality < 1 && targettingResults[i][1]){
                            info+= `${cape.name} grab's ${oldTarget.name}'s body (+4 ${statAbb['control']}). `;
                            cape.battlestats.control += 4;
                        }

                        // Quick Study Feat
                        if (oldTarget.battlestats.feats['Quick Study'] && oldTarget.battlestats.vitality < 1 && targettingResults[i][1]){
                            info+= `${cape.name}'s ${cape.power.shape} strengthen (+2 ${statAbb['utility']}). `;
                            cape.battlestats.utlity += 2;
                        }

                        // Unstable Feat
                        if (oldTarget.battlestats.feats['Unstable'] && oldTarget.battlestats.vitality < 1 && targettingResults[i][1]){
                            var explodeDmg=3;
                            if (cape.battlestats.vitality<=3){
                                explodeDmg=3-cape.battlestats.vitality-1;
                            }
                            if (explodeDmg>0){
                                info+= `${oldTarget.name}'s ${oldTarget.power.shape} erupts, hurting ${cape.name} (-${explodeDmg} ${statAbb['vitality']}). `;
                                cape.battlestats.vitality -= explodeDmg;    
                            }
                        }

                        // Pin Feat
                        if (cape.battlestats.feats['Pin'] && targettingResults[i][1] && oldTarget.battlestats.vitality > 0){
                            info+= `The attack pins ${oldTarget.name} down (-2 ${statAbb['control']}). `;
                            oldTarget.battlestats.statbonus.push(["Pin","control",'mod',-2,cape]);
                        }

                        // Shackle Feat
                        if (oldTarget.battlestats.feats['Shackle'] && targettingResults[i][1] && oldTarget.battlestats.vitality > 0){
                            info+= `The strike binds ${oldTarget.name} (=1 ${statAbb['control']}). `;
                            oldTarget.battlestats.statbonus.push(["Shackle","control",'set',1,cape,2]);
                        }
                    }

                    // flavor for changers
                   // console.log("adapton logs: "+adaptionInfo.length)
                    if (adaptionInfo.length>0){
                        for (let adapt of adaptionInfo){
                            if (adapt[0].battlestats.vitality > 0){
                                //console.log(adapt)
                                info += adapt[1];
                               // console.log("Flavored adaption: "+adapt[1])
                            }else{

                            //console.log('dead adaption')
                            }
                        }
                    }else{
                       // console.log('no recorded adaption information')
                    }

                    // Removing subclass that a trump cape granted if the trump was KOed
                    if (KOedList.length > 0){
                        for (let victimCapes of KOedList){
                            for (let statusPairs of victimCapes.battlestats.status){ 
                                if (statusPairs[0] == "Granting"){
                                    //console.log('found trump')
                                    if (weakestCape.vitality > 0){
                                        if (weakestCape.battlestats.subclass.indexOf(victimCapes.power.trumpstats.subclass) > 0){ // if it was the zero slot then they were already that subclass and its not required to be removed
                                            weakestCape.battlestats.subclass.splice(weakestCape.battlestats.subclass.indexOf(victimCapes.power.trumpstats.subclass),1);
                                            //console.log('removed subclass')
                                        }
                                    }
                                }
                            } 

                        }
                    }

                    //adding attack history + Soar Feat
                    if (!cape.battlestats.feats['Soar']){
                        targetCape.battlestats.preftargets.push(cape);
                    }

                    // Hostile Environment Feat
                    if (cape.battlestats.feats['Hostile Environment'] && cape.battlestats.vitality>0){
                        var attackedCapes = [];
                        for (let hazardTarget of initiative){
                            if (checkIfValidTarget(cape,hazardTarget) && statContest(cape,hazardTarget,'utility') && hazardTarget.battlestats.vitality > 1){
                                attackedCapes.push(hazardTarget)
                                hazardTarget.battlestats.vitality-=1
                            }
                        }
                        if (attackedCapes.length>0){
                            var singular= ''
                            if (attackedCapes.length == 1){
                                singular='s'
                            }
                            info+= `${cape.name}'s ${cape.power.shape} injure${singular} ${concatNamesIntoList(attackedCapes)} (-1 ${statAbb['vitality']}). `
                        }
                    }

                    // Inert Ground
                    if (cape.battlestats.feats['Inert Ground'] && cape.battlestats.vitality>0){
                        var attackedCapes = [];
                        for (let hazardTarget of initiative){
                            if (hazardTarget.battlestats.vitality >1 && hazardTarget.battlestats.utility>1){
                                attackedCapes.push(hazardTarget)
                                hazardTarget.battlestats.utility-=1
                            }
                        }
                        if (attackedCapes.length>0){
                            var singular= ''
                            if (attackedCapes.length == 1){
                                singular='s'
                            }
                            info+= `${cape.name}'s ${cape.power.shape} disrupt${singular} ${concatNamesIntoList(attackedCapes)} (-1 ${statAbb['utility']}). `
                        }
                    }

                    cape.battlestats.prevtargets.push(targetCape);
                    if (newturn){
                        index--;
                    }

                }
                if (info!=""){
                    infoPack.push(info+lb)
                }
            }
            index++;
        }

        //end of round shit and subclasses
        for (var cape of initiative){
            if (infoPack.length > 1800){
                story.push(infoPack)
                infoPack = []
            }
            if (cape.battlestats.vitality > 0 && !cape.battlestats.powernull){
                //console.log("Checking: "+cape.battlestats.subclass)
                for (var sub of cape.battlestats.subclass){
                    switch(sub){
            
                    case("Regeneration"):
                        //console.log("recognized Regeneration")
                        var healingTotal = 0;
                        if (cape.battlestats.subbonus.injuredOnRound == true && cape.battlestats.subbonus.maxvit > cape.battlestats.vitality){
                            //half healing
                            healingTotal = getStatPowerMod(cape,'utility')/2;
                            if (cape.battlestats.minors.includes("Regeneration")){
                                healingTotal /= 2
                            }
                            healingTotal = Math.ceil(healingTotal)
                            if (healingTotal + cape.battlestats.vitality > cape.battlestats.subbonus.maxvit){
                                healingTotal = cape.battlestats.subbonus.maxvit-cape.battlestats.vitality
                            }
                            infoPack.push(`${cape.name}'s wounds begin to close (+${healingTotal} ❤️). `)
                        }else if (cape.battlestats.subbonus.maxvit > cape.battlestats.vitality) {
                            
                                // full healing
                                var utlMod = 1;
                                if (cape.battlestats.minors.includes("Regeneration")){
                                    utlMod=utlMod/2
                                }
                                healingTotal = Math.ceil(getStatPowerMod(cape,'utility')*utlMod);
                                
                                if (healingTotal +  cape.battlestats.vitality > cape.battlestats.subbonus.maxvit){
                                    healingTotal = cape.battlestats.subbonus.maxvit-cape.battlestats.vitality
                                }
                                infoPack.push(`${cape.name}'s body regenerates (+${healingTotal} ❤️). `)
                            
                        }else{
                            //console.log(`regen error,  ${cape.battlestats.vitality}/${cape.battlestats.subbonus.maxvit}`)
                        }
                        cape.battlestats.subbonus.injuredOnRound = false;
                        cape.battlestats.vitality += healingTotal;
                        break;
                    case("Growth"):
                        var utlBonus = getStatPowerMod(cape,'utility');
                        if (cape.battlestats.minors.includes("Growth")){
                            utlBonus= Math.ceil(utlBonus/2)
                        }
                        utlBonus = Math.floor(Math.random()*utlBonus)+1
                        if (Math.floor(Math.random()*2) == 0){
                            infoPack.push(`${cape.name}'s form grows and strengthens (+${utlBonus} 👊). `)
                            cape.battlestats.strength += utlBonus;
                        }else{
                            infoPack.push(`${cape.name}'s form grows and toughens (+${utlBonus} ❤️).`)
                            cape.battlestats.vitality += utlBonus;
                        }
                }
                }
            }
            // if info is already over 1800 characters, makes a new one. 
            // kind of scuffed but eh
            
        }

        // resolving temp data
        // this miiiight be a data leak idk yet
        for (var cape of initiative){
            cape.battlestats.preftargets = [];
            var newStatus = []
            var newModifiers = []
            for (status of cape.battlestats.status){
                if (status[2]){
                    //console.log('removing: '+status[0])
                    status[2]=status[2]-1;
                }
                if ((!status[2] || status[2] > 0) && status[2] != 0){
                    newStatus.push(status)
                }
            }
            for (mod of cape.battlestats.statbonus){
                if (mod[5]){
                    mod[5] = mod[5]-1;
                }
                if ((!mod[5] || mod[5] > 0) && mod[5] != 0){
                    newModifiers.push(mod)
                }
            }

            if (cape.battlestats.status.length > 0){
               // console.log(`${cape.name} lost ${cape.battlestats.status.length-newStatus.length} effects at EoR`)
            }
            if (cape.battlestats.statbonus.length > 0){
               // console.log(`${cape.name} lost ${cape.battlestats.statbonus.length-newModifiers.length} bonuses at EoR`)
            }
            cape.battlestats.status = newStatus;
            cape.battlestats.statbonus = newModifiers;
            //console.log(cape.name+' status list: '+newStatus.length);
            //console.log('clearing '+cape.name)
            if (cape.battlestats.subclass.includes('Blitz')){
                cape.battlestats.subbonus.blitzing = false;
                cape.battlestats.subbonus.previousblitztargets = []
            }
            cape.battlestats['powernull'] = false;
        }

        //next round
        story.push(infoPack)
        round++;
    }

    //console.log('finished fight')


    function minionFilter(fighter){
        if (fighter.minion){
            return false;
        }
        return true;
    }

    

    //console.log(story);

    // removing battle stats
    var savedStats = []
    if (modifiers && modifiers['savestats']){
        for (let cape of teamA){
            //console.log(`saving ${cape.name}`)
            var oldStat = {
                ['id']: cape.id,
                ['name']: cape.name,
                ['strength']: cape.battlestats.strength,
                ['vitality']: cape.battlestats.vitality,
                ['utility']: cape.battlestats.utility,
                ['control']: cape.battlestats.control,
                ['technique']: cape.battlestats.technique,
                ['topvitality']: cape.battlestats.topvitality,
            }
            if (cape.battlestats.subclass.includes("Feast")){
                oldStat.strength -= Math.floor(cape.battlestats.subbonus.strength/2)
                oldStat.vitality -= Math.floor(cape.battlestats.subbonus.vitality/2)
                oldStat.control -= Math.floor(cape.battlestats.subbonus.control/2)
                oldStat.technique -= Math.floor(cape.battlestats.subbonus.technique/2)
                if (oldStat.vitality < 1){
                    oldStat.vitality = 1;
                }
            }
            savedStats.push(oldStat)
           //console.log(cape.battlestats.vitality)
        }
    }
    for (let cape of initiative){
        cape.battlestats = null;
    }
    

    if (downedCapes_B == teamB.length){
        //console.log("Team A Wins!")
        teamA = teamA.filter(minionFilter);
        teamB= teamB.filter(minionFilter)
        return([true, story,savedStats])
    }else if (downedCapes_A == teamB.length){
        //console.log("Team B Wins!")
        teamA = teamA.filter(minionFilter);
        teamB= teamB.filter(minionFilter)
        return([false, story,savedStats])
    }else{
        teamA = teamA.filter(minionFilter);
        teamB= teamB.filter(minionFilter)
        //console.log("Ran out of Time");
        return([false, story,savedStats])
    }

    //console.log(teamA);
    //console.log(teamB)
    // need to remove battlestats after
}

module.exports.startFight = (teamA, teamB,modifiers)=>{
    return (startFight(teamA,teamB,modifiers))
}


var cape1 = capeModule.genCape(['Master']);
var cape2 = capeModule.genCape(['Blaster']);
cape1['feats'] = [['Menacing']]

cape2['feats'] = [['Recoil']]

console.log(startFight([cape1],[cape2])[1]);



