// template Has increased access to (Information) through (vector), but (limitation).

/*
Percept: Seeing
Discovery: Finding what stuff means
Thought :Mental
Skill :Skills
Analysis :Thinking skills
*/
const information = [
    ['any kind of information','Surveillance',"Analysis"]
  ,  ['visual information','Strategist',"Percept"]
  ,  ['unusual combat abilities','Combat',"Skill"]
  ,  ['qualitative information','Surveillance',"Analysis"]
  ,  ['quantitative information','Surveillance',"Analysis"]
  ,  ['danger sense','Combat',"Percept"]
  ,  ['written information','Strategist',"Discovery"]
  ,  ['hidden information','Strategist',"Discovery"]
  ,  ['social abilities','Strategist',"Thought"]
  ,  ['general knowledge of a target','Combat',"Discovery"]
  ,  ['logical processing','Strategist',"Analysis"]
  ,  ['operational planning','Surveillance',"Skills"]
  ,  ['peak human fighting abilities','Combat',"Skill"]
  ,  ['weapon usage capabilities','Combat',"Skill"]
  ,  ['environmental observation','Strategist',"Percepy"]
  ,  ['medical knowledge','Surveillance',"Skill"]
  ,  ['impersonation capabilities','Strategist',"Thought"]
  ,  ['distraction capabilities','Strategist',"Skill"]
  ,  ['emotional awareness','Strategist',"Thought"]
  ,  ['trajectory calculation','Combat',"Skill"]
  ,  ['pain infliction','Combat',"Skill"]
  ,  ['wound infliction','Combat',"Skill"]
  ,  ['weakness detection','Combat','Discovery']
  ,  ['secret detection','Strategist','Discovery']
  ,  ['vehicle knowledge','Combat','Skill']
  , [ 'combat knowledge','Combat',"Skill"]
  ,  ['hand-to-hand techniques','Combat','Skill']
  ,  ['architectural knowledge','Strategist','Percept']
  ,  ['structural weaknesses','Strategist','Discovery']
  ,  ['weak point analysis','Combat',"Analysis"]
  ,  ['demolitions knowledge','Combat',"Skill"]
  ,  ['weapon skills','Combat',"Skill"]
  ,  ['problem solving ability','Surveillance',"Analysis"]
  ,  ['survival skills','Surveillance',"Skill"]
  , [ 'human emotions','Strategist',"Thought"]
  ,  ['behavioural analysis','Strategist',"Thought"]
  ,  ['dream interpretation','Surveillance',"Thought"]
  ,  ['PRT Trooper tactics','Surveillance',"Skill"]
  ,  ['close-quarter tactics','Combat',"Skill"]
  ,  ['strategy','Strategist',"Analysis"]
  ,  ['tactics','Strategist',"Analysis"]
  ,  ['logistical planning','Surveillance',"Analysis"]
  ,  ['traps and tricks','Surveillance',"Analysis"]
  , ['the ideal path','Strategist',"Discovery"]
  , ['possible threats','Combat',"Discovery"]
  , ['the future','Strategist',"Percept"]
  , ['long term planning skills','Surveillance',"Analysis"]
  , [`other's plans`,'Surveillance',"Thought"]
  , [`worst case scenarios`,'Surveillance','Analysis']
  , [`best case senarios`,'Surveillance','Analysis']

  , ['all possibilities','Surveillance','Percept']
  , [`nonverbal communication`,'Combat',"Discovery"]
  , [`unfamiliar languages`,'Strategist',"Thought"]
  , [`dodging skills`,'Combat',"Skill"]

];

const limitations = [
    'information can be completely wrong'
   , 'they suffer severe headaches for overuse'
   , 'their power only works in short bursts'
   , 'their power goes haywire when combined with other thinker abilities'
   , 'they do not have consious control over their ability'
   , 'they can only focus on a limited area'
   , 'their power only works on enemies'
   , 'the power only works in-combat'
   , 'their power requires time to observe before use'
   , 'they can only remember one piece of power-sourced information at a time'
   , 'they have to lose other mental faculties to access their power'
   , 'their power cannot be deactivated'
   , 'the power only works on nearby targets'
   , 'the information can only be taken from any given source once'
   , 'information quickly loses value and is only useful for a limited time'
   , 'the information may be incorrectly applied'
   , 'the information has to be known by nearby people'
   , 'their power causes stress and paranoia to others nearby'
   , 'they suffer severe withdrawl when not using their power'

   ,'their power is weaker the closer they are to their target'
   ,'their power is stronger the closer they are to their target'
   ,"they're slowly losing their faith in humanity"
   ,'their power always presses them towards the most violent resolution'
   ,'their blindspots are devestating when they do crop up'
   ,'they have a compulsive need to know more'
   ,'their power only works off worst case scenarios'
   ,'their power only works when they talk themselves through it'
   ,"their power gives a visual tell when it's active"
   ,'their other senses are dulled'
   ,'their power is rather vague'
   ,"they can't share the knowledge their power gives them with others"
   ,'the insights they get are very specific'
   ,'the insights they get come in riddles'


]

const vectors = [
    { name: "power-assisted guessing",
        pro: ["vitality","vitality"],
        con: ["technique"],
    },
    { name: "touch based postcognition",
        pro: ["strength"],
        con: [],
    },
    { name: "super enhanced senses",
        pro: ["utility","control"],
        con: [],
    },
    { name: "precognitive visions",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "warped perception",
        pro: ["strength"],
        con: ["technique"],
    },
    { name: "speeding up their thought proccess.",
        pro: ["technique","technique"],
        con: ["strength"],
    },
    { name: "a perfect memory",
        pro: ["utility","utility"],
        con: ["vitality"],
    },
    { name: "inhuman learning speed",
        pro: ["utility"],
        con: [],
    },
    { name: "local precognition",
        pro: ["technique","vitality"],
        con: ["control"],
    },
    { name: "local postcognition",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "power-controlled actions",
        pro: ["strength","technique"],
        con: ["control","vitality"],
    },
    { name: "hijacking the senses of others",
        pro: ["strength"],
        con: [],
    },
    { name: "power-inherited experience",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "skill transference",
        pro: ["vitality"],
        con: [],
    },
    { name: "skill copying",
        pro: ["control"],
        con: [],
    },
    { name: "skill theft",
        pro: ["strength","technique"],
        con: ["vitality"],
    },
    { name: "parallel reality awareness",
        pro: ["control","utility"],
        con: [],
    },
    { name: "cause/effect awareness",
        pro: ["strength"],
        con: [],
    },
    { name: "psychometrics",
        pro: ["control",'technique'],
        con: ['vitality'],
    },
    { name: "additional copies of their consciousness in their heads",
        pro: ["vitality",'utility'],
        con: ["control","technique"],
    },
    { name: "wide ranging pre-cognition",
        pro: ["control",'vitality'],
        con: [''],
    },
    { name: "localized probability estimation",
        pro: ["utility",'strength'],
        con: [],
    },
    { name: "passing information backwards in time",
        pro: ["technique"],
        con: [],
    },
    { name: "learning from their alternate-selves",
        pro: ["utility","control"],
        con: [],
    },
    { name: "instinctive precognition",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "borrowing cognitive space from those nearby",
        pro: ["strength","technique"],
        con: ["vitality"],
    },
    { name: "their power highlighting targets",
        pro: ["utility"],
        con: [],
    },
    { name: "gaining information through physical contact",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "simulating others thoughts",
        pro: ["control"],
        con: [],
    },
    { name: "far-future precognition",
        pro: ["utility",'utility','control'],
        con: ['technique'],
    },
    { name: "being able to look from multiple point of views",
        pro: ["control"],
        con: [],
    },
    { name: "gathering ambient information from the enviornment",
        pro: ["utility",'vitality'],
        con: [],
    },
    { name: "innate knowledge of what not to do",
        pro: ['vitality'],
        con: [],
    },
    { name: "hearing whispers of the answers they seek",
        pro: ["utility"],
        con: [],
    },
    { name: "a trance-like state",
        pro: ["utility",'utility'],
        con: ['vitality','technique'],
    },
    { name: "seeing markers on nearby surfaces",
        pro: ["utility",'control'],
        con: [],
    },
    { name: "observing the shape of the wounds they inflict",
        pro: ['technique'],
        con: ['vitality'],
    },
    { name: "very observant minions",
        pro: ["control","utility"],
        con: [],
    },
    { name: "drinking a liquid their power provides",
        pro: ["strength",'vitality'],
        con: ['control'],
    },
    { name: "flipping through visual channels",
        pro: ["utility",'strength'],
        con: ['control'],
    }
]

const classPros = ['technique','technique','utility'];





exports.genMinor = (subclass) => {
    function filterSubclass(info){
        if (subclass){
            if (subclass==info[1]){
                return true;
            }else{
                return false;
            }
        }
        return true;
    }
    const infos = information.filter(filterSubclass)
    const info = infos[Math.floor(Math.random()*infos.length)];

    return (info[0])

}




exports.genInfo = (cluster) => {
    var info = new Object();
    var extraInfo = information[Math.floor(Math.random()*information.length)];
    var vector = vectors[Math.floor(Math.random()*vectors.length)];
    var limit = limitations[Math.floor(Math.random()*limitations.length)];

    // template Has increased access to (Information) through (vector), but (limitation).
    info["power"] = "Has increased access to "+extraInfo[0]+" through " + vector.name + ", but "+limit + ".";
    info["bonus"] = [[...vector.pro, ...classPros], vector.con];
    info["shape"] = "fists";
    info["description"] = vector.name;

    if (cluster) //gathering subpowers
    {
        info['minors']= []

        

        function filterCombos(pair){//name, description. Adds 
            for (let elem of extraInfo){
                for (let elem2 of pair){
                    if (availableSubclasses.indexOf(elem)==-1 && elem2.toLowerCase() == elem.toLowerCase()){
                        return true;
                    }
                }
            }
        }
        var possibleCombinations = information.filter(filterCombos);

        for (let i = 0; i<cluster;i++){
            var minorInfo = possibleCombinations[Math.floor(Math.random()*possibleCombinations.length)];

            var minorPower = minorInfo[0].toLowerCase();
            var flavor = `Enhanced access to ${minorPower}.`

            var minor = [minorPower,flavor,minorInfo[1]]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
    }

    return info;
}

const availableSubclasses = ["Strategist","Surveillance","Combat"] //to check if a subclass still exists
exports.getSubclass = (power) => {
    //return("Surveillance")
    if (power.subclass && availableSubclasses.lastIndexOf(power.subclass) > -1){ // if power has a specifically written subclass
        return(power.subclass);
    }
    var mySubclass = ""
    for (info of information){
        //console.log(info[0])
        var targetStr = "Has increased access to "+info[0]
        if(power.info.substring(0,targetStr.length) == targetStr){
            //console.log('found thinker subclass! '+info[1])
            mySubclass =info[1];
        }
    }
    
    if (mySubclass == ""){ //giving a custom or incongruent cape a new class
        power['subclass'] = availableSubclasses[Math.floor(Math.random()*availableSubclasses.length)]
        mySubclass = power.subclass
    }
    
    return mySubclass;
}

