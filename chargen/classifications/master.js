// Template: (Summon)) (description) (shape) that (after effect).


const effects = [
    { name: "are difficult to control",
        pro: ['strength'],
        con: ['control'],
    },

    {name: "explode upon death",
        pro: ['strength'],
        con: ['vitality']
    },

    {name: "regenerate",
        pro: ['vitality'],
        con: []
    },

    {name: "share perception with the master",
        pro: ['control','utility'],
        con: []
    },

    {name: "attack anything in sight",
        pro: ['strength','vitality'],
        con: ['control']
    },

    {name: "adapt against different opponents",
        pro: ['technique','technique'],
        con: ['control'],
    },

    {name: "duplicate while fighting",
        pro: ['control','control'],
        con: ['strength'],
    },

    {
        name: "have super strength",
        pro: ['strength','strength'],
        con: ['technique']
    },

    {name: "resist parahuman attacks",
        pro: ['vitality'],
        con: []
    },

    {name: "create a hazardous environment",
        pro: ['control'],
        con: []
    },

    {name: "combine to create a better minion",
        pro: ['technique'],
        con: ['vitality']
    },

    {name: "latch onto targets",
        pro: ['strength'],
        con: []
    },

    {name: "have strategic ability",
        pro: ['technique','control','utility'],
        con: ['strength']
    },

    {name: "swap places with the master",
        pro: ['control','technique'],
        con: ['vitality'],
    },

    {name: "instinctively protect the master",
        pro: ['vitality'],
        con: []
    },

    {name: "can transport people",
        pro: ['utility',],
        con: []
    },
    {name: "manipulate their own size",
        pro: ['strength'],
        con: []
    },
    {name: "do not register pain",
        pro: ['vitality', 'vitality'],
        con: ['technique']
    },
    {name: "absorb the master's wounds",
        pro: ['vitality'],
        con: []
    },
    {name: "mirror their target's worst fears",
        pro: ['strength','strength'],
        con: ['control','vitality']
    },
    {name: "camoflauge themselves as normal objects",
        pro: ['vitality','utility'],
        con: []
    },
    {name: "produce ear-piercing noises",
        pro: ['control','utility'],
        con: []
    },
    {name: "can hide inside electronical devices",
        pro: ['control','vitality'],
        con: ['technique']
    },
    {name: "can have random mutations",
        pro: ['strength','vitality'],
        con: ['utility','technique']
    },
    {name: "coordinate remotely using high frequency transmissions",
        pro: ['control','control'],
        con: []
    },
    {name: "can temporarily lend their powers to the master",
        pro: ['vitality','vitality','vitality'],
        con: ['utility','utility']
    },
    {name: "can siphon energy to regenerate and power up",
        pro: ['vitality','strength'],
        con: ['control','control']
    },
    {name: "tend to fight between themselves",
        pro: ['strength'],
        con: ['utility']
    },
    {name: "can fit through extremely narrow gaps",
        pro: ['technique'],
        con: []
    },
    {name: "adapt to their environment by evolving in real time",
        pro: ['control','utility'],
        con: []
    }



];

const desc = [

    ["giant","Anchor","Force"],
    ["sentient","Anchor","Life"],
    ["short-lived","Trample","Toxic"],
    ["small","Swarm","Toxic"],
    ["rampaging","Swarm","Force"],
    ["phantasmal","Swarm","Illusion"],
    ["shining","Anchor","Light"],
    ["swarms of","Trample","Wind"], //needs elem
    ["customizable","Anchor","Illusion"],
    ["flaming","Swarm","Fire"],
    ["frozen","Trample","Water"],
    ["dark","Trample","Dark"],
    ["mutated","Anchor","Dark","Life"],
    ["translucent","Swarm","Illusion"],

    ['mechanical',"Anchor","Metal","Lightning"]
  ,  ['hardlight',"Anchor","Light"]
  ,  ['terrifying',"Trample","Dark"]
  ,  ['lumbering',"Swarm","Force"]
  ,  ['space-warping',"Trample","Illusion"]
  ,  ['hollow',"Anchor","Dark"]
  ,  ['malevolent',"Anchor","Dark"]

  ,  ['magnetic',"Swarm","Lightning"]
  ,  ['glowing',"Anchor","Light","Energy"]
  ,  ['invisible',"Swarm","Illusion"]
  ,  ['silent',"Swarm","Force"]
  ,  ['icey',"Trample","Water"]
  ,  ['explosive',"Swarm","Energy","Fire"]
  ,  ['fleshy',"Anchor","Life"]
  ,  ['necrotic',"Trample","Dark","Life"]
  ,  ['imploding',"Trample","Energy","Illusion"]
  ,  ['quick',"Swarm","Wind"]
  ,  ['heavy',"Anchor","Force"]
  ,  ['magma',"Trample","Earth","Fire"]
  ,  ['watery',"Swarm","Water"]
  ,  ['rock',"Swarm","Earth"]
  , [ 'wind',"Swarm"]
  ,  ['eldritch',"Trample","Illusion"]
  ,  ['steel',"Anchor","Metal"]
  ,  ['razor',"Swarm","Metal"]
  ,  ['cloth',"Trample","Life"]
  ,  ['muscle',"Anchor","Life","Force"]
  ,  ['bone',"Anchor","Life"]
  ,  ['metalic',"Anchor","Metal"]
  ,  ['vaccuum',"Trample","Dark"]
  ,  ['void',"Trample","Dark"]
  ,  ['radioactive',"Swarm","Toxic","Energy"]
  , [ 'sand',"Trample","Wind","Earth"]
  , [ 'plastic',"Anchor","Toxic"]
  , [ 'soot',"Trample","Earth"]
  , [ 'dust',"Trample","Earth","Wind"]
  , [ 'stretchy',"Trample","Illusion"]
  , [ 'crawling',"Swarm","Earth"]
  , [ 'floating',"Swarm","Wind"]
  , [ 'polygonal',"Anchor","Illusion"]
  , [ 'clusters of',"Anchor","Wind"]
  , [ 'rubbery',"Anchor","Life"]
  , [ 'groups of',"Trample","Wind"]
  , [ 'babbling',"Anchor","Dark"]
  , [ 'leaping',"Swarm","Wind"]
  , [ 'winged',"Swarm","Wind"]
  , [ 'skittering',"Trample","Water"]
  , [ 'mindless',"Swarm","Dark"]
  , [ 'hordes of',"Trample","Dark"]
  , [ 'scarred',"Anchor","Life"]
  , [ 'ghostly',"Swarm","Illusion"]
  , [ 'telekinetically animated',"Anchor","Force"]
  , [ 'protective',"Anchor","Force"]
  , [ 'self-replicating',"Swarm","Wind"]
  , [ 'gooey',"Trample","Toxic"]
  , [ 'slithering',"Swarm","Toxic"]
  , [ 'armored',"Anchor","Metal","Earth"]
  , [ 'crystalline',"Anchor","Earth","Light"]


]

const minions = [
    "humans",
    "dinosaurs",
    "goblins",
    "insects",
    "spirits",
    "elementals",
    "cronenberg monsters",
    "undead",
    "animals",
    "statues",
    "plants",
    "clones",
    "golems",
    "demons",
    "mites",
    "puppets",
    "projections",
    "robots",
    "birds of prey",
    "carnivores",
    "angels",
    "reptiles",
    "oozes",
    "fairies",
    'aliens',
    'skeletons',
    'orcs',
    'objects',
    'panthers',
    'brain-robots',
    'single-celled organisms',
    'invertebrates',
    'constructs',
    'dogs',
    'bogeymen',
    'doodles',
    'hands',
    'crabs',
    'silhouettes',
    'rats',
    'duplicates',
    'suits of armor',
    'toys',
    'clowns',
    'fossils',
    'plant-hybrids',
    'caricatures',
    'monsters',
    'ghouls',
    'bulls',
    'snakes',
    'alligators',
    'gargoyles',
    'spiders',
    'cats',
    'wolves'
]

const summons = [
"Grows",
"Controls",
"Summons",
"Births",
"Directs",
"Builds",
"Orders",
"Materializes",
'Sprouts',
'Transforms objects into',
'Turns people into',
'Hatches',
'Duplicates',
'Manufactures',
'Deploys',
'Calls forth',
'Gathers',
'Commands',
'Leads',
'Puppeteers',
'Coordinates',
'Governs'
]

const classPros = ['control','control','utility'];
const availableSubclasses = ["Trample","Swarm","Anchor"] //to check if a subclass still exists

exports.genInfo = (cluster) => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var minion = minions[Math.floor(Math.random()*minions.length)];
    var summon = summons[Math.floor(Math.random()*summons.length)];
    var description = desc[Math.floor(Math.random()*desc.length)];

    info["power"] = summon+" " + description[0] + " " + minion + " that " + effect.name + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = minion;
    info["description"] = description[0];

    if (cluster) //gathering subpowers
    {
        info['minors']= []

        

        function filterCombos(pair){//name, description. Adds 
            for (let elem of description){
                for (let elem2 of pair){
                    if (availableSubclasses.indexOf(elem)==-1 && elem2.toLowerCase() == elem.toLowerCase()){
                        return true;
                    }
                }
            }
        }
        var possibleCombinations = desc.filter(filterCombos);

        for (let i = 0; i<cluster;i++){
            var minorInfo = possibleCombinations[Math.floor(Math.random()*possibleCombinations.length)];

            var minorPower = minorInfo[0].toLowerCase()+" minions";
            var flavor = `${summons[Math.floor(Math.random()*summons.length)]} ${minorPower.toLowerCase()}.`

            var minor = [minorPower,flavor,minorInfo[1]]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
            
    }

    return info;
}

exports.getSubclass = (power) => {
    if (power.minion){
        return 'Human';
    }
    //return("Swarm")
    //console.log(power)
    if (power.subclass && availableSubclasses.lastIndexOf(power.subclass) > -1 ){ // if power has a specifically written subclass
        //console.log('has previous subclass')
        return(power.subclass);
    }
    var mySubclass = ""
    
    var firstSpace = power.info.indexOf(" ");
    var summon = power.info.substring(0,firstSpace)
    //console.log("my summon: "+summon)
    for (tbl of desc){
       // console.log(tbl)
        //console.log(info[0])
        var targetStr = summon+" "+tbl[0];
        if(power.info.substring(0,targetStr.length) == targetStr){
            mySubclass = tbl[1];
            //console.log("found master sub")
        }
    }
    if (mySubclass == ""){
        //console.log('no master sub')
    }
    if (mySubclass == ""){ //giving a custom or incongruent cape a new class
        power['subclass'] = availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)]
        mySubclass = power.subclass
    }
    
    return mySubclass;
}


exports.attackFlavor = (cape,targetList,resultList,retaliation)=>{
    if (cape.minion){
        var txt = `${cape.name} attacks ${targetList[0].name}`
        return txt;
    }

    var mySub = cape.battlestats.subclass[0];
    //console.log('checking flavor')
    if (retaliation){
        mySub = 'Retaliation'
    }
    var myMinion = cape.power.shape;//default for customs and 
    
    var myFlavor = ""

    switch(mySub){
        case("Swarm"):
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
            myFlavor = `${cape.name}'s ${myMinion} charge ${struckTargets}`
            break;
        case("Anchor"):
            myFlavor = `${cape.name} attacks ${targetList[0].name} alongside their ${myMinion}`
            break;
        case("Trample"):
            myFlavor = `${cape.name}'s ${myMinion} pile onto ${targetList[0].name}`
            break;
        case("Retaliation"):
            myFlavor = `${cape.name}'s ${myMinion} regroup and rush ${targetList[0].name}`
    }
    return myFlavor;
}

exports.getSidekickData = (cape)=>{
    var minion = {
        ["name"]: cape.name+"'s minion",
        ['class']: 'Master',
        ['power']: {
            ['shape']: 'body',
            ['minion']: true,
        },
        ['minion']: true,
        ['strength']: 2,
        ['vitality']: 2,
        ['utility']: 2,
        ['control']: 2,
        ['technique']: 2,

    }
    return(
        minion
    )
}