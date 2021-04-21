// Template: Changes (transformation) into a (description)(form) form with (bonus)

const effects = [
    { name: "enhanced perception",
        pro: ["utility"],
        con: [],
    },
    { name: "fast regeneration",
        pro: ["vitality"],
        con: [],
    },

    { name: "an alien mind",
        pro: ["technique"],
        con: ["control","utility"],
    },

    { name: "flight capability",
        pro: ["control","utility"],
        con: [],
    },

    { name: "adaptive mutations",
        pro: ["vitality"],
        con: ["control"],
    },

    { name: "environmental adaptations",
        pro: ["control"],
        con: ["strength"],
    },

    { name: "blaster capabilities",
        pro: ["strength","control"],
        con: ["technique"],
    },

    { name: "super strength",
        pro: ["strength", "strength"],
        con: ["technique"],
    },

    { name: "camouflage",
        pro: ["vitality","technique"],
        con: ["control","control"],
    },

    { name: "destructive striker properties",
        pro: ["strength"],
        con: ["utility"],
    },
    { name: "enhanced speed",
        pro: ["control"],
        con: [],
    },
    { name: "natural weaponry",
        pro: ["technique"],
        con: [],
    },
    { name: "a deadly bite",
        pro: ["strength"],
        con: [],
    },
    { name: "stretchable appendages",
        pro: ["utility","technique"],
        con: ["strength"],
    },
    { name: "more tentacles than limbs",
        pro: ["technique",'strength'],
        con: ['vitality'],
    },
    { name: "enhanced durability",
        pro: ["vitality"],
        con: [],
    },
    { name: "incredible sharpness",
        pro: ["strength"],
        con: [],
    },
    { name: "mass emotional control abilities",
        pro: ["utility",'control'],
        con: [],
    },
    { name: "an advanced danger sense",
        pro: ["technique"],
        con: [],
    },
    { name: "the ability to birth tiny horrifying versions of themselves",
        pro: ["control",'control'],
        con: ['vitality'],
    },
    { name: "pyrokinesis",
        pro: ["strength",'control'],
        con: ['technique'],
    },
    { name: "cryokinesis",
        pro: ["technique"],
        con: ['vitality'],
    },
    { name: "electrokinesis",
        pro: ["technique"],
        con: [],
    },
    { name: "hundreds of eyes across its entire body",
        pro: ["control",'technique'],
        con: ['vitality'],
    },
    { name: "sticky feet that let it crawl on walls and ceilings",
        pro: ["control",'utility'],
        con: [],
    },
    { name: "the ability to roughly impersonate others",
        pro: ["utility",'technique'],
        con: [],
    },
    { name: "the ability to shed its skin",
        pro: ["vitality"],
        con: [],
    },
    { name: "bioluminescence",
        pro: ["utility"],
        con: [],
    },
    { name: "whirling drill-claws",
        pro: ["strength"],
        con: [],
    },
    { name: "sensitive antennae",
        pro: ["technique"],
        con: [],
    },
    { name: "fluid-filled cysts that burst violently",
        pro: ["strength",'strength'],
        con: ['vitality'],
    },
    { name: "a lethal acid spray",
        pro: ["strength"],
        con: [],
    },
    { name: "echolocation",
        pro: ["technique",'control'],
        con: ['strength'],
    },
    { name: "thermal vision",
        pro: ["technique"],
        con: [],
    }
];

const desc = [
    "giant",
    "multi-limbed",
    "tentacled",
    "thick furred",
    "diminutive",
    "spiked",
    "armored",
    "bulky",
    "segmented",
    "massive",
    "multitude of",
    "elongated",
    "permanent"
   , 'spindly'
   ,'lithe'
   , 'serpentine' 
   , 'alien'
   , 'ever shifting'
   , 'boney'
   , 'muscled'
   , 'speedy'
   , 'multi-headed'
   , 'screaming'
   , 'circular'
   , 'transparent'
   , 'rubbery'
   , 'gaunt'
   , 'swollen'
   , 'gnarly'
   , 'paper-thin'
   , 'tangled'
   , 'foul-smelling'
   , 'brutish'
   , 'flayed'
   , 'rabid'
   , 'thick-skinned'
   , 'toothless'
   , 'thick-skulled'
   , 'wrinkly'
   , 'horned'
   , 'squirming'
   , 'condensed'
   , 'amphibious'
   , 'colorful'
   , 'fragrant'
   , 'graceful'
   , 'lopsided'
   , 'scarred'
   , 'sinewy'
   , 'parasitic'
   , 'beautiful'
   , 'nimble'
]

const forms = [
    ["humanoid","Life"]
    ,["demonoid","Fire","Dark"]
    ,["insectoid","Wind"]
    ,["carnivorous","Force"]
    ,["animalistic","Life"]
    ,["goblinoid","Earth"]
    ,["mechanical","Metal","Lightning"]
    ,["angelic","Wind","Light"]
    ,["reptilian","Earth"]
    ,["draconic","Fire","Wind"]
    ,["sludgelike","Toxic"]
    ,["chimeric","Force"]
    ,["avian","Wind"]
    ,["beastial","Force"]
    ,["amphibious","Water"]
    ,['robotic',"Metal","Lightning"]
    ,['plant',"Earth"]
    ,['metalic',"Metal"]
    ,['ravenous',"Force"]
    ,['multi-bodied',"Illusion"]
    ,['oceanic',"Water"]
    ,['worm-like',"Earth"]
    ,['arctic',"Water"]
    ,['leech-like',"Toxic"]
    ,['snail-like',"Toxic"]
    ,['fly-like',"Wind"]
    ,['rat-like',"Force","Toxic"]
    ,['bull-like',"Force"]
    ,['impostor',"Illusion"]
    ,['swamp monster',"Earth","Water"]
    ,['praying mantis',"Life"]
    ,['toad-like',"Water"]
    ,['ribbon',"Illusion"]
    ,['tree',"Earth"]
    ,['wasp-like',"Wind"]
    ,['wolf-like',"Force"]
    ,['scrap metal',"Metal"]
    ,['snake-like',"Toxic"]
    ,['crustacean',"Water","Toxic"]
    ,['fungal',"Toxic","Earth"]

]

const transformations = [ // [transformation, subclass]
    [ "slowly","Growth"],
    ["individual body parts",'Adaption'],
    ["as they fight",'Adaption'],
    ["as they move","Growth"],
    ["as they are hurt","Feast"],
    ["as their emotions heighten","Feast"],
    ["in face of danger", "Growth"],
    [ "quickly", "Growth"],
    ["methodically",'Adaption'],
    ["as they interact with the environment",'Adaption'],
    ["all at once","Feast"],
    ["suddenly","Feast"],
    ["by mimicing those around them","Adaption"],
    ["sporadically","Adaption"],
    ["by absorbing matter","Feast"],
    ['themselves and others around them',"Feast"],
    ['cyclically','Adaption'],
    ['slowly but permanently',"Growth"],
    ['explosively','Feast'],
    ['as they reach a certain speed','Growth'],
    ['by ripping themselves open','Growth'],
    ['by holding their breath','Adaption'],
    ['when submerged','Adaption'],
    ['by siphoning energy','Adaption'],
    ['inside a tough coccoon','Adaption'],
    ['noisily','Feast'],
    ['cyclically','Adaption'],
    ['reflexively','Adaption'],
    ['progressively','Adaption'],
]

const classPros = ['vitality','vitality','technique'];

exports.genInfo = (cluster) => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var transform = transformations[Math.floor(Math.random()*transformations.length)];
    var formTbl = forms[Math.floor(Math.random()*forms.length)];
    var form = formTbl[0]
    var description = desc[Math.floor(Math.random()*desc.length)];
    //Changes (transformation) into a (description)(form) form with (bonus)
    info["power"] = "Changes "+transform[0]+" into a " + description + " " + form + " form with " + effect.name + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = form+" form";
    info["description"] = description;

    if (cluster) //gathering subpowers
    {
        info['minors']= []

        info.bonus[0].splice(info.bonus[0].indexOf(classPros[2]),1,"utility")


        function filterCombos(pair){//name, description. Adds 
            for (let elem of formTbl){
                for (let elem2 of pair){
                    if (elem2.toLowerCase() == elem.toLowerCase()){
                        return true;
                    }
                }
            }
        }
        var possibleCombinations = forms.filter(filterCombos);

        for (let i = 0; i<cluster;i++){
            var minorInfo = possibleCombinations[Math.floor(Math.random()*possibleCombinations.length)];

            var minorPower = minorInfo[0]+' form';
            var flavor = `Shifts into a lesser ${minorPower}.`
     
            var minor = [minorPower,flavor,availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)]]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
            
    }


    return info;
}

const availableSubclasses = ["Adaption","Growth","Feast"] //to check if a subclass still exists
exports.getSubclass = (power) => {
    //return("Adaption")
    if (power.subclass && availableSubclasses.lastIndexOf(power.subclass) >-1){ // if power has a specifically written subclass
        return(power.subclass);
    }
    var mySubclass = ""
    for (transform of transformations){
        //console.log(info[0])
        var targetStr = "Changes "+transform[0];
        if(power.info.substring(0,targetStr.length) == targetStr){
            mySubclass =transform[1];
        }
    }
    if (mySubclass == ""){
        console.log('no changer sub')
    }
    if (mySubclass == ""){ //giving a custom or incongruent cape a new class
        power['subclass'] = availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)]
        mySubclass = power.subclass
    }
    
    return mySubclass;
}


exports.attackFlavor = (cape,targetList,resultList,retaliation)=>{
    var mySub = cape.battlestats.subclass[0];
    //console.log('checking flavor')
    
    var myform = cape.power.shape;//default for customs and 
        
    if (retaliation){
        myFlavor = `${cape.name} retaliates against ${targetList[0].name}`
    }
    else{
        var num = Math.floor(Math.random()*3);
        switch (num){
            case(0):
                myFlavor =  `${cape.name} mauls ${targetList[0].name}`
                break;
            case(1):
                myFlavor =  `${cape.name} attacks ${targetList[0].name} in a frenzy`
                break;
            case(2):
                myFlavor =  `${cape.name} slams into ${targetList[0].name}`
                break;
        }
    }
    return myFlavor;
}