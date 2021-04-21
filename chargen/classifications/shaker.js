// Template: Generates (description) (shape) that (after effect)

// note: The Plural property is actually for the singular form, im a dumbass
const effects = [
    { name: "blind on contact",
    plural: "blinds on contact",
        pro: ['control'],
        con: [],
    },

    {name: "restrict targets",
    plural: "restricts targets",
        pro: ['technique'],
        con: []
    },

    {name: "reactivly protects themself",
        pro: ['vitality',],
        con: [],
    },

    {name: "linger in the air",
    plural: "lingers in the air",
        pro: ['strength'],
        con: []
    },

    {name: "draw people in",
    plural: "draws people in",
        pro: ['utility'],
        con: []
    },

    {name: "do not affect themselves",
        pro: ['technique'],
        con: ['utility'],
    },

    {name: "spawn from the environment",
        plural: "spawns from the environment",
        pro: ['control','strength'],
        con: ['technique'],
    },

    {
        name: "overwrite the environment",
        
        plural: "overwrites the environment",
        pro: ['strength','technique'],
        con: ['utility']
    },

    {name: "increase in size when they are injured",
    plural: "increases in size when they are injured",
        pro: ['strength'],
        con: ['control']
    },

    {name: "ignore allies",
    plural: "ignores allies",
        pro: ['utility','control'],
        con: ['strength']
    },

    {name: "can be directed after creation",
        pro: ['technique', 'technique'],
        con: ['vitality']
    },

    {name: "grant perception of the covered area",
    plural: "grants perception of covered areas",
        pro: ['utility'],
        con: []
    },

    {name: "cause energy fluctuations",
        pro: ['strength'],
        con: ['control']
    },

    {name: "leak out when under stress",
    plural: "leaks out when under stress",
        pro: ['vitality'],
        con: ['control'],
    },

    {name: "can be absorbed for sustenance",
        pro: ['vitality','vitality'],
        con: ['strength']
    },

    {name: "trap people inside",
    plural: "traps people inside",
        pro: ['control','control'],
        con: ['strength']
    },
    
    {name: "follow them around",
    
    plural: "follows them around",
        pro: ['vitality',],
        con: ['utility']
    },
    {name: "cover an immense area",
    
        plural: "covers an immense area",
        pro: ['control','control'],
        con: ['technique']
    },
    {name: "grow smaller but more intense",
    
        plural: "grows smaller but more intense",
        pro: ['strength'],
        con: ['technique']
    },
    {name: "connect to each other",
        
        plural: "connects to each other",
        pro: ['utility'],
        con: []
    },
    {name: "expand over time",
        plural: "expands over time",
        pro: ['strength'],
        con: ['control']
    },
    {name: "null powers",
        plural: "nulls powers",
        pro: ['technique','vitality'],
        con: ['strength']
    },
    {name: "create horrifying master minions",
        plural: "creates horrifying master minions",
        pro: ['control','control'],
        con: ['vitality']
    },
    {name: "grant the cape knowledge about people affected",
        plural: "grants the cape knowledge about people affected",
        pro: ['control','utility'],
        con: []
    },
    {name: "remain permanently",
        plural: "remains permanently",
        pro: ['control','vitality'],
        con: ['technique']
    },
    {name: "explode violently after a period of time",
        plural: "explodes violently after a period of time",
        pro: ['strength','strength'],
        con: ['technique']
    },
    {name: "overwrite the senses",
        plural: "overwrites the senses",
        pro: ['technique'],
        con: []
    },
    {name: "cause hallucinations",
        plural: "causes hallucinations",
        pro: ['control'],
        con: []
    },
    {name: "dreg up traumas and weak points",
        plural: "dregs up traumas and weak points",
        pro: ['strength'],
        con: []
    },
    {name: "leave long lasting damage",
        plural: "leaves long lasting damage",
        pro: ['strength'],
        con: ['utility']
    },
    {name: "alter emotions",
        plural: "alters emotions",
        pro: ['control','technique'],
        con: ['utility']
    },
    {name: "become stronger where they overlap",
        plural: "becomes stronger where it overlaps",
        pro: ['strength','utility'],
        con: ['control']
    },
    {name: "are centered around the cape",
        plural: "is centered around the cape",
        pro: ['vitality'],
        con: []
    },
    {name: "fluctuate in strength in an unpredictable way",
        plural: "unpredictably fluctuates in strength",
        pro: ['control','strength'],
        con: ['technique']
    },
    {name: "turn the environment into exotic materials",
        plural: "turns the environment into exotic materials",
        pro: ['control','utility'],
        con: ['strength']
    },
    
    {name: "turn the environment into dust that quickly erodes",
        plural: "turns the environment into dust that quickly erodes",
        pro: ['strength','control'],
        con: ['utility']
    },
    {name: "only activate when something enters their range",
        plural: "only activates when something enters their range",
        pro: ['strength','control'],
        con: ['utility']
    },

];

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

const clouds = {
    name: "clouds",
    subclass: "Nuker",

    descriptions: [ //name , elements
        ["darkness","Dark"],
        ["fire","Fire"],
        ["toxic","Toxic"],
        ["mist","Water"],
        ["ash","Earth"],
        ["twisting","Wind"],
        ["clear","Light","Wind"],
        ["static","Lightning"],
        ["acidic","Toxic"],
        ["explosive","Energy","Fire"],
        ["superheated gas","Fire","Toxic"],
        ["hyperdense","Force"],
        ["hallucinogenic","Illusion","Toxic"],
        ['storm',"Lightning","Wind"],
        ['nuclear',"Energy","Fire"],
        ['sandstorm',"Earth"]
    ]
}
const fissures = {
    name: "fissures",
    subclass: "Environment",

    descriptions: [
        ["magma","Fire","Earth"],
        ["ground","Earth"],
        ["watery","Water"],
        ["reality","Illusion"],
        ["crackling","Lightning"],
        ["shining","Light"],
        ["explosive","Energy"],
        ["hydrothermal","Water","Fire"],
        ["bottomless","Dark"],
        ["gas-spewing","Toxic","Wind"],
        ['non-euclidian',"Illusion"]
    ]
}
const fields = {
    name: "fields",
    subclass: "Environment",

    descriptions: [
        ["bladed","Metal"],
        ["sound","Illusion"],
        ["light","Light"],
        ["gale","Wind"],
        ["gravity","Force"],
        ["fire","Fire"],
        ["swamp","Earth","Water"],
        ["ice","Water",],
        ["entropic","Energy"],
        ["friction","Force"],
        ["explosive","Energy","Fire"],
        ["laser","Light","Energy","Illusion"],
        ["tripwire","Metal","Illusion"],
        ['mazelike',"Illusion"]
    ]
}
const explosions = {
    name: "explosions",
    subclass: "Nuker",

    descriptions: [
        ["light","Light"],
        ["heat","Fire"],
        ["warped space","Illusion"],
        ["sound","Illusion"],
        ["time","Illusion","Time"],
        ["electric","Lightning"],
        ["concussive","Force"],
        ["rubble","Earth"],
        ["water","Water"],
        ["ice","Water"],
        ["SUPER EXPLOSIVE","Energy","Fire","Lightning"],
        ["mind-blowing","Illusion"],
        ["slow-motion","Illusion"],
        ['nuclear',"Energy"],
        ['shadow',"Dark"]
    ]
}
const walls = {
    name: "walls",
    subclass: "Siege",

    descriptions: [
        ["crystal","Earth","Metal"],
        ["ice","Water"],
        ["metal","Metal"],
        ["glass","Earth","Fire"],
        ["flesh","Life"],
        ["lightning","Lightning"],
        ["fire","Fire"],
        ["sandstone","Earth"],
        ["earth","Earth"],
        ["hardlight","Light"],
        ["compressed air","Wind"],
        ["plastic","Toxic"],
        ["clay","Earth"],
        ["shifting","Illusion"],
        ["forest","Life"],
        ["barbed","Metal"],
        ['illusionary',"Illusion"]

    ]
}
const ripples = {
    name: "ripples",
    subclass: "Nuker",

    descriptions: [
        ["gravity","Force"],
        ["heat","Fire"],
        ["force","Force"],
        ["light","Light"],
        ["darkness","Dark"],
        ["cold","Water","Wind"],
        ["earthquake","Earth"],
        ["exploding","Energy"],
        ["distortion","Illusion"],
        ['reality',"Illusion"],
        ['twisting',"Wind"]
    ]
}
const portals = {
    name: "portals",
    subclass: "Siege",

    descriptions: [
        ["black hole","Force","Dark"],
        ["light","Light"],
        ["time","Time"],
        ["looping","Illusion","Time"],
        ["plasma","Fire","Lightning","Energy"],
        ["disorienting","Illusion"],
        ["acceleration","Time"],
        ["floating","Wind"],
        ["garbage","Toxic"],
        ['unstable',"Energy"],
        ['abrasive',"Toxic"]

    ]
}
const controlOver = {
    name: "control",
    subclass: "Nuker",

    descriptions: [
        ["metal","Metal"],
        ["water","Water"],
        ["stone","Earth"],
        ["fire","Fire"],
        ["air","Wind"],
        ["space","Illusion"],
        ["electricity","Lightning"],
        ["explosions","Energy","Fire"],
        ["hardlight","Life"],
        ["sand","Earth"],
        ["wood","Life"],
        ["sound waves","Illusion"],
        ['time',"Time"],
        ['elements',"Metal","Earth","Toxic"],
        ['motion',"Force"],
        ['ice',"Water"],
        ['shadow',"Dark"],
    ]
}

const shapes = [
    clouds,
    fissures,
    fields,
    explosions,
    walls,
    ripples,
    controlOver,

    portals
];

const classPros = ['control','control','strength'];


var totalCombinations = []
for (let shape of shapes){
    for (let desc of shape.descriptions){
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
    var desc = shape.descriptions[Math.floor(Math.random()*shape.descriptions.length)];

    return ([desc,shape.name])

}


exports.genInfo = (cluster) => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];

    var combo = totalCombinations[Math.floor(Math.random()*totalCombinations.length)];

    var shape = combo[0].name;

    var description = combo[1][0];
    if (shape != "control"){
        info["power"] = "Generates " + description + " " + shape + " that " + effect.name + ".";
        info["shape"] = shape;
    }
    else{
        info["power"] = "Has " + description+ " control that " + (effect.plural || effect.name) + ".";
        info["shape"] = description;
    }
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["description"] = description;

    if (cluster) //gathering subpowers
    {
        info['minors']= []
        info.bonus[0].splice(info.bonus[0].indexOf(classPros[2]),1,"utility")
        
        function filterCombos(pair){//name, description. Adds 
            for (let elem of combo[1]){
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
            var flavor = `Creates ${minorPower}.`
            if (minorInfo[0].name == 'control'){
                flavor = "Controls "+minorInfo[1][0]+"."
            }
            var minor = [minorPower,flavor,minorInfo[0].subclass]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
            
    }

    return info;
}

const availableSubclasses = ["Nuker","Environment","Siege"] //to check if a subclass still exists
exports.getSubclass = (power) => {
    //return ("Nuker");
    if (power.subclass && availableSubclasses.lastIndexOf(power.subclass) >-1){ // if power has a specifically written subclass
        return(power.subclass);
    }
    var mySubclass = ""
    var myShape = power.shape;
    for (shape of shapes){
        if (myShape == shape.name){
            mySubclass = shape.subclass;
        }
    }

    if (mySubclass ==""){
        //check if its a control variant
        for (element of controlOver.descriptions){
            if (element[0] == myShape){
                mySubclass = "Nuker"
            }
        }
    }
    if (mySubclass==""){ //giving a custom or incongruent cape a new class
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
    var shakerZone = cape.power.shape;//default for customs and 
    
    for (let shape of shapes){
        if (shakerZone == shape.name && shape.name != "control"){
            var desc = cape.power.info.substring(10,cape.power.info.indexOf(shape.name)-1)
            //console.log(`desc: [${desc}]`)
            shakerZone = desc+" "+shakerZone;
        }
    }
    var kinesis = false;
    if (shakerZone == cape.power.shape){
        kinesis = true;
    }else if (shakerZone == cape.power.shape){ // customs
        shakerZone = cape.power.description + " " +cape.power.shape
    }

    var myFlavor = ""
    
    switch(mySub){
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
            if (kinesis == false){
                myFlavor = `${cape.name} aims ${shakerZone} at ${struckTargets}`
            }else{
                myFlavor = `${cape.name} uses their control over ${shakerZone} to attack ${struckTargets}`
            }
            break;
        case("Environment"):
            myFlavor = `${cape.name}'s ${shakerZone} crash against ${targetList[0].name}`
            break;
        case("Siege"):
            myFlavor = `${cape.name}'s ${shakerZone} corner ${targetList[0].name}`
            break;
        case("Retaliation"):
            if (kinesis == false){
                myFlavor = `${cape.name} manifests ${shakerZone} back at ${targetList[0].name}`
            }else{
                myFlavor = `${cape.name} retaliates against ${targetList[0].name} with ${shakerZone}`
            }
    }
    return myFlavor;
}

