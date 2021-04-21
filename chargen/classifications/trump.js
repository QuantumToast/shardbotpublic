// Template: Shoots (description) (shape) from (source) that (after effect)
/* Subclasses:
Deny: vs UTL to set enemy UTL to zero for a round (run target finder start of round, no attack). Should cycle between other classes
Grant: Boosts ally lowest stat to UTL (not counting UTL)
    Need flavors for granting "Cape's method grants target X STR"
 - Thinker (combat flavoring) (teq)
 - Brute (vitality)
 - Shaker (environment flavoring) (control)
 - Striker (strength)


Copy: Copies the subclasses of the person above and below them in initiative at start of game. Ignores trumps
    - overwelms with (stolen description) (focus)
Wild: Pulls a random subclass (out of a designated pool) every round. 

*/
// Subpower modules

const bruteModule = require("./brute.js")
const shakerModule = require("./shaker.js")
const strikerModule = require("./striker.js")
const thinkerModule = require("./thinker.js")

const subPowers=[
    ['vitality',bruteModule],
    ['control',shakerModule,['Siege','Environment']],
    ['technique',thinkerModule,['Combat']],
    ['strength',strikerModule]
]


const grantTargets=[
    "clones",
    "civillians",
    "effigies",
    "allies",
    "animals",
    "summons",
    "machines",
    "limbs",
    "weapons",
    "followers",
    "totems",
    "projections"
]
const grantInteractions=[

    { name: "touch",
        pro: ['utility'],
        con: [],
    },
    { name: "implants",
        pro: ['control'],
        con: [],
    },
    { name: "prayer",
        pro: ['strength','vitality'],
        con: ['control'],
    },
    { name: "meditation",
        pro: ['vitality','technique'],
        con: ['control'],
    },
    { name: "trance",
        pro: ['technique'],
        con: [],
    },
    { name: "bargains",
        pro: ['control','utility'],
        con: ['vitality'],
    },
    { name: "blood transfusions",
        pro: ['utility'],
        con: ['vitality'],
    },
    { name: "contract",
        pro: ['vitality','technique'],
        con: ['control'],
    },
    { name: "bets",
        pro: ['technique'],
        con: ['control'],
    },
    { name: "predictions",
        pro: ['strength','technique'],
        con: ['vitality'],
    },
    { name: "cheering on",
        pro: ['control','utility'],
        con: ['vitality','strength'],
    },
    { name: "power investment",
        pro: ['utility','utility'],
        con: ['strength','vitality'],
    },
    { name: "mental networking",
        pro: ['utility','control'],
        con: ['technique'],
    }
]


const denyEffects = [
    "Negates",
    "Hampers",
    "Dampens",
    "Shuts off",
    "Overloads",
    "Confuses",
    "Scrambles",
    "Nullifies",
    "Warps",
    "Distorts",
    "Disrupts",
    "Misdirects",
    "Twists",
    "Denies",
    "Weakens",
    "Minimizes",
    "Controls",
    "Counteracts",
    "Deranges",
    "Interrupts",
    "Unsettles",
    "Hampers",
    "Impedes",
    "Obstructs",
    "Exhausts",
    "Delays"
]
const denyConditions = [
    { name: "in range",
        pro: ['control'],
        con: ['technique'],
    },
    { name: "that they've touched",
        pro: ['utility'],
        con: ['control'],
    },
    { name: "that they've hurt",
        pro: ['utility'],
        con: ['strength'],
    },
    { name: "that have hurt them",
        pro: ['strength'],
        con: ['vitality'],
    },
    { name: "that they have seen",
        pro: ['technique'],
        con: ['control'],
    },
    { name:  'that they dislike most',
        pro: ['vitality'],
        con: ['strength'],
    },
    { name: 'that cause the most harm',
        pro: ['vitality'],
        con: ['control'],
    },
    { name: 'of the wrong color',
        pro: ['control'],
        con: ['utility'],
    },
    { name: 'that have caused collateral damage',
        pro: ['vitality'],
        con: ['strength'],
    },
    { name: 'that they choose',
        pro: ['technique'],
        con: ['control'],
    },
    { name: 'with recklessness',
        pro: ['strength'],
        con: ['technique'],
    },
    { name: 'every few seconds',
        pro: ['control'],
        con: ['strength'],
    },
    { name: 'reflexively',
        pro: ['strength'],
        con: ['technique'],
    },
    { name: 'that they have studied',
        pro: ['strength'],
        con: ['vitality'],
    },
    { name: 'that are far enough away',
        pro: ['control'],
        con: ['strength'],
    },
    { name: 'that are too close',
        pro: ['strength'],
        con: ['control'],
    }


]
const denyVectors = [
    { name: "energy orbs",
        pro: ['control'],
        con: [],
    },
    { name: "shockwaves",
        pro: ['strength'],
        con: [],
    },
    { name: "shouts",
        pro: ['control','strength'],
        con: ['technique'],
    },
    { name: "traumatic memories",
        pro: ['technique'],
        con: [],
    },
    { name: "severing the corona pollentia connection",
        pro: ['utility'],
        con: [],
    },
    { name: "their weapon",
        pro: ['strength'],
        con: [],
    },
    { name: "altering the laws of physics",
        pro: ['utility'],
        con: [],
    },
    { name: "smoke",
        pro: ['control','control'],
        con: ['technique'],
    },
    { name: "bets",
        pro: ['strength','utility'],
        con: ['vitality'],
    },
    { name: "an internal battery",
        pro: ['control','technique'],
        con: ['strength'],
    },
    { name: "mental attacks",
        pro: ['technique'],
        con: [],
    },
    { name: "taunts",
        pro: ['vitality'],
        con: [],
    },
    { name: "taking them head-on",
        pro: ['vitality','vitality'],
        con: ['control'],
    },
    { name: "forcefields",
        pro: ['control'],
        con: [],
    },
    { name: "creating safe zones",
        pro: ['control'],
        con: [],
    },
    { name: "blood contact",
        pro: ['utility','technique'],
        con: ['vitality'],
    }

]


const copyInteraction = [
    "touching",
    "witnessing",
    "hurting",
    "fighting",
    "mocking",
    "taunting",
    "punching",
    "scratching",
    'bullying',
    'scanning',
    'absorbing',
    'being near',
    'attacking',
    'defending against',
    'seeing',
    'studying',
    'observing',
    'striking',
    'stalking',
    'intimidating',
    'running away from',
    'concentrating on'
]

const copyAdjustment = [
    'fine-tune', 
    'imbue', 
    'superpower', 
    'overload', 
    'supercharge', 
    'proof', 
    'harden',
    'intensify',
    'energise',
    'reinforce',
    'improve',
    'protect',
    'master',
    'exalt',
    'adapt',
    'ignite',
    'super-cool'

]

const copyFocus = [
    { name: "defenses",
        pro: ['vitality'],
        con: [],
    },
    { name: "clones",
        pro: ['control'],
        con: [],
    },
    { name: "predictions",
        pro: ['technique'],
        con: [],
    },
    { name: "movement",
        pro: ['control'],
        con: [],
    },
    { name: "attacks",
        pro: ['strength'],
        con: [],
    },
    { name: "tactics",
        pro: ['utility'],
        con: [],
    },
    { name: "body",
        pro: ['vitality'],
        con: [],
    },
    { name: "arms",
        pro: ['strength'],
        con: [],
    },
    { name: "legs",
        pro: ['technique'],
        con: [],
    },
    { name: "mind",
        pro: ['utility'],
        con: [],
    },
    { name: "eyes",
        pro: ['technique'],
        con: [],
    },
    { name: "lasers",
        pro: ['strength'],
        con: [],
    },
    { name: "blasts",
        pro: ['strength','strength'],
        con: ['vitality'],
    },

    { name: "stomps",
        pro: ['strength','strength'],
        con: ['control'],
    },

    { name: "charges",
        pro: ['utility'],
        con: [],
    },

    { name: "armor sets",
        pro: ['vitality'],
        con: [],
    },

    { name: "weapons",
        pro: ['strength'],
        con: [],
    },
    { name: "gauntlets",
        pro: ['strength','vitality'],
        con: ['technique'],
    },
    
    { name: "techniques",
        pro: ['technique','technique'],
        con: ['control'],
    }

]

const copyConditions = [
    'controlling', 
    'aiming', 
    'targeting', 
    'stopping', 
    'limiting',
    'attacking', 
    'defending', 
    'moving', 
    'breathing', 
    'concentrating',
    'holding onto the powers',
    'learning how to use the powers',
    'telling friend from foe',
    'orienting',
    'navigating',
    'moving'
]


const classPros = ['utility','utility','vitality'];
const availableSubclasses = ["Grant","Deny","Copy"] //to check if a subclass still exists 

exports.genInfo = () => {
    var subclass = availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)];

    var info = new Object();

    switch(subclass){
        case("Grant"):
            const powerCat = subPowers[Math.floor(Math.random()*subPowers.length)];
            const target = grantTargets[Math.floor(Math.random()*grantTargets.length)].toLowerCase();
            const method = grantInteractions[Math.floor(Math.random()*grantInteractions.length)];

            switch(powerCat[0]){
                case('technique'): //Thinker
                    var powerData= powerCat[1].genMinor(powerCat[2][Math.floor(Math.random()*powerCat[2].length)])
                    var minorPower = powerData.toLowerCase();

                    info["power"] = `Gives ${target} increased access to ${minorPower} through ${method.name.toLowerCase()}.`
                    info['trumpstats']={
                        ['targetstat']: powerCat[0],
                        ['flavor']: minorPower,
                        ['subclass']: "Combat"
                    };
                    info['description']=method.name;
                    info["shape"]=target;
                    info["bonus"] = [[...method.pro, ...classPros], method.con];
                    info['subclass']='Grant'

                    break
                case('vitality'): //brute
                    var minorPower = powerCat[1].genMinor();
                    var powerFlavor=minorPower[0]+" "+minorPower[1];

                    info["power"] = `Gives ${target} ${powerFlavor} through ${method.name.toLowerCase()}.`
                    info['trumpstats']={
                        ['targetstat']: powerCat[0],
                        ['flavor']:powerFlavor,
                        ['subclass']: minorPower[2]
                    };
                    info['description']=method.name;
                    info["shape"]=target;
                    info["bonus"] = [[...method.pro, ...classPros], method.con];
                    info['subclass']='Grant'

                    break
                case('control'): //shaker
                    var powerData= powerCat[1].genMinor(powerCat[2][Math.floor(Math.random()*powerCat[2].length)])
                    var powerFlavor= powerData[0]+" "+powerData[1];

                    info["power"] = `Gives ${target} the ability to generate ${powerFlavor} through ${method.name.toLowerCase()}.`
                    info['trumpstats']={
                        ['targetstat']: powerCat[0],
                        ['flavor']:powerFlavor,
                        ['subclass']: "Environment"
                    };
                    info['description']=method.name;
                    info["shape"]=target;
                    info["bonus"] = [[...method.pro, ...classPros], method.con];
                    info['subclass']='Grant'

                    break
                default: //striker
                    var minorPower = powerCat[1].genMinor();
                    var powerFlavor=minorPower[0]+" "+minorPower[1];

                    info["power"] = `Gives ${target} the ability to attack with ${powerFlavor} through ${method.name.toLowerCase()}.`
                    info['trumpstats']={
                        ['targetstat']: powerCat[0],
                        ['flavor']: powerFlavor,
                        ['subclass']: minorPower[2]
                    };
                    info['description'] = method.name;
                    info["shape"] = target;
                    info["bonus"] = [[...method.pro, ...classPros], method.con];
                    info['subclass'] = 'Grant'

                }
            break;
        case("Deny"):
            const effect = denyEffects[Math.floor(Math.random()*denyEffects.length)];
            const condition = denyConditions[Math.floor(Math.random()*denyConditions.length)];
            const vector = denyVectors[Math.floor(Math.random()*denyVectors.length)];

            info["power"] = `${effect} cape powers ${condition.name.toLowerCase()} through ${vector.name.toLowerCase()}.`;
            info['trumpstats']={
                ['condition']: condition.name.toLowerCase()
            };
            info['description']=effect.toLowerCase();
            info["shape"]=vector.name;
            info["bonus"] = [[...condition.pro,...vector.pro, ...classPros], [...condition.con,...vector.con]];
            info['subclass']='Deny'
            break;
        case("Copy"):
            const interaction = copyInteraction[Math.floor(Math.random()*copyInteraction.length)];
            const adjustment = copyAdjustment[Math.floor(Math.random()*copyAdjustment.length)];
            const focus = copyFocus[Math.floor(Math.random()*copyFocus.length)];
            const trouble = copyConditions[Math.floor(Math.random()*copyConditions.length)];

            // Copies powers after (interaction) capes to (element) their (method) but has trouble (condition)

            info["power"] = `Copies powers after ${interaction} capes to ${adjustment} their ${focus.name} but has trouble ${trouble}.`;
            info['trumpstats']={
            };
            info['description']=adjustment.toLowerCase();
            info["shape"]=focus.name;
            info["bonus"] = [[...focus.pro, ...classPros], focus.con];
            info['subclass']='Copy'
            break;
    }
    return info;
}


exports.getSubclass = (power) => {
    return power.subclass;
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
exports.attackFlavor = (cape,targetList,resultList,retaliation)=>{
    var mySub = cape.battlestats.subclass[0];
    //console.log('checking flavor')
    var vector = cape.power.shape;//default for customs and 
    
    
    var myFlavor = ""

    switch(mySub){
        case("Grant"):
            if (!retaliation){
                myFlavor = `${cape.name} sends their ${vector} to attack ${targetList[0].name}`
            }else{
                myFlavor = `${cape.name}'s ${vector} turn to attack ${targetList[0].name}`
            }
            break
        case("Deny"):
            if (!retaliation){
                myFlavor = `${cape.name}'s ${vector} screws with ${targetList[0].name}`
            }else{
                myFlavor = `${cape.name}'s ${vector} react to ${targetList[0].name}'s attack`
            }
            break
        case("Copy"):
            myFlavor = `${cape.name} overwhelms ${concatNamesIntoList(targetList)} with their ${cape.power.shape}`
            break;
    }
    return myFlavor;
}