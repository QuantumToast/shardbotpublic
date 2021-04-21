// Template: Shoots (description) (shape) from (source) that (after effect)
/* Subclasses:
Artillery	    UTL vs CTR to turn ghost someone each round
Suppression	    Debuff after missing
Nuker	        Attacks multiple  targets with UTL


*/

// sources
const sources = [
    "their eyes",
    "their mouth",
    "their hands",
    "their kicks",
    "their hair",
    "touched objects",
    "floating globes",
    "a weapon",
    "random points nearby",
    "their glowing aura",
    "their chest",
    "a halo",
    "anywhere within sight",
    "a mobile source",
    "an emplacement turret",
    'another person',
    'directly overhead',
    'turrets on their shoulder',
   'the ground'
];

const effects = [
    { name: "are heat seaking",
        pro: ['technique'],
        con: [],
    },

    {name: "return after being shot",
        pro: ['strength'],
        con: []
    },

    {name: "can be charged up for more powerful effects",
        pro: ['strength','strength'],
        con: ['technique'],
    },

    {name: "teleport targets a short distance",
        pro: ['utility'],
        con: []
    },

    {name: "burst on contact",
        pro: ['control'],
        con: []
    },

    {name: "create a tether to targets",
        pro: ['utility','utility'],
        con: ['strength'],
    },

    {name: "stick to targets",
        pro: ['strength','strength'],
        con: ['vitality'],
    },

    {
        name: "knock targets back",
        pro: ['strength','control'],
        con: ['utility']
    },

    {name: "confuse and befuddle",
        pro: ['control', 'control'],
        con: ['strength']
    },

    {name: "alter the composition of targets",
        pro: ['utility'],
        con: []
    },

    {name: "pass through inorganic matter",
        pro: ['technique'],
        con: []
    },

    {name: "alter physical laws",
        pro: ['utility','utility'],
        con: ['technique']
    },

    {name: "duplicate soon after use",
        pro: ['control', 'strength'],
        con: ['technique']
    },

    {name: "inflict ongoing damage targets",
        pro: ['strength'],
        con: [],
    },

    {name: "slow the target",
        pro: ['control','technique'],
        con: ['vitality']
    },

    {name: "mark targets for future hits",
        pro: ['technique'],
        con: []
    },

    {name: "mess with target's size",
        pro: ['utility'],
        con: []
    },
    {name: "alter emotion",
        pro: ['vitality'],
        con: []
    },
    {name: "create hazard areas upon hit",
        pro: ['control','strength'],
        con: ['technique']
    },
    {name: "create a temporary clone of the target",
        pro: ['control'],
        con: ['technique']
    },
    {name: "causes chain reactions of shots",
        pro: ['technique','utility'],
        con: ['strength']
    },
    {name: "cover anything they hit in oily liquid",
        pro: ['control'],
        con: []
    },
    {name: "expand once they hit something",
        pro: ['utility','utility'],
        con: []
    },
    {name: "grow larger the further they travel",
        pro: ['utility','control'],
        con: ['strength']
    }
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



const globes = {
    name: "globes",
    subclass: "Artillery",
    descriptions: [
        ["flashbang","Light"]
        ,["lightning","Lightning"]
        ,["fire","Fire"]
        ,["ice","Water"]
        ,["steel","Metal"]
        ,["napalm", "Fire","Toxic"]
        ,["smoke", "Wind"]
        ,["writhing flesh", "Life"]
        ,["acid", "Toxic"]
        ,["water", "Water"]
        ,["darkness", "Dark"]
        ,["black hole", "Dark","Force"]
        ,["adhessive slime", "Toxic"]
        ,["compressed air", "Wind","Force"]
        ,["molten metal", "Fire","Metal"]
        ,["blood", "Life"]
        ,["bone", "Life"]
        ,["fragile crystal", "Earth"]
        ,["frozen time", "Time"]
        ,["gas", "Wind", "Toxic"]
        ,["metal", "Metal"]
        ,['gelatin', "Toxic"]
        ,['giant eye', "Life"]
        ,['lumpy stone', "Earth"]
        ,['melting plastic',"Toxic","Fire"]


    ]
}

const particles = {
    name: "particles",
    subclass: "Suppression",
    descriptions: [
        ["sand","Earth"]
        ,["dust","Earth"]
        ,["ash","Earth"]
        ,["glass","Illusion"]
        ,["radioactive","Toxic"]
        ,["glowing", "Toxic","Light"]
        ,["soil","Earth"]
        ,["razor","Metal"]
        ,["darkness","Dark"]
        ,["disintegration","Toxic","Time"]
        ,["crystal", "Earth","Light"]
        ,["spore","Life"]
        ,["corrosive","Toxic","Life"]
        ,["pain","Life","Toxic"]
        ,["electrical static","Lightning"]
        ,["dirt","Earth"]
        ,['polluted',"Toxic","Wind"]
        ,['self-igniting',"Fire","Energy"]
        ,['expanding',"Force"]
        ,['ultrafine',"Metal","Wind"]
        ,['hardlight',"Light"]
    ]
}

const slivers = {
    name: "slivers",
    subclass: "Suppression",
    descriptions: [
         ["steel","Metal"]
        ,["light","Light"]
        ,["force","Force"]
        ,["glass","Illusion"]
        ,["bone","Life"]
        ,[ "darkness","Dark"]
        ,["ice","Water"]
        ,["wood","Life"]
        ,["void","Dark","Illusion"]
        ,["fabric","Life","Earth"]
        ,["wire","Metal"]
        ,['superheated',"Metal","Fire"]
        ,['ephemereal',"Illusion"]
        ,['arrowhead',"Force"]
        ,['barbed',"Metal"]
        ,['hardlight',"Light"]
    ]
}

const beams = {
    name: "beams",
    subclass: "Artillery",
    descriptions: [
         ["light","Light"]
       , ["concussive","Force"]
       , ["force","Force"]
       , ["cold","Water"]
       , ["disintegration","Toxic","Time"]
       , ["refracted space","Illusion"]
       , ["darkness","Dark"]
       , ["emotion","Life","Energy"]
       , ["radiation","Toxic","Energy"]
       , ["heat","Fire"]
       , ["vacuum","Force"]
       , ['zigzagging',"Force"]
       , ['prismatic',"Light","Illusion"]
       , ['twisting',"Wind","Illusion"]
       , ['split',"Wind","Illusion"]
    ]
}

const blasts = {
    name: "blasts",
    subclass: "Artillery",
    descriptions: [
        ["concussive","Force"]
        ,["force","Force"]
        ,["electric","Lightning"]
        ,["fire","Fire"]
        ,["entropy", "Energy"]
        ,["darkness","Dark"]
        ,["sonic","Illusion","Wind"]
        ,["toxic gas","Toxic","Wind"]
        ,["gravity","Force"]
        ,["space distortion","Illusion"]
        ,["time distortion","Time"]
        ,["flesh","Life"]
        ,["blood","Life"]
        ,["meteorite","Earth","Fire","Metal"]
        ,["junk","Toxic","Metal"]
        ,["laser","Light","Energy"]
        ,["gas","Toxic","Wind"]
        ,["metal","Metal"]
        ,["stasis","Time"]
        ,['delayed',"Time"]
        ,[ 'exponential',"Energy"]
        ,['viscous',"Toxic"]
    ]
}


const waves = {
    name: "waves",
    subclass: "Nuker",
    descriptions: [
        ['water',"Water"]
       , ['sand',"Earth"]
       , ['heat',"Fire"]
       , ['concussive force',"Force"]
       , ['light',"Light"]
       , ['darkness',"Dark"]
       , ['burning fog',"Fire","Wind"]
       , ['fear',"Illusion","Dark"]
       , ['earth',"Earth"]
       , ['pain',"Toxic","Life"]
       , ['noise',"Illusion","Lightning"]
       , ['meat',"Life"]
       , ['EMP',"Lightning"]
       , ['crystal shard',"Light","Earth"]
       , ['skin',"Life"]
       , ['trash',"Toxic"]
       , ['gas',"Wind","Toxic"]
       , ['vapor',"Wind","Water"]
       , ['stalagmite',"Earth","Water"]
       , ['spike',"Earth","Metal"]
       , ['ground',"Earth"]
       , ['pressure',"Force"]
    ]
}

const arcs = {
    name: "arcs",
    subclass: "Nuker",
    descriptions: [
        ['plasma',"Lightning","Energy","Fire"]
       , ['lightning',"Lightning"]
       , ['flashing light',"Light","Energy"]
       , ['primsatic lights',"Light"]
       , ['warped time',"Time",]
       , ['hardlight',"Light"]
       , ['voltaic',"Lightning"]
       , ['energy',"Energy"]
    ]
}

const streams = {
    name: "streams",
    subclass: "Suppression",
    descriptions: [
        ['plasma',"Lightning","Energy","Fire"]
       , ['wind']
       , ['fire']
       , ['napalm',"Fire","Toxic"]
       , ['electricity',"Lightning"]
       , ['blood',"Life"]
       , ['webbing',"Illusion"]
       , ['gas',"Wind","Toxic"]
       , ['mud',"Earth","Water"]
       , ['ink',"Water"]
       , ['boiling acid',"Fire","Toxic"]
       , ['slime',"Life","Toxic"]
       , ['oil',"Life","Toxic","Water"]
       , ['data',"Lightning","Illusion"]
       , ['water']
    ]
}

const uniques = {
    name: "",
    subclass: "Nuker",

    descriptions: [
        ["chunks of ground","Earth"]
        ,["archaic runes","Illusion","Energy"]
        ,["chaotic energy","Energy","Toxic"]
        ,["tentacles","Life"]
        ,["random elements","Energy"]
        ,['flechette storms',"Metal"]
        ,['parasitic critters',"Life"]
        ,['nearby miscellaneous objects',"Metal","Earth"]
    ]
}

const shapes = [globes,particles,slivers,beams,blasts,waves,arcs,streams,uniques];

const classPros = ['strength','strength','control'];


var totalCombinations = []
for (let shape of shapes){
    for (let desc of shape.descriptions){
        totalCombinations.push([shape,desc])
    }
}


exports.genInfo = (cluster) => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];

    var combo = totalCombinations[Math.floor(Math.random()*totalCombinations.length)];

    var shape = combo[0].name

    var description = combo[1][0]
    var source = sources[Math.floor(Math.random()*sources.length)]
    
    info["power"] = "Fires " + description + " " + shape + " from " + source + " that " + effect.name + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = shape;
    if (shape == ""){
        info.shape = description
    }
    info["description"] = description;


    if (cluster) //gathering subpowers
    {
        info['minors']= [];

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
            var flavor = `Shoots ${minorPower}.`
            if (minorInfo[0].name == minorInfo[1][0]){
                minorPower = minorInfo[1][0]
                flavor = "Shoots "+minorInfo[1][0]+"."
            }
            var minor = [minorPower,flavor,minorInfo[0].subclass]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
            
    }



    return info;
}


const availableSubclasses = ["Nuker","Artillery","Suppression"] //to check if a subclass still exists
exports.getSubclass = (power) => {
    //return ("Artillery");
    if (power.subclass && availableSubclasses.lastIndexOf(power.subclass) > -1){ // if power has a specifically written subclass
        return(power.subclass);
    }
    var mySubclass = ""
    var myShape = power.shape;
    for (shape of shapes){
        if (myShape == shape.name){
            mySubclass = shape.subclass;
        }
    }
    //checking if its a unique
    if (myShape = power.description){
        switch(power.description){
            case("chunks of ground"):
                mySubclass = "Artillery"
                break;
            case("archaic runes"):
                mySubclass = "Nuker"
                break;
            case("chaotic energy"):
                mySubclass = "Nuker"
                break;
            case("tentacles"):
                mySubclass = "Suppression"
                break;
            case("random elements"):
                mySubclass = "Suppression"
                break;
            case("flechette storms"):
                mySubclass = "Nuker"
                break;
            case("parasitic critters"):
                mySubclass = "Suppression"
                break;
        }
    }
    if (mySubclass ==""){ //giving a custom or incongruent cape a new class
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
    var blast = cape.power.shape;//default for customs and 
    for (shape of shapes){
        if (blast == shape.name && shape.name != ""){

            var desc = cape.power.info.substring(6,cape.power.info.indexOf(shape.name)-1)
            //console.log(`desc: [${desc}]`)
            blast = desc+" "+blast;
        }
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
            myFlavor = `${cape.name} blasts ${struckTargets} with ${blast}`
            break;
        case("Artillery"):
            myFlavor = `${cape.name} snipes ${targetList[0].name} with ${blast}`
            break;
        case("Suppression"):
            myFlavor = `${cape.name} sends a barrage of ${blast} at ${targetList[0].name}`
            break;
        case("Retaliation"):
            myFlavor = `${cape.name} shoots ${blast} back at ${targetList[0].name}`
    }
    return myFlavor;
}