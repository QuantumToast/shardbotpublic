//Protects self through (element) (shape) (effect).

const elements = [
    "Dark",
    "Light",
    "Fire",
    "Lightning",
    "Wind",
    "Water",
    "Force",
    "Toxic",
    "Energy",
    "Illusion",
    "Earth",
    "Metal",
    "Time",
    "Life"
]

const effects = [
    { name: "and absorbing attacks to power up",
        pro: ["vitality"],
        con: ["control"],
    },
    { name: "that responds reactively to incoming threats",
        pro: ["technique"],
        con: [],
    },
    { name: "that effectively grants them super strength",
        pro: ["strength", "strength"],
        con: ["technique"],
    },
    { name: "while being immune to pain",
        pro: ["vitality"],
        con: [],
    },
    { name: "and enhanced speed",
        pro: ["control","utility"],
        con: [],
    },
    { name: "and altering their size",
        pro: ["strength","control","utility"],
        con: ["technique"],
    },
    { name: "while their power offloads mental interferences",
        pro: ["control","utility"],
        con: [],
    },
    { name: "and rendering some bodily functions redundant",
        pro: ["vitality","utility"],
        con: ["technique"],
    },
    { name: "and not requiring sustanance",
        pro: ["utility"],
        con: [],
    },
    { name: "that is always active",
        pro: ["control"],
        con: [],
    },
    { name: "that must be manually triggered",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "that increases their mass",
        pro: ["strength"],
        con: [],
    },
    { name: "while entering a rage state",
        pro: ["strength","strength"],
        con: ["technique"],
    },
    { name: "while they are under stress",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "and incentivizes enemies to target them instead of allies",
        pro: ["control","control"],
        con: ["utility"],
    },
    { name: "and causes a lot of collateral damage",
        pro: ["strength"],
        con: ["utility"],
    },
    { name: "and enhances their reactions",
        pro: ["technique"],
        con: [],
    },
    { name: "which sometimes misfires",
        pro: ["strength"],
        con: ["utility","technique"],
    },
    { name: "and shunting damage to those around them",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "while reflecting glancing blows",
        pro: ["technique"],
        con: [],
    },
    { name: "which can be granted to allies",
        pro: ['control','control'],
        con: ['vitality'],
    },
    { name: "that can also form weaponry",
        pro: ["strength",'utility'],
        con: [],
    },
    { name: "alongside an emotion effecting ability",
        pro: ["control"],
        con: [],
    },
    { name: "which responds explosively to damage",
        pro: ["strength","strenth"],
        con: ['vitality'],
    },
    { name: "that redistributes damage to nearby targets",
        pro: ["strength"],
        con: [],
    },
    { name: "that activates automatically when danger is nearby",
        pro: ["control",'control'],
        con: ['utility'],
    },
    { name: "that warps space around them",
        pro: ["technique"],
        con: [],
    },
    { name: "that grows more powerful the longer they go without being hit",
        pro: ["strength",'control'],
        con: ['vitality'],
    },
    { name: "that only works its best after they've been hurt",
        pro: ["strength","control"],
        con: ["vitality"],
    },
    { name: "that emits toxic gas the more it's used",
        pro: ["control",'technique'],
        con: ['utility','utility'],
    },
    { name: "that lets them selectively ignore some laws of momenteum",
        pro: ["control"],
        con: [],
    },
    { name: "that alters their body more and more permanently with each use",
        pro: ["strength"],
        con: [],
    },
    { name: "that can be temporarily ramped up",
        pro: ['vitality',"strength"],
        con: ['control'],
    },
    { name: "which sends out weak projectiles at opponents",
        pro: ['control'],
        con: [],
    },
    { name: "which snares melee attackers on contact",
        pro: ['vitality','technique'],
        con: ['control'],
    },
    { name: "which protects their head and filters the air they breathe",
        pro: ['utility','vitality'],
        con: [],
    },
    { name: "which only becomes active when the cape is attacked",
        pro: ['vitality','vitality'],
        con: ['control','control'],
    },
    { name: "which adapts to different kinds of attacks",
        pro: ['utility','utility'],
        con: [],
    }
]

const armor = {
    name: "armor",
    subclass: "Mitigation",

    descriptions: [
        ['dermal',"Life"]
       , ['metal', "Metal"]
       , ['stone', "Earth"]
       , ['dirt', "Earth"]
       , ['muscley', "Life"]
       , ['bone', "Life"]
       , ['scaley', "Life","Metal"]
       , ['flame',"Fire"]
       , ['spiked',"Life","Metal"]
       , ['sludge',"Toxic"]
       , ['ice',"Water"]
       , ['meat',"Life"]
       , ['plate',"Earth"]
       , ['chain',"Metal"]
       , ['leather',"Life"]
       , [ 'water']
       , ['ivory',"Life","Light"]
       , ['plant',"Life"]
       , ['space distorting',"Illusion"]
       , ['feathery',"Life","Wind"]
       , ['paper',"Wind"]
       , ['ablative',"Time"]
       , ['telekinetically assembled',"Force"]
       , ['tactical',"Metal"]
       , ['hardlight',"Light"]
       , ['steampunk',"Metal","Wind"]
       , ['teeth',"Life"]
    ]
}
const shields = {
    name: "shields",
    subclass: "Negation",

    descriptions: [
        ['magnetic',"Lightning"]
       , ['hardlight',"Light"]
       , ['gravel',"Earth"]
       , ['energy',"Energy","Fire","Lightning"]
       , ['ice',"Water"]
       , ['kinetic',"Force"]
       , ['bone',"Life"]
       , ['magma',"Earth","Fire"]
       , ['goo',"Toxic"]
       , ['projectile',"Force"]
       , ['reflection',"Time"]
       , ['detonating',"Energy"]
       , ['vibrating',"Lightning"]
       , ['repulsing',"Force"]
       , ['flashing',"Light"]
       , ['steel',"Metal"]
       , ['asphalt',"Earth"]
       , ['feathery',"Life","Wind"]
       , ['space-warping',"Illusion"]
       , ['attracting',"Force"]
       , ['gas',"Toxic"]
       , ['mental redirection',"Illusion"]
       , ['plasma',"Fire","Lightning","Energy"]
       , ['debris',"Earth"]
       , ['invisible',"Illusion"]
       , ['scrap metal',"Metal"]
       ,[ 'vibrational',"Lightning"]
       , ['interlocking', "Metal"]
       , ['ornate porcelain',"Light","Earth"]
       , ['point-blank telekinesis',"Force"]
       , ['temporal',"Time"]
       , ['screening',"Light"]
       , ['tower',"Metal"]
       , ['glowing',"Light","Toxic"]
       , ['roman',"Earth"]
       , ['intangible',"Illusion"]
       , ['hypnotic',"Illusion"]
    ]
}
const regen = {
    name: "regeneration",
    subclass: "Regeneration",

    descriptions: [
        ['bursts of',"energy"]
      ,  ['slow but consistent']
      ,  ['focused',"Force"]
      ,  ['vampiric',"Dark","Life"]
      ,  ['self improving']
      ,  ['evolutionary']
      ,  ['delayed',"Time"]
      ,  ['inconsistent']
      ,  ['rapid',"Time"]
      ,  ['cannibalizing',"Dark","Life"]
      ,  ['mechanical',"Lightning","Metal"]
      ,  ['self-organizing']
      ,  ['fractal',"Illusion"]
      ,  ['bloody',"Life"]
      ,  ['ossificating',"Life"]
      ,  ['fast but weak',"Energy"]
      ,  ['sleep activated', "Dark"]
      ,  ['over-corrective', "Life"]
      ,  ['sunlight-based',"Fire"]
      ,  ['agonizing',"Dark","Fire"]
      , ['gradual',"Life"]
      , ['hardlight',"Light"]
    ]
}

const invuln = {
    name: "invulnerability",
    subclass: "Negation",
    descriptions: [
        ['conditional',"Dark"]
      ,  ['timed',"Time"]
      ,  ['transferable',"Life"]
      ,  ['limb specific',"Force"]
      ,  ['limited use',"Fire"]
      ,  ['low levels of',"Energy"]
      ,  ['adaptive',"Life"]
      ,  ['random',"Energy"]
      ,  ['direction-based',"Force"]
      ,  ['painful',"Toxic","Fire"]
      ,  ['ablative',"Time"]
      ,  ['explosive',"Fire","Lightning","Energy"]
      ,  ['kinetic',"Force"]
      ,  ['speed-limiting',"Force"]
      ,  ['rebounding',"Time"]
      ,  ['space-warping',"Illusion"]
      ,  ['split-second',"Time"]
      , [ 'wound-specific',"Life"]
    ]
}

const resist = {
    name: "resistance",
    subclass: "Mitigation",

    descriptions: [
         ['inertial',"Force"]
      ,  [ 'heat', "Fire"]
      ,  ['kinetic',"Fire"]
      ,  ['pressure', "Earth","Force"]
      ,  ['electricity',"Lightning"]
      ,  ['parahuman ability',"Energy","Toxic","Dark","Light","Life","Time"]
      ,  ['mental',"Illusion"]
      ,  ['thermal extremes',"Fire","Water","Energy"]
      ,  ['cold',"Water","Wind"]
      ,  ['drug',"Toxic"]
      ,  ['slash',"Metal"]
      ,  ['projectile',"Force"]
      ,  ['mundane',"Life"]
      ,  ['disease',"Life","Toxic"]

    ]
}

const transformation = { // treat this one like unique?
    name: "transformations",
    subclass: "Regeneration",

    descriptions: [
        ['metal skin', "Life"]
      ,  ['sponge tissue',"Water"]
      ,  ['razorwire nerves',"Metal"]
      ,  ['insect-hive flesh',"Life","Wind"]
      ,  ['chitin skin',"Life"]
      ,  ['needle hair',"Metal"]
      ,  ['granite bone',"Life"]
      ,  ['water arms',"Water"]
      , [ 'spinal spikes',"Life"]
      ,  ['bone sheathe',"Life"]
      ,  ['translucent skin',"Life","Illusion"]
      ,  ['limb addition',"Life"]
      ,  ['redundant organs',"Life"]
      ,  ['weight manipulating',"Force"]
      ,  ['reactive elemental',"Energy"]
      ,  ['radioactive skin',"Energy","Toxic"]
      ,  ['added joints',"Life"]
      ,  ['clay skin',"Earth"]
      ,  ['layered scales',"Metal"]
      ,  ['wriggling hide',"Life"]
      ,  ['ferrofluid body',"Water","Metal"]
      ,  ['geode',"Earth"]
      ,  ['crystal limbs',"Earth","Light"]
      ,  ['keratin-plated',"Life"]
    ]
}


const shapes = [armor,shields,regen,invuln,resist,transformation];

const classPros = ['vitality','vitality','strength'];


var totalCombinations = []
for (shape of shapes){
    for (desc of shape.descriptions){
        totalCombinations.push([shape,desc])
    }
}


exports.genMinor = (subclass) => {
    function filterSubclass(shape){
        if (subclass){
            if (subclass==shape.subclass){
                return true;
            }else{
                return false;
            }
        }
        return true;
    }
    var allowedShapes = shapes.filter(filterSubclass)
    var shape = allowedShapes[Math.floor(Math.random()*allowedShapes.length)];
    var desc = shape.descriptions[Math.floor(Math.random()*shape.descriptions.length)][0];

    return ([desc,shape.name,shape.subclass])

}



exports.genInfo = (cluster) => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];

    var combo = totalCombinations[Math.floor(Math.random()*totalCombinations.length)];
    
    var shape = combo[0]
    var descTable = combo[1]
    var description = descTable[0]
    //Protects self through (desc) (shape) (effect).
    info["power"] = "Protects self through "+description+" " + shape.name+" " +effect.name+".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = "fists";
    info["description"] = description;

    if (cluster) //gathering subpowers
    {
        info['minors']= [];

        info.bonus[0].splice(info.bonus[0].indexOf(classPros[2]),1,"utility")

        function filterCombos(pair){//name, description. Adds 
            for (let elem of descTable){
                for (let elem2 of pair[1]){
                    if (elem2.toLowerCase() == elem.toLowerCase()){
                        return true;
                    }
                }
            }
        }
        var possibleCombinations = totalCombinations.filter(filterCombos);

        for (let i = 0; i<cluster;i++){
            var minorInfo = possibleCombinations[Math.floor(Math.random()*possibleCombinations.length)];

            var minorPower = minorInfo[1][0]+" "+minorInfo[0].name;
            var flavor = `Uses ${minorPower} to defend.`

            var minor = [minorPower,flavor,minorInfo[0].subclass]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
            
    }

    return info;
}
const availableSubclasses = ["Negation","Mitigation","Regeneration"] //to check if a subclass still exists
exports.getSubclass = (power) => {
    //return ("Negation");
    if (power.subclass && availableSubclasses.lastIndexOf(power.subclass) > -1){ // if power has a specifically written subclass
        return(power.subclass);
    }
    var mySubclass = ""
    var myDesc = power.description;
    for (shape of shapes){
        for (desc of shape.descriptions){
            if (myDesc == desc[0]){
                mySubclass = shape.subclass;
            }
        }
    }
    
    if (mySubclass == ""){ //giving a custom or incongruent cape a new class
        power['subclass'] = availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)]
        mySubclass = power.subclass
    }

    return mySubclass;
}
