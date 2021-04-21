
const effects = [
    { name: "leaving an afterimage",
        pro: ["vitality"],
        con: [],
    },
    { name: "transporting others",
        pro: ['control'],
        con: [],
    },
    { name: "conserving momentum",
        pro: ['technique'],
        con: [],
    },
    { name: "harming others nearby",
        pro: ["strength"],
        con: [],
    },
    { name: "causing fiery explosions",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "creating a short lived clone",
        pro: ["technique"],
        con: [],
    },
    { name: "remaining still in motion",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "gradually increasing in maximum speed",
        pro: ["strength"],
        con: ["vitality"],
    },
    { name: "twisting space",
        pro: ["strength","control"],
        con: ["technique"],
    },
    { name: "riding a power created object",
        pro: ["vitality","strength"],
        con: ["control"],
    },
    { name: "dragging along everyone near them",
        pro: ["control","strength"],
        con: ["technique"],
    },
    { name: "entering a breaker state for a brief moment",
        pro: ["strength", "strength"],
        con: ["control"],
    },
    { name: "carving a path that can be more easily followed in the future",
        pro: ["control","control"],
        con: ["vitality"],
    },
    { name: "rebounding back to their starting location after a few moments",
        pro: ["technique"],
        con: ["vitality"],
    },
    { name: "shattering objects they touch",
        pro: ["strength","strength"],
        con: ["control"],
    },
    { name: "creating illusionary clones that split up and converge",
        pro: ["technique", "control"],
        con: ["strength"],
    },
    {name: "transporting an entire area",
        pro: ["control", "control"],
        con: ["technique"],
    },
    {name: "entering a changer state",
        pro: ["vitality"],
        con: [],
    },
    {name: "acelerating to extreme speed",
        pro: ["control",'control'],
        con: [],
    },
    {name: "flickering in and out of existence",
        pro: ['technique','technique'],
        con: ['strength'],
    },
    {name: "gaining natural weapons when at top speed",
        pro: ["strength",'technique'],
        con: ['vitality'],
    },
    {name: "leaving behind homing projectiles ",
        pro: ["strength"],
        con: [],
    },
    {name: "splitting the ground behind them",
        pro: ['vitality'],
        con: [],
    },
    {name: "being less affected by gravity",
        pro: ["utility",'utility'],
        con: [],
    },
    {name: "they're moving fast enough",
        pro: ["control"],
        con: [],
    },
    {name: "acelerating to extreme speed",
        pro: ["utility",'utility'],
        con: [],
    }
]

const short = {
    name: "short distances",
    subclass: "Blitz",
    descriptions: [
        ["shifting personal gravity","Force"],
        ["bursts of speed","Time"],
        ["magnetizing themselves","Lightning"],
        ["blinking","Illusion"],
        ["powerful leaps","Life"],
        ["flickering in space","Illusion"],
        ["accelerating their personal passage through time","Time"],
        ["swapping two objects","Illusion"],
        ["reducing the effect of friction","Earth"],
        ['small explosions from their extremeties',"Energy"],
        ['power-created whips and grappels',"Wind"],
        ['deploying their biological aerodynamic appendages',"Wind"],
        ['instantly falling to the ground without harm',"Wind"],
        ['pulling themselves towards objects with sticky tendrils',"Wind"]
    ]
}
const long = {
    name: "long distances",
    subclass: "Infiltrator",

    descriptions: [
        ["altering their velocity","Force"],
        ["unaimed teleportation","Illusion"],
        ["storing and then releasing momenteum","Force"],
        ["reducing the friction of what they run across","Force"],
        ["bouncing off of surfaces with exactly as much momenteum as they impacted it with","Force"],
       [ "creating launch zones","Force"],
        ["firing themselves from an object","Wind"],
        ['shifting into a quadrupedal form with a lot of endurance',"Life"],
        ['leaping from ledge to ledge',"Illusion"],
        ['telescopic legs that elongate',"Life"],
        ['spring-loaded limbs',"Life","Metal"],
        ['anchoring themselves to vehicles or moving objects',"Illusion"]
    ]
}
const known = {
    name: "to known locations",
    subclass: "Infiltrator",

    descriptions: [
        ["creating traversable portals","Illusion"],
        ["flickering through space","Time"],
        ["tags they left behind that they can teleport to","Earth"],
        ["swapping places with objects they have touched","Illusion"],
        ["entering a subdimension","Earth"],
        ['teleportation that necessitates intense concentration',"Time"],
        ['retracing their steps in an energy form',"Energy","Time"],
        ['carving lines in the ground that connect one point to another',"Time"]
    ]
}
const air = {
    name: "in the air",
    subclass: "Slippery",

    descriptions: [
        ["unaided flight","Wind"],	
        ["wings of energy","Wind","Energy"],
        ["gravity manipulation","Force"],
        ["fleshy changer-esque wings","Wind","Life"],
        ["recoil from kinetic blasts","Energy","Force"]	,
        ["levitating platforms","Earth","Wind"],
        ["catching the flow of air currents","Wind"],
        ["rapid teleportation","Time"],
        ['constant warping of air',"Wind"]
    ]
}
const hazard = {
    name: "through hazards",
    subclass: "Slippery",

    descriptions: [
        ["becoming intangible","Illusion"],
        ["turning nearby solids into putty","Earth"],
        ["liquifying their body","Life"],
        ["warping personal space","Illusion"],
        ["climbing on vertical surfaces","Earth"],
        ["entering a personal subdimension","Illusion"],
        ['teleporting through objects triggered by contact',"Earth"],
        ['emitting neutralizing shockwaves as they run',"Lightning"],
        ['tunneling through solid ground',"Earth"],
        ['splitting into a horde of fast, disposable clones',"Life"]
    ]
}




const obstacles = [short,long,known,air,hazard];

const classPros = ['control','control','technique'];



var totalCombinations = []
for (obstacle of obstacles){
    for (desc of obstacle.descriptions){
        totalCombinations.push([obstacle,desc])
    }
}


exports.genInfo = (cluster) => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];

    var combo = totalCombinations[Math.floor(Math.random()*totalCombinations.length)];
    
    var obstacle = combo[0]

    var description = combo[1]

    info["power"] = "Can move "+obstacle.name+" via "+description[0]+" while "+effect.name+".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = "fists";
    info["description"] = description[0];


    if (cluster) //gathering subpowers
    {
        info['minors']= []

        info.bonus[0].splice(info.bonus[0].indexOf(classPros[2]),1,"utility")


        function filterCombos(pair){//name, description. Adds 
            for (let elem of description){
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
            var flavor = `Moves via ${minorPower}.`

            var minor = [minorPower,flavor,minorInfo[0].subclass]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
            
    }


    return info;
}

const availableSubclasses = ["Infiltrator","Slippery","Blitz"] //to check if a subclass still exists
exports.getSubclass = (power) => {
    if (power.subclass == "Rebound"){
        power.subclass = "Blitz"
    }
    if (power.subclass && availableSubclasses.lastIndexOf(power.subclass) >-1){ // if power has a specifically written subclass
        return(power.subclass);
    }
    var mySubclass = ""
    for (let obs of obstacles){
        //console.log(info[0])
        var targetStr = "Can move "+obs.name;
        if(power.info.substring(0,targetStr.length) == targetStr){
            mySubclass =obs.subclass;
        }
    }
    if (mySubclass == ""){
        console.log('no mover sub')
    }
    if (mySubclass == ""){ //giving a custom or incongruent cape a new class
        power['subclass'] = availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)]
        mySubclass = power.subclass
    }
    
    return mySubclass;
}