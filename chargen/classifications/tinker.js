// Template: Tinkers with (theme) (tech) through (method), but (complication).




const complications = [
    { name: "they have to sacrifice parts of their body",
        pro: ["strength",],
        con: ["vitality"],
    },
    { name: "they cannot focus on one project",
        pro: ["control","utility"],
        con: ["technique"],
    },
    { name: "what they make is random",
        pro: ["technique","strength"],
        con: ["utility","control"],
    },
    { name: "their tech has glaring weak points",
        pro: ["utility","strength"],
        con: ["vitality"],
    },
    { name: "creations are sentient and don't like the tinker",
        pro: ["strength","technique"],
        con: ["control"],
    },
    { name: "their tech occasionally falls apart",
        pro: ["control"],
        con: ["utility"],
    },
    { name: "their tech requires an unstable energy source",
        pro: ["strength","strength"],
        con: ["technique"],
    },
    { name: "all their tech needs to be huge in scale",
        pro: ["control","vitality"],
        con: ["utility","technique"],
    },
    { name: "they can only focus on one project at a time",
        pro: ["technique","strength"],
        con: ["vitality"],
    },
    { name: "they need a rare material in all projects",
        pro: ["vitality"],
        con: [],
    },
    { name: "their technology is parasitic in nature",
        pro: ["vitality"],
        con: ["strength"],
    },
    { name: "they must steal material from other capes",
        pro: ["control"],
        con: [],
    },
    { name: "their tech switches states uncontrollably",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "their tech requires constant recharging",
        pro: ["technique"],
        con: ["vitality"],
    },
    { name: "their technology interferes with other parahuman powers",
        pro: ["technique","vitality"],
        con: ["control"],
    },
    { name: "their gear requires time to set up",
        pro: ["strength","technique"],
        con: ["control"],
    },
    { name: "they are compelled to make use of their tech as much as they can",
        pro: ["technique"],
        con: ['utility'],
    },
    { name: "their personality has been ground away into something toxic or empty",
        pro: ["vitality",'technique'],
        con: ["control"],
    },
    { name: "they require their tech to be able to keep moving",
        pro: ["control",'technique'],
        con: ['vitality'],
    },
    { name: "they must sacrifice people to build their tech",
        pro: ["strength"],
        con: ["utility",'utility'],
    },
    { name: "they can not build anything not within that narrowly defined spec",
        pro: ["technique"],
        con: ['control','utility'],
    },
    { name: "their tech is all crippilingly specialized",
        pro: ["technique",'technique'],
        con: ['control','control','utility'],
    },
    { name: "they must build their tech in twos, one piece working off the other",
        pro: ["strength"],
        con: [],
    },
    { name: "they only build effectively when building and improving a single object",
        pro: ["strength",'technique'],
        con: ['control','vitality'],
    },
    { name: "they are least effective when building things within the same specilization as previous projects",
        pro: ["utility",'strength'],
        con: ['control'],
    },
    { name: "their tech self-destructs when sufficiently damaged",
        pro: ["strength",'control'],
        con: ['vitality'],
    },
    
    { name: "their tech is ridiculously loud when in use",
        pro: ["control",'strength'],
        con: ['technique'],
    },

    
    { name: "their tech discharges noxious fumes as a byproduct of its energy consumption",
        pro: ["strength",'technique'],
        con: ['vitality'],
    },

    { name: "their tech only reveals its true potential at specific times",
        pro: ["strength",'utility'],
        con: ['technique','control'],
    },
    { name: "their equipment can easily hurt them if they're not careful",
    pro: ["strength"],
    con: ['technique',],

    }



];

const technologies = [
    'guns'
,    'swords'
,    'mechas'
,    'powered armor'
,    'visors'
,    'drones'
,    'generators'
,    'databases'
,    'vehicles'
,    'force fields'
,    'projectors'
,    "tanks"
,    "flying machines"
,    "cannons"
,    'body enhancements'
,    'explosives'
,    'halberds'
,    'gadgets'
,    'weapons'
,    'shields'
,    'engines'
,    'bodysuits'
,    'gauntlets'
,    'dispensers'
,    'software'
,    'missiles'
,    'androids'
,    "traps"
,    "animals"
,    "turrets"
,    'minions'
,    'implants'
,    'drugs'
,    'arms'
,    'cameras'
,    'kaiju'
,    'clones'
,    'movement frames'
,    'obelisks'
,    'monsters'
,    'viruses'
,    'grenades'
,    'low-orbit satellites'
,    'artilllery'
,    'cannons'
,    'teleporters'
,    'cyborgs'
,    'robot swarms'
,    'coatings'
,    'headsets'
,    'simulations'
,    'cyberanimals'
,    'reflectors'
,    'incubators'
,    'jetpacks'
,    'prosthetics'
   
]

const themes  = [
["pyrotechnic",'Flurry',"Fire"]
,["space warping",'Ambush',"Force"]
,["cryotechnic",'Debuff',"Water"]
,["electricity",'Debuff',"Lightning"]
,["combining",'Blitz',"Metal"]
,["stealth",'Artillery',"Dark"]
,["speed",'Ambush',"Time"]
,["defensive",'Mitigation',"Life"]
,["laser",'Artillery',"Energy","Light"]
,["scrap",'Flurry',"Metal"]
,["nanobot",'Debuff',"Metal","Life"]
,["holographic","Artillery","Light"]
,["duplication",'Nuker',"Illusion"]
,["gas",'Nuker',"Toxic"]
,["time-manipulation",'Artillery',"Time"]
,["esoteric state","Debuff","Illusion"]
,["biological",'Ambush',"Life"]
,["weather",'Nuker',"Lighting","Wind","Water"]
,["steampunk",'Combat',"Metal"]
,["atomic",'Debuff',"Energy"]
,["nuclear",'Nuker',"Energy","Toxic"]
,["drone creating",'Nuker',"Wind","Metal"]
,["modular",'Surveillance',"Metal"]
,["terrain manipulating",'Nuker']
,["emotion",'Surveillance',"Life"]
,["mental",'Cycle',"Life","Dark"]
,["dimensional",'Artillery',"Force"]
,["predictive",'Combat',"Illusion"]
,["plastic",'Flurry',"Toxic" ]
,['surveillance','Surveillance',"Dark"]
,['multifunctional','Combat',"Metal","Illusion"]
,['crystaline','Flurry',"Light","Earth"]
,['flesh','Blitz',"Life"]
,['alien metal','Combat',"Life","Metal"]
,['magnetic','Blitz',"Metal","Lightning"]
,['self repairing','Mitigation',"Life"]
,['toxic','Debuff',"Toxic"]
,['replicating','Nuker',"Illusion"]
,['glass','Flurry',"Fire","Earth"]
,['emplaced','Ambush',"Force"]
,['precognitive','Surveillance',"Darj"]
,['plant based','Ambush',"Life"]
,['sentient','Cycle',"Life"]
,['power-nulling','Blitz',"Dark"]
,['anachronistic','Cycle',"Time"]
,['hard-light','Mitigation',"Light"]
,['intangible','Artillery',"Illusion"]
,['entangled','Blitz',"Metal"]
,['single-use','Ambush',"Energy"]
,['chemically unstable','Flurry',"Toxic"]
,['hydrophobic','Mitigation',"Water"]
,['neurally-controlled','Cycle',"Dark"]
,['gasoline-fueled','Blitz',"Toxic","Earth"]
,['gravitational','Debuff',"Force"]
,['symbiotic','Combat',"Life"]
,['hydraulic','Blitz',"Force","Water"]
,['remote-controlled','Surveillance',"Metal"]
,['rocket-propelled','Nuker',"Fire","Metal","Energy"]
,['pneumatic','Debuff',"Water"]
,['clockwork','Ambush',"Metal"]

]

const methods = [
    "working on others",
    "relentless field-testing",
    "refining one focus",
    "getting inspiration from other capes",
    "crossovers with a different field",
    "in-combat inspiration",
    "upgrading mundane objects",
    "receiving inspiration in a dream",
    "studying a particular mundane thing",
    "gathering various esoteric resources",
    "growing bioorganisms in vats",
    "mutating preexisting biology",
    "self experimentation"
,    'combat with other capes'
,    'constant innovation on their existing tech'
,    'miniaturizing technology and cramming as much as possible into one project'
,    'replacing their gear constantly'
,    'using a breaker state alongside their technology'
,    'combining two different technology fields together'
,    'building supercomputers to aid their creation'
,    'countering specific opponents'
,    'stealing other tinkers tech'
,    'collaboration'
,    'branching out into many different fields'
,    'duplicating the effects of other capes'
,    '3D printing'
,    'exotic forging'
,    'hard work and discipline'
,    'making ultra detailed blueprints'
,    'transmuting raw matter into technology'



]

const classPros = ['utility','control','utility'];


const availableSubclasses = [
    'Mitigation',
    'Nuker',
    'Artillery',
    'Surveillance',
    'Combat',
    'Debuff',
    'Flurry',
    'Ambush',
    'Blitz',
    'Cycle'
]

var totalTrees = 6

function compilePotentialSubclasses(powerText){
    var myTheme = null;
    var myTech = null;
    var techTree = []

    for (let tbl of themes){
        //console.log(info[0])
        var targetStr = "Tinkers with  "+tbl[0];
        if(powerText.substring(0,targetStr.length) == targetStr){
            myTheme =tbl;
        }
    }
    if (myTheme){
        techTree.push(myTheme[1])
        for (tbl of technologies){
            //console.log(info[0])
            var targetStr = "Tinkers with "+myTheme[0]+" "+tbl;
            if(powerText.substring(0,targetStr.length) == targetStr){
                myTech =tbl;
            }
        }
    }

    while (techTree.length < totalTrees){
        var myClass = availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)];
        if (techTree.lastIndexOf(myClass) == -1){
            techTree.push(myClass)
        }
    }
    return techTree;

}

exports.getSubclass = (power) => {
    if (power['subclass'] && power['subclass'] == "Strategist"){ // allowing old strategists
        return("Strategist");
    }
    if (power['subclass'] && availableSubclasses.lastIndexOf(power['subclass']) > -1){ // if power has a specifically written subclass
        return(power['subclass']);
    }
    
    if (!power.subclass && power.UnlockedClasses && availableSubclasses.lastIndexOf(power.UnlockedClasses[0]) > -1){ // if power has a specifically written subclass
        return(power.UnlockedClasses[0]);
    }

    //console.log('filling in')
    //filling in old tinker data and for new capes
    var newPossibleClasses = compilePotentialSubclasses(power.info);
   // console.log("regenning research classes")    
    power['subclass'] = newPossibleClasses[0];
    power["ResearchClasses"] = newPossibleClasses;
    power["UnlockedClasses"] = [newPossibleClasses[0]];

    mySubclass = power.subclass;

    //console.log(power["ResearchClasses"])
    //console.log(power["UnlockedClasses"])
    
    return power['subclass'];
}

exports.genInfo = (cluster) => {
    var info = new Object();
    var comp = complications[Math.floor(Math.random()*complications.length)];
    var method = methods[Math.floor(Math.random()*methods.length)];
    var theme = themes[Math.floor(Math.random()*themes.length)];
    var tech = technologies[Math.floor(Math.random()*technologies.length)];

    // Tinkers with (theme) (tech) through (method), but (complication).
    info["power"] = "Tinkers with "+theme[0]+" "+tech+" through "+ method +", but "+comp.name+".";
    info["bonus"] = [[...comp.pro, ...classPros], comp.con];
    info["shape"] = theme[0] + " weapon";
    info["description"] = tech;

    var newPossibleClasses = compilePotentialSubclasses(info["power"]);
    info['subclass'] = newPossibleClasses[0]
    info["ResearchClasses"] = newPossibleClasses;
    info["UnlockedClasses"] = [newPossibleClasses[0]];
    //console.log(info.ResearchClasses)
    //console.log(info.UnlockedClasses)
    if (cluster) //gathering subpowers
    {
        info['minors']= []

        
        function filterCombos(pair){//name, description. Adds 
            for (let elem of theme){
                for (let elem2 of pair){
                    if (availableSubclasses.indexOf(elem)==-1 && elem2.toLowerCase() == elem.toLowerCase()){
                        return true;
                    }
                }
            }
        }
        var possibleCombinations = themes.filter(filterCombos);

        for (let i = 0; i<cluster;i++){
            var minorInfo = possibleCombinations[Math.floor(Math.random()*possibleCombinations.length)];

            var minorPower = minorInfo[0].toLowerCase()+" tech";
            var flavor = `Creates minor ${minorPower.toLowerCase()}.`

            var minor = [minorPower,flavor,minorInfo[1]]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
            
    }
    return info;
}


//attack flavoring required
exports.attackFlavor = (cape,targetList,resultList,retaliation)=>{
    var mySub = cape.battlestats.subclass[0];
    //console.log('checking flavor')
    if (retaliation){
        mySub = 'Retaliation'
    }
    var myTech = cape.power.shape;//default for customs and 
    
    var myFlavor = ""

    switch(mySub){
        case("Flurry"):
            if (cape.battlestats.subbonus.active == false){ // first strike hits
                myFlavor = `${cape.name}'s ${myTech} assault ${targetList[0].name} `
            }else{
                myFlavor = `${cape.name}'s ${myTech} unleashes a frenzy of blows at ${targetList[0].name}`
            }
            break;
        case("Nuker"):
            var struckTargets = ""
            //targetList.shift();
            for (var i = 0; i < targetList.length;i++){
                if (i == targetList.length-1 && i != 0){
                    struckTargets+= "and "
                }
                struckTargets+= targetList[i].name;
                if (i != targetList.length-1 && targetList.length > 2){
                    struckTargets+= ","
                }
                if (i != targetList.length-1){
                    struckTargets+= " "
                }
            }
            myFlavor = `${cape.name}'s ${myTech} assail ${struckTargets}`
            break;
       
        case("Retaliation"):
            myFlavor = `${cape.name} responds to ${targetList[0].name} with ${myTech}`;
            break;
        default:
            myFlavor =  `${cape.name} attacks ${targetList[0].name} with their ${myTech}`;
        
    }
    return myFlavor;
}


exports.getNewSubclass = (ignorables)=>{//array of subclasses they already have
    function filter(a){
        if (!ignorables.includes(a)){
            return true;
        }
        return false;
    }
    const list = availableSubclasses.filter(filter);
    return list[Math.floor(Math.random()*list.length)]
}