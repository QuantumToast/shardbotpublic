const powerModule = require('../chargen/powers');


/*
Two types of data, feat dictionary data and feat save data
FeatDictionary:{
    String name
    String info - explanation, may have the [DATA] substring which potential data replaces
    Bool general - If feat is accessible to anyone
    Array keys - Class names that can use feat, also has Melee or Ranged for weaponized classes.
    String element - Element specific 
    Array potentialdata: [] List of potential data that is drawn, be it for feats like Counter 
}

// []

FeatSave (What cape stores):
FeatSave: [Name,data]. Data is for variable 
In the battle stats they get stored as a dictionary, with the data being the value, name being the key
*/


const statAbb = {
    ["strength"]: "👊",
    ["vitality"]: "❤️",
    ["utility"]: "⚡",
    ["control"]: "⌚",
    ["technique"]: "🎯",
};
const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]


//Blaster Feats
const recoil = {
    ['name']: 'Recoil',
    ['info']: "+2 CTR after attacking for the rest of the round.",
    ['general']: false,
    ['keys']: ['Blaster'],
    ['element']: null,
    ['potentialdata']: [],
}
const tracking = {
    ['name']: 'Tracking',
    ['info']: "+2 TEQ against previous targets.",
    ['general']: false,
    ['keys']: ['Blaster'],
    ['element']: null,
    ['potentialdata']: [],
}
const deadeye = {
    ['name']: 'Deadeye',
    ['info']: "Takes a turn to aim before attacking with x2 STR and x2 TEQ.",
    ['general']: false,
    ['keys']: ['Blaster'],
    ['element']: null,
    ['potentialdata']: [],
}
// Brute Feats
const monolithic = {
    ['name']: 'Monolithic',
    ['info']: "Stats count as +3 for non-attack contests.",
    ['general']: false,
    ['keys']: ['Brute'],
    ['element']: null,
    ['potentialdata']: [],
}
const thickhide = {
    ['name']: 'Thick Hide',
    ['info']: "Reduce incoming damage by 1.",
    ['general']: false,
    ['keys']: ['Brute'],
    ['element']: null,
    ['potentialdata']: [],
}
const meatshield = {
    ['name']: 'Meat Shield',
    ['info']: "Converts up to 2 points of damage into STR loss.",
    ['general']: false,
    ['keys']: ['Brute'],
    ['element']: null,
    ['potentialdata']: [],
}

// Shaker Feats
const hostileenvironment = {
    ['name']: 'Hostile Environment',
    ['info']: "Hurts enemy capes for 1 DMG on UTL contest at end of turn.",
    ['general']: false,
    ['keys']: ['Shaker'],
    ['element']: null,
    ['potentialdata']: [],
}
const aura = {
    ['name']: 'Aura',
    ['info']: "+2 TEQ when attacking capes with lower CTR.",
    ['general']: false,
    ['keys']: ['Shaker'],
    ['element']: null,
    ['potentialdata']: [],
}

const intertground = {
    ['name']: 'Inert Ground',
    ['info']: "All capes lose 1 UTL each turn.",
    ['general']: false,
    ['keys']: ['Shaker'],
    ['element']: null,
    ['potentialdata']: [],
}

// Tinker Feats
const prototype = {
    ['name']: 'Prototype',
    ['info']: "+3 UTL first round. -1 UTL afterwards.",
    ['general']: false,
    ['keys']: ['Tinker'],
    ['element']: null,
    ['potentialdata']: []
}
const prepper = {
    ['name']: 'Prepper',
    ['info']: "+1 Item capacity.",
    ['general']: false,
    ['keys']: ['Tinker'],
    ['element']: null,
    ['potentialdata']: []
}
const overload = {
    ['name']: 'Overload',
    ['info']: "+3 STR but takes +1 when hit.",
    ['general']: false,
    ['keys']: ['Tinker'],
    ['element']: null,
    ['potentialdata']: []
}
// Mover Feats
const twitchy = {
    ['name']: 'Twitchy',
    ['info']: "CTR counts as +10 for initiative.",
    ['general']: false,
    ['keys']: ['Mover'],
    ['element']: null,
    ['potentialdata']: [],
}
const soar = {
    ['name']: 'Soar',
    ['info']: "Does not trigger retaliatory attacks.",
    ['general']: false,
    ['keys']: ['Mover'],
    ['element']: null,
    ['potentialdata']: [],
}
const carrythrough = {
    ['name']: 'Carry-through',
    ['info']: "Struck targets can only attack the cape.",
    ['general']: false,
    ['keys']: ['Mover'],
    ['element']: null,
    ['potentialdata']: [],
}

// Thinker Feats
const outplay = {
    ['name']: 'Outplay',
    ['info']: "Successful defenses lower attacker control by 2 through the next round.",
    ['general']: false,
    ['keys']: ['Thinker'],
    ['element']: null,
    ['potentialdata']: [],
}
const flow = {
    ['name']: 'Flow',
    ['info']: "KOing a cape grants another turn.",
    ['general']: false,
    ['keys']: ['Thinker'],
    ['element']: null,
    ['potentialdata']: [],
}
const accuracy = {
    ['name']: 'Accuracy',
    ['info']: "Missed attacks still inflict 1 dmg.",
    ['general']: false,
    ['keys']: ['Thinker'],
    ['element']: null,
    ['potentialdata']: [],
}
// Breaker Feats
const unexpected = {
    ['name']: 'Unexpected',
    ['info']: "+2 TEQ on the first round.",
    ['general']: false,
    ['keys']: ['Breaker'],
    ['element']: null,
    ['potentialdata']: [],
}
const unstoppable = {
    ['name']: 'Unstoppable',
    ['info']: "+2 VIT after being hit.",
    ['general']: false,
    ['keys']: ['Breaker'],
    ['element']: null,
    ['potentialdata']: [],
}
const unstable = {
    ['name']: 'Unstable',
    ['info']: "Explodes on KO, hurting the attacker for up to 3 DMG.",
    ['general']: false,
    ['keys']: ['Breaker'],
    ['element']: null,
    ['potentialdata']: [],
}
// Master Feats
const extrasensory = {
    ['name']: 'Extrasensory',
    ['info']: "+2 TEQ while above half VIT.",
    ['general']: false,
    ['keys']: ['Master'],
    ['element']: null,
    ['potentialdata']: [],
}
const sidekick = {
    ['name']: 'Sidekick',
    ['info']: "Fights with a 2 stat minion combatant.",
    ['general']: false,
    ['keys']: ['Master'],
    ['element']: null,
    ['potentialdata']: [],
}
const puppetry = {
    ['name']: 'Puppetry',
    ['info']: "+4 CTR on KO.",
    ['general']: false,
    ['keys']: ['Master'],
    ['element']: null,
    ['potentialdata']: [],
}
// Striker Feats
const reaper = {
    ['name']: 'Reaper',
    ['info']: "Regenerates base health when KOing a target.",
    ['general']: false,
    ['keys']: ['Striker'],
    ['element']: null,
    ['potentialdata']: [],
}
const execution = {
    ['name']: 'Execution',
    ['info']: "Converts redundant STR into TEQ before attacking.",
    ['general']: false,
    ['keys']: ['Striker'],
    ['element']: null,
    ['potentialdata']: [],
}
const shackle = {
    ['name']: 'Shackle',
    ['info']: "Hits set CTR to 1 up till the next round.",
    ['general']: false,
    ['keys']: ['Striker'],
    ['element']: null,
    ['potentialdata']: [],
}

// Changer Feats
const challenger = {
    ['name']: 'Challenger',
    ['info']: "After attacking, gains +1 of target’s highest stat.",
    ['general']: false,
    ['keys']: ['Changer'],
    ['element']: null,
    ['potentialdata']: [],
}
const rage = {
    ['name']: 'Rage',
    ['info']: "+2 STR when struck by an attack.",
    ['general']: false,
    ['keys']: ['Changer'],
    ['element']: null,
    ['potentialdata']: [],
}
const regurgitate = {
    ['name']: 'Regurgitate',
    ['info']: "+5 VIT first time they drop below half health.",
    ['general']: false,
    ['keys']: ['Changer'],
    ['element']: null,
    ['potentialdata']: [],
}

// Stranger Feats
const retreat = {
    ['name']: 'Retreat',
    ['info']: "+3 TEQ when being attacked more than once a round.",
    ['general']: false,
    ['keys']: ['Stranger'],
    ['element']: null,
    ['potentialdata']: [],
}
const assasinate = {
    ['name']: 'Assasinate',
    ['info']: "+3 DMG against higher STR targets.",
    ['general']: false,
    ['keys']: ['Stranger'],
    ['element']: null,
    ['potentialdata']: [],
}
const isolation = {
    ['name']: 'Isolation',
    ['info']: "+3 CTR when defending against capes they haven’t attacked that round.",
    ['general']: false,
    ['keys']: ['Stranger'],
    ['element']: null,
    ['potentialdata']: [],
}
//
// Trump Feats
//grant
const boost = {
    ['name']: 'Boost',
    ['info']: "Grant target gains +1 UTL.", 
    ['general']: false,
    ['keys']: ['Grant'],
    ['element']: null,
    ['potentialdata']: [],
}
const bodyguard = {
    ['name']: 'Bodyguard',
    ['info']: "Incoming attacks are redirected to the grant target.", 
    ['general']: false,
    ['keys']: ['Grant'],
    ['element']: null,
    ['potentialdata']: [],
}
const drain = {
    ['name']: 'Drain',
    ['info']: "Each deny increases cape's UTL by 1.", 
    ['general']: false,
    ['keys']: ['Deny'],
    ['element']: null,
    ['potentialdata']: [],
}
const enfeeblement = {
    ['name']: 'Enfeeblement',
    ['info']: "Denying sets target's base [DATA] to 1.", 
    ['general']: false,
    ['keys']: ['Deny'],
    ['element']: null,
    ['potentialdata']: ['strength','vitality','utility','control','technique'],
}
const absorbption = {
    ['name']: 'Absorption',
    ['info']: "Being hit grants 1 UTL.", 
    ['general']: false,
    ['keys']: ['Copy'],
    ['element']: null,
    ['potentialdata']: [],
}
const quickstudy = {
    ['name']: 'Quick Study',
    ['info']: "KOing a cape grants 2 UTL.", 
    ['general']: false,
    ['keys']: ['Copy'],
    ['element']: null,
    ['potentialdata']: [],
}
// General Pool
const template = {
    ['name']: 'Template',
    ['info']: "info",
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: [],
}

const improvisation = {
    ['name']: 'Improvisation',
    ['info']: "+1 UTL every other round.",
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: [],
}

const menacing = {
    ['name']: 'Menacing',
    ['info']: "Successful defenses drop attackers strength by 1.",
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: [],
}

const positioning = {
    ['name']: 'Positioning',
    ['info']: "Cape gains +1 CTR on next 3 rounds.",
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: [],
}

const counter = {
    ['name']: 'Counter',
    ['info']: "+2 UTL vs [DATA]s.", 
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: ['Blaster','Breaker','Brute','Changer','Master','Mover','Shaker','Stranger','Striker','Thinker','Tinker','Trump'],
}
const ego = {
    ['name']: 'Ego',
    ['info']: "+2 STR at max health.", 
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: [],
}
const rebound = {
    ['name']: 'Rebound',
    ['info']: "+2 TEQ when counterattacking.", 
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: [],
}

const underdog = {
    ['name']: 'Underdog',
    ['info']: "+2 STR against higher health targets.", 
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: [],
}

const adrenaline = {
    ['name']: 'Adrenaline',
    ['info']: "+½ STR when below half health.", 
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: [],
}
const pin = {
    ['name']: 'Pin',
    ['info']: "Hits reduce victim's CTR by 2.", 
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: [],
}
const lunge = {
    ['name']: 'Lunge',
    ['info']: "Ignores up to 5 CTR differential against previous targets.", 
    ['general']: true,
    ['keys']: [],
    ['element']: null,
    ['potentialdata']: [],
}

const allFeats = [
    recoil,
    tracking,
    deadeye,

    aura,
    hostileenvironment,
    intertground,

    monolithic,
    thickhide,
    meatshield,

    prototype,
    prepper,
    overload,

    twitchy,
    soar,
    carrythrough,

    outplay,
    flow,
    accuracy,

    unexpected,
    unstoppable,
    unstable,

    extrasensory,
    sidekick,
    puppetry,

    reaper,
    execution,
    shackle,

    challenger,
    rage,
    regurgitate,

    retreat,
    assasinate,
    isolation,

    boost,
    bodyguard,
    drain,
    enfeeblement,
    absorbption,
    quickstudy,

    improvisation,
    counter,
    menacing,
    positioning,
    ego,
    rebound,
    adrenaline,
    underdog,
    pin,
    lunge
]





module.exports.filterFeats = (cape)=>{ //returns available feats for the cape
    if (!cape){
        return allFeats
    }
    
    var result = [];
    for (let feat of allFeats){

 

        if (feat.general){ //general feat5
            result.push(feat);
            continue;
        }

        //keys
        if (feat.keys.length > 0){
            if (feat.keys.includes(cape.class) || feat.keys.includes(powerModule.getSubclass(cape))){
                result.push(feat);
                continue;
            }
        }
    }

    function featFilter(feat){
        for (let usedFeat of [...cape.feats,...cape.unusedfeats]){
            if (feat.name == usedFeat[0]){
                return false;
            }
        }
        return true;
    }

    if (cape.feats){
        //console.log('filtering '+cape.name)
        result = result.filter(featFilter);
    }

    return result;
};


module.exports.getFeat = (featName)=>{
    for (let feat of allFeats){
        if (feat.name == featName){
            return feat;
        }
    }
}
