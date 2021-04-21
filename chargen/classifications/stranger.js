// template By (effect), is able to avoid (type of interaction)(target).
const targets = [
    'a single person'
   , 'anyone near them'
   , 'crowds of people'
   , 'anyone they think of'
   , 'anyone within a specified location'
   , 'parahuman abilities'
   , 'living things'
   ,'sapient life-forms'
   , 'close range observation'
   , 'long range observation'
   , 'those who have negative opinions of them'
   , 'those who wish to hurt them'
   , 'everyone'
   , 'enemies'
   , 'a narrowly defined group of people'
   , 'their victims'
   ,'anyone who sees them directly'
   , 'anyone who they talk to'
   , 'anyone within a designated area'
   , 'anyone who they make eye contact with'
   ,'anyone'
   , 'the untrained eye'
   , 'other capes'
   , 'most people'
];

const interactions = [
   'attention from'
   , 'focus from'
   , 'being thought of by '
   , 'any sort of interaction from'
   , 'harmful intentions from'
   , 'being tracked by'
   , 'being understood by'
   , 'physical contact from'
   , 'being hurt by'
   , 'having to deal with'
   , 'being described by'
   , 'being memorized by'
   , 'whatever they want from'
   , 'being recognized by'
   , 'being targeted with any form of aggression by'
   , 'being approached by'
   , 'having information about them communicated by'
   ,'interacting with'
   , 'being detected by'
   , 'being perceived by'
]

const effects = [
    { name: "altering short term memories",
        pro: ["technique"],
        con: [],
        subclass: "Ambush",
        element: ["Analysis"]

    },
    { name: "cloaking themselves in their power",
        pro: ["vitality"],
        con: [],
        subclass: "Avoidance",
        element: ["Discovery","Percept"]
    },
    { name: "emitting dark clouds",
        pro: ["control",],
        con: [],
        subclass: "Avoidance",
        element: ["Discovery"]

    },
    { name: "forcibly redirecting a sense",
        pro: ["technique"],
        con: [],
        subclass: "Strife",
        element: ["Percept"]

    },
    { name: "modifying how light works",
        pro: ["utility"],
        con: [],
        subclass: "Ambush",
        element: ["Percept","Discovery"]

    },
    { name: "merging with the area",
        pro: ["vitality"],
        con: [],
        subclass: "Avoidance",
        element: ["Percept"]

    },
    { name: "spatial distortions",
        pro: ["strength"],
        con: [],
        subclass: "Strife",
        element: ["Discovery","Skill"]

    },
    { name: "superhuman agility",
        pro: ["control","control"],
        con: [],
        subclass: "Ambush",
        element: ["Skill"]

    },
    { name: "visual illusions",
        pro: ["technique"],
        con: [],
        subclass: "Ambush",
        element: ["Discovery","Skill"]

    },
    { name: "subtle shapeshifting",
        pro: ["strength"],
        con: [],
        subclass: "Strife",
        element: ["Discovery"]
    },
    { name: "creating perception screens",
        pro: ["utility"],
        con: [],
        subclass: "Avoidance",
        element: ["Discovery","Percept"]

    },
    { name: "manipulating emotions",
        pro: ["strength"],
        con: [],
        subclass: "Strife",
        element: ["Thought"]

    },
    { name: "emitting psychotropic fog",
        pro: ["control","vitality"],
        con: ["strength"],
        subclass: "Ambush",
        element: ["Discovery","Analysis"]

    },
    { name: "creating clones of themselves",
        pro: ["control"],
        con: [],
        subclass: "Avoidance",
        element: ["Skill"]

    },
    { name: "creating clones of others",
        pro: ["vitality"],
        con: ["control"],
        subclass: "Avoidance",
        element: ["Skill"]

    },
    { name: "jamming electromagnetic waves",
        pro: ["utility","utility"],
        con: [],
        subclass: "Ambush",
        element: ["Percept"]
    },
    { name: "using a special sense",
        pro: ["utility","technique"],
        con: [],
        subclass: "Ambush",
        element: ["Skill"]

    },
    { name: "blending into the background",
        pro: ["vitality"],
        con: [],
        subclass: "Avoidance",
        element: ["Percept","Skill"]

    },
    { name: "changing the illumination",
        pro: ["control","utility"],
        con: [],
        subclass: "Ambush",
        element: ["Percept"]

    },
    { name: "creating distractions",
        pro: ["coontrol","strength"],
        con: ["vitality"],
        subclass: "Strife",
        element: ["Analysis","Discovery"]

    },
    { name: "supercharging a sense",
        pro: ["utility","technique"],
        con: [],
        subclass: "Ambush",
        element: ["Skill"]

    },
    { name: "chaotically disrupting a sense",
        pro: ["strength","strength"],
        con: ["control"],
        subclass: "Ambush",
        element: ["Analysis","Percept"]

    },
    { name: "mental distortion",
        pro: ["control"],
        con: [],
        subclass: "Strife",
        element: ["Thought"]

    },
    { name: "redacting vision",
        pro: ["technique"],
        con: [],
        subclass: "Avoidance",
        element: ["Percept"]

    },
    { name: "passive probability manipulation",
        pro: ["utility"],
        con: [],
        subclass: "Avoidance",
        element: ["Analysis","Skil"]
    },
    { name: "teleporting a short distance",
        pro: ["control",'technique'],
        con: ['vitality'],
        subclass: "Avoidance",
        element: ["Thought"]
    },
    { name: "rewinding time",
        pro: ["utility",'utility','utility'],
        con: ['control'],
        subclass: "Ambush",
        element: ["Thought"]
    },
    { name: "staying still",
        pro: ["utility",'vitality','technique'],
        con: ['control','control'],
        subclass: "Avoidance",
        element: ["Discovery"]
    },
    { name: "sinking into the ground",
        pro: ["control",'vitality'],
        con: ['strength'],
        subclass: "Ambush",
        element: ["Percept"]
    },
    { name: "staying unseen",
        pro: ["utility"],
        con: [],
        subclass: "Ambush",
        element: ["Percept"]
    },
    { name: "sending mental commands",
        pro: ["control",'utility'],
        con: [],
        subclass: "Strife",
        element: ["Thought"]
    }
]

const classPros = ['technique','technique','vitality'];

exports.genInfo = (cluster) => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var target = targets[Math.floor(Math.random()*targets.length)];
    var interaction = interactions[Math.floor(Math.random()*interactions.length)];
    // template By (effect), is able to avoid (type of interaction)(target).
    info["power"] = "By "+effect.name+", is able to avoid " + interaction + " "+target + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = "fists";
    info["description"] = effect;

    if (cluster) //gathering subpowers
    {
        info['minors']= []

        info.bonus[0].splice(info.bonus[0].indexOf(classPros[2]),1,"utility")


        function filterCombos(pair){//name, description. Adds 
            for (let elem of effect.element){
                for (let elem2 of pair.element){
                    if ( elem2.toLowerCase() == elem.toLowerCase()){
                        return true;
                    }
                }
            }
        }
        var possibleCombinations = effects.filter(filterCombos);

        for (let i = 0; i<cluster;i++){
            var minorInfo = possibleCombinations[Math.floor(Math.random()*possibleCombinations.length)];

            var minorPower = minorInfo.name;
            var flavor = `Avoids ${target} through ${minorPower}.`

            var minor = [minorPower,flavor,minorInfo.subclass]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
            
    }

    return info;
}

const availableSubclasses = ["Ambush","Avoidance","Strife"] //to check if a subclass still exists
exports.getSubclass = (power) => {
    if (power.subclass && availableSubclasses.lastIndexOf(power.subclass) >-1){ // if power has a specifically written subclass
        return(power.subclass);
    }
    var mySubclass = ""
    for (effect of effects){
        //console.log(info[0])
        var targetStr = "By "+effect.name
        if(power.info.substring(0,targetStr.length) == targetStr){
            //console.log('found stranger subclass! '+effect.subclass);
            mySubclass =effect.subclass;
        }
    }
    if (mySubclass == ""){
        console.log('no stranger sub')
    }
    if (mySubclass == ""){ //giving a custom or incongruent cape a new class
        power['subclass'] = availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)]
        mySubclass = power.subclass
    }
    
    return mySubclass;
}