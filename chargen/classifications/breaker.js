// Template: Enters a (description) (form) state granting them (bonus) and (bonus) but (restriction).

const effects = [
    { name: "natural weaponry",
        pro: ["strength"],
        con: [],
    },
    { name: "natural armor",
        pro: ["vitality"],
        con: [],
    },
    { name: "enhanced strength",
        pro: ["strength"],
        con: [],
    },
    { name: "enhanced speed",
        pro: ["control"],
        con: [],
    },
    { name: "enhanced endurance",
        pro: ["vitality"],
        con: [],
    },
    { name: "armor-penetration",
        pro: ["strength"],
        con: [],
    },
    { name: "materialized armor",
        pro: ["vitality"],
        con: [],
    },
    { name: "a protective shell",
        pro: ["vitality"],
        con: [],
    },
    { name: "an element-infused arena",
        pro: ["control"],
        con: [],
    },
    { name: "command of lesser minions",
        pro: ["control"],
        con: [],
    },
    { name: "a morale boost",
        pro: ["technique"],
        con: [],
    },
    { name: "a fear aura",
        pro: ["technique"],
        con: [],
    },
    { name: "command over light and shadow",
        pro: ["strength"],
        con: [],
    },
    { name: "a power boost",
        pro: ["strength"],
        con: [],
    },
    { name: "enhanced senses",
        pro: ["utility"],
        con: [],
    },
    { name: "limited invulnerability",
        pro: ["vitality"],
        con: [],
    },
    { name: "flight",
        pro: ["control"],
        con: [],
    },
    { name: "enhanced reflexes",
        pro: ["technique"],
        con: [],
    },
    { name: "elemental control",
        pro: ["strength"],
        con: [],
    },
    { name: "duplication abilities",
        pro: ["control"],
        con: [],
    },
    { name: "size manipulation",
        pro: ["strength","vitality"],
        con: ["technique",],
    },
    { name: "phasing abilities",
        pro: ["vitality"],
        con: [],
    },
    { name: "environmental control",
        pro: ["control"],
        con: [],
    },
    { name: "intangibility",
        pro: ["vitality"],
        con: [],
    },
    { name: "natural projectiles",
        pro: ["control"],
        con: [],
    },
    { name: "elemental projectiles",
        pro: ["strength"],
        con: [],
    },
    { name: "total inviolability",
    pro: ["vitality",'strength'],
    con: ["control",],
    },
    { name: "the ability to punch through anything",
    pro: ["strength"],
    con: ["technique"],
    },
    { name: "a personalized gravity well",
    pro: ["control"],
    con: [],
    },
    { name: "self duplication",
    pro: ["control",'control'],
    con: ['strength'],
    },
    { name: "limited precognition",
    pro: ["control",'technique'],
    con: ["'vitality"],
    },
    { name: "invisibility",
    pro: ["technique"],
    con: ["vitality"],
    },
    { name: "an elemental blast",
    pro: ["strength"],
    con: [],
    },
    { name: "a danger sense",
        pro: ["vitality"],
        con: [],
    },
    { name: "close-ranged energy arcs",
        pro: ["strength"],
        con: [],
    },
    { name: "active camouflage",
        pro: ["technique"],
        con: [],
    },
    { name: "defensive teleportation when hit",
        pro: ["vitality"],
        con: [],
    },
    { name: "energy tendrils",
        pro: ["strength"],
        con: [],
    },
    { name: "superspeed in straight lines",
        pro: ["control"],
        con: [],
    },
    { name: "unusual senses",
        pro: ["control"],
        con: [],
    },
    { name: "time manipulation",
        pro: ["utility",'utility'],
        con: ['control'],
    },
    { name: "jet-powered flight",
        pro: ["control",'control'],
        con: ['technique'],
    },
    { name: "space-warping strikes",
        pro: ["vitality"],
        con: [],
    },
    { name: "the ability to transform into pure energy",
        pro: ["utility"],
        con: [],
    },
    { name: "homing projectiles",
        pro: ["technique"],
        con: [],
    },
    { name: "control over technology",
        pro: ["control",'technique'],
        con: ["strength"],
    },
    { name: "the ability to alter materials",
        pro: ["utility"],
        con: [],
    },
    { name: "a subtle emotional aura",
        pro: ["vitality"],
        con: [],
    }

];

const desc = [
    ['Shining', "Light"]
   , ['Flaming',"Fire"]
   , ['water']
   , ['Frozen',"Water"]
   , ['plasma',"Energy","Fire","Lightning"]
   , ['electric',"Lightning"]
   , ['Translucent',"Illusion"]
   , ['Ashen',"Earth"]
   , ['ghostly',"Dark","Illusion"]
   , ['flickering',"Illusion"]
   , ['flying',"Wind"]
   , ['partial',"Illusion"]
   , ['polished',"Metal","Light"]
   , ['silver',"Metal"]
   , ['metallic',"metal"]
   , ['light-sapping',"Dark","Light"]
   , ['terrifying',"Dark","Toxic"]
   , ['natural',"Life"]
   , ['nimble',"Wind"]
   , ['lumbering',"Life","Force"]
   , ['layered',"Earth"]
   , ['fractal',"Illusion"]
   , ['hard',"Force"]
   , ['space-warping',"Illusion","Force"]
   , ['holographic',"Light","Energy"]
   , ['obsidian',"Earth","Dark"]
   , ['hollow',"Illusion"]
   , ['giant',"Force","Life"]
   , ['transparent',"Illusion"]
   ,['multiheaded',"Life"]
   ,['stretching',"Illusion"]
   ,['magnetic',"Lightning"]
   ,['glowing',"Light"]
   ,['invisible',"Illusion"]
   ,['silent',"Force"]
   ,['explosive',"Energy","Fire"]
   ,['fleshy',"Life"]
   ,['necrotic',"Dark","Life"]
   ,['imploding',"Force"]
   ,['quick',"Wind"]
   ,['heavy',"Force","Earth"]
   ,['magma',"Fire","Earth"]
   ,['rocky',"Earth"]
   ,['stormy',"Wind","Lightning"]
   ,['eldritch',"Dark","Illusion"]
   ,['steel',"Metal"]
   ,['razor',"Metal"]
   ,['cloth' , "Life"]
   ,['muscle', "Life"]
   ,['bone', "Life"]
   ,['vaccuum', "Dark","Force"]
   ,['void',"Dark"]
   ,['radioactive',"Toxic","Energy"]
   ,['buzzing',"Lightning","Life"]
   ,['humming',"Life","Energy"]
   ,['zigzagging',"Wind"]
   ,['television static',"Electricity","Light"]
   ,['spiral',"Wind"]
   ,['porcelain',"Earth","Light"]
   ,['hovering',"Wind"]
   ,['glass',"Illusion"]
   ,['distorted',"Dark"]
   ,['crackling',"Fire"]
   ,['frayed',"Illusion"]
   ,['faceless',"Dark","Light"]
   ,['flowing',"Wind","Water"]
   ,['shimmering',"Fire","Light"]
   ,['dripping',"Water","Toxic"]
   ,['radiant',"Light"]
   ,['crystalline',"Earth"]
   ,['vaporous',"Water"]
   ,['glittery',"Light"]
   ,['illusory',"Illusion"]
   ,['four-dimensional',"Illusion"]
   ,['neon',"Light"]
   ,['foggy',"Wind","Water"]

]

const states = [
    'Elemental'
   , 'Statue'
   , 'Ghost'
   , 'Golem'
   , 'Shadow'
   , 'Lattice'
   , 'Monolith'
   , 'Corona'
   , 'Dragon'
   , 'Wyrm'
   , 'Leviathan'
   , 'Fractal'
   , 'Star'
   , 'Statue'
   , 'Tower'
   , 'Sword'
   , 'Mirror'
   , 'light'
   , 'stone'
   , 'steel'
   , 'reality tear' 
   ,'humanoid'
   , 'angel'
   , 'titan'
   , 'cyclops'
   , 'hydra'
   , 'demon'
   ,'orb'
   , 'wave'
   , 'cloud'
   , 'storm'
   , 'energy'
   , 'prism'
   , 'polygon'
   , 'hologram'
   , 'crystal'
   , 'nimbus'
   , 'ink'
   , 'spiderweb'
   , 'graffiti'
   , 'hourglass'
]

const restrictions = [
    ['they suffer continous damage while in the breaker form','Focus']
   , ['the breaker form wanes in strength over time','Negation']
   , ['the breaker form takes time to grow stronger','Focus']
   , ['all damage they take is amplified','Focus']
   , ['all damage they deal is temporary','Focus']
   , ['they cannot distinguish between friend and foe','Focus']
   , ['they deal a lot of collateral damage','Focus']
   , ['they need to absorb a steady supply of material','Cycle']
   , ['they lose the will to fight','Negation']
   , ['their normal form accumulates mutations','Cycle']
   , ['their movement is impaired','Negation']
   , ['their mental ability is impaired','Focus']
   , ['the form has a strict time limit','Negation']
   , ['the form can only be accessed in short bursts','Negation']
   ,['they lose access to the state while moving','Focus']
   , ['they can only use that while in continuous motion','Cycle']
   , ['the longer they are in breaker form, the more severe the consequences when they leave it','Focus']
   , ['they lose total access to a sense while transformed','Focus']
   , ['the longer they remain in normal form, the stronger the breaker form is','Focus']
   , ['they can not leave a defined area until they transform back','Cycle']
   , ['they slowly lose control over their form','Cycle']
   , ['they become completely emotionless','Focus']
   , ['they are unable to understand most forms of communication','Negation']
   , ['they slowly float upwards if untethered','Focus']
   , ['leaving their breaker state is unpleasant','Cycle']
   , ['only one of their powers can be active at once','Cycle']
   , ['entering their breaker state attracts a lot of attention','Negation']
   , ['a lack of fighting leaves them restless in their human form','Cycle']
   , ['their personality is noticeably altered','Negation']
   , ['getting hit can involuntarily shunt them out of it','Focus']
   , ['giving them an obvious weak point','Focus']
   , ['limiting their movement to a slow hover','Negation']
   , ['their powers all depend on a single resource to function','Cycle']
   , ['they have trouble remembering what they did in their breaker state','Focus']
   , ['their senses all blend together into a confusing mess','Cycle']
   , ['their thoughts alter the shape of the form','Cycle']
   , ['entering their breaker state damages equipment','Negation']
   , ['entering their breaker state takes a few seconds','Focus']
   , ['they attack reflexively at the slightest provocation','Cycle']
   , ['leaving them particularly vulnerable to electricity','Focus']
   , ['their form becomes unstable if they stay still','Cycle']
   , ['they feel empathic pain whenever someone else does','Negation']
   , ['they can only move through their powers','Cycle']
   , ['entering their breaker state teleports them to their foes','Focus']

]

const classPros = ['strength','strength','utility'];

const allStats = ['strength','vitality','utility','control','technique']
const availableSubclasses = ["Focus","Cycle","Negation"] //to check if a subclass still exists


exports.genInfo = (cluster) => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var effect2 = effects[Math.floor(Math.random()*effects.length)];
    
    while (effect.name == effect2.name){
        effect2 = effects[Math.floor(Math.random()*effects.length)];
    }

    var restriction = restrictions[Math.floor(Math.random()*restrictions.length)];
    var state = states[Math.floor(Math.random()*states.length)];
    var descriptionTbl = desc[Math.floor(Math.random()*desc.length)];
    var description = descriptionTbl[0]
    // Enters a (description) (state) state granting them (effect) and (effect2) but (restriction).

    var article = 'a';
    var initial = description.toLowerCase().substring(0,1)
    if (initial == 'a' || initial == 'e' || initial == 'i' || initial == 'o' || initial == 'u'){
        article = 'an'
    }
    info["power"] = "Enters "+article+" "+description.toLowerCase()+" "+state.toLowerCase()+" state granting them " + effect.name + " and " + effect2.name + ", but " + restriction[0] + ".";
    info["bonus"] = [[...effect.pro,...effect2.pro, ...classPros], [...effect.con,...effect2.con,(allStats[Math.floor(Math.random()*5)])]];
    info["shape"] = state.toLowerCase()+" state";
    info["description"] = description;

    if (cluster) //gathering subpowers
    {
        info['minors']= []

        

        function filterCombos(pair){//name, description. Adds 
            for (let elem of descriptionTbl){
                for (let elem2 of pair){
                    if (elem2.toLowerCase() == elem.toLowerCase()){
                        return true;
                    }
                }
            }
        }
        var possibleCombinations = desc.filter(filterCombos);

        for (let i = 0; i<cluster;i++){
            var minorInfo = possibleCombinations[Math.floor(Math.random()*possibleCombinations.length)];

            var minorPower = minorInfo[0]+' state';
            var flavor = `Accesses a short-lived ${minorPower}.`
     
            var minor = [minorPower,flavor,availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)]]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
            
    }


    return info;
}

exports.getSubclass = (power) => {
    if (power.subclass && availableSubclasses.lastIndexOf(power.subclass) > -1){ // if power has a specifically written subclass
        return(power.subclass);
    }
    var mySubclass = ""
    for (restr of restrictions){
        
        if(power.info.endsWith(restr[0]+".")){
            mySubclass =restr[1];
            //console.log('setting subclass')
        }else{
            //console.log(`${power.info.substring(power.info.length-restr[0]-1)} / ${restr[0]+"."}`)
        }
    }   
    if (mySubclass == ""){ //giving a custom or incongruent cape a new class
        //console.log('randomizing ig')
        power['subclass'] = availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)]
        mySubclass = power.subclass
    }
    return mySubclass;
}


exports.attackFlavor = (cape,targetList,resultList,retaliation)=>{
    var mySub = cape.battlestats.subclass[0];
    //console.log('checking flavor')
    if (retaliation){
        mySub = 'Retaliation'
    }
    var myform = cape.power.shape;//default for customs and 
    
    switch(mySub){
        case("Focus"):
            if (cape.battlestats.subbonus.injuredOnRound == false){
                myFlavor = `${cape.name}'s ${myform} surges against ${targetList[0].name}`
            }else{
                myFlavor = `${cape.name} attacks ${targetList[0].name} in their ${myform}`
            }
            break;
        case("Cycle"):
            myFlavor = `${cape.name}'s ${myform} charges at ${targetList[0].name}`
            break;
        case("Negation"):
            myFlavor = `${cape.name}'s ${myform} attacks ${targetList[0].name}`
            break;
        case("Retaliation"):
            myFlavor = `${cape.name} retaliates against ${targetList[0].name}`
    }
    return myFlavor;
}