// Template: Attacks with (description) (vector) that (effect) 

const effects = [
    { name: "slow the enemy",
        pro: ["control"],
        con: [],
    },
    { name: "can be charged up for more damage",
        pro: ["strength","strength"],
        con: ["vitality","control"],
    },
    { name: "teleport targets a short distance",
        pro: ["control"],
        con: [],
    },
    { name: "burst on contact",
        pro: ["strength"],
        con: [],
    },
    { name: "confuse and befuddle",
        pro: ["technique"],
        con: [],
    },
    { name: "inflict ongoing damage to target",
        pro: ["strength"],
        con: [],
    },
    { name: "mark target for future hits",
        pro: ["technique"],
        con: [],
    },
    { name: "alter the targets perception of time",
        pro: ["utility"],
        con: [],
    },
    { name: "explode after a brief period",
        pro: ["control"],
        con: [],
    },
    { name: "shred non-organic matter",
        pro: ["utility"],
        con: [],
    },
    { name: "create a parasitic effect in the target",
        pro: ["vitality"],
        con: [],
    },
    { name: "swap them with their target",
        pro: ["control"],
        con: [],
    },
    { name: "accelerate the targets velocity rapidly",
        pro: ["control"],
        con: [],
    },
    { name: "seem initially harmless but has severe long term effects",
        pro: ["vitality"],
        con: [],
    },
    { name: "blind the targets senses",
        pro: ["control","control"],
        con: ["strength"],
    },
    { name: "hamper the targets movement",
        pro: ["technique"],
        con: [],
    },
    { name: "accelerate the target's natural proccesses",
        pro: ["utility"],
        con: [],
    },
    { name: "implant diseases",
        pro: ["control"],
        con: [],
    },
    { name: "magnetize the target",
        pro: ["control"],
        con: [],
    },
    { name: "give the user knowledge of the targets emotional state",
        pro: ["control","technique"],
        con: ["strength"],
    },
    { name: "destroy the targets flesh",
        pro: ["strength"],
        con: [],
    },
    { name: "flicker the target through alternate versions of themselves",
        pro: ["utility"],
        con: [],
    },
    { name: "melt inorganic matter",
        pro: ["strength"],
        con: ["utility"],
    },
    { name: "melt organic matter",
        pro: ["control"],
        con: [],
    },
    { name: "push the target in a given direction",
        pro: ["control","utility"],
        con: [],
    },
    { name: "heal the user as they inflict damage",
        pro: ["vitality","vitality"],
        con: ["control","strength"],
    },
    { name: "increase in strength when they are outnumbered",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "deal a surprising amount of damage",
        pro: ["strength"],
        con: ["vitality"],
    },
    { name: "steal items from the target",
        pro: ["utility","utility"],
        con: [],
    },
    { name: "track the target's location",
        pro: ["control","control"],
        con: ["technique"],
    },
    { name: "track the target's health",
        pro: ["control"],
        con: [],
    },
    { name: "freeze the target for a few seconds",
        pro: ["utility","vitality"],
        con: ["strength"],
    },
    { name: "grant allies enhanced speed",
        pro: ["utility","control"],
        con: [],
    },
    { name: "grant allies enhanced durability",
        pro: ["vitality"],
        con: [],
    },
    { name: "aim themselves",
        pro: ["technique"],
        con: ["strength"],
    },
    { name: "cauterize flesh",
        pro: ["vitality"],
        con: [],
    },
    { name: "corrode metal",
        pro: ["strength"],
        con: ["utility"],
    },
    { name: "asynchronously affects the target's bodyparts",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "make things malleable",
        pro: ["utility"],
        con: [],
    },
    { name: "transmutes materials",
        pro: ["utility"],
        con: [],
    },
    { name: "change the target's mass",
        pro: ["control"],
        con: [],
    },
    { name: "temporarily removes the target from the battlefield",
        pro: ["control","vitality"],
        con: ["strength"],
    },
    { name: "mutate the target",
        pro: ["strength","technique"],
        con: ["vitality","control"],
    },


    { name: "imbue target with temporary powers",
        pro: ['vitality','technique'],
        con: ['strength'],
    },
    { name: "leave glowing trails in the air",
        pro: ['control'],
        con: [],
    },
    { name: "deafen the target on hit",
        pro: ['vitality'],
        con: [],
    },

    { name: "create weak points",
        pro: ['strength'],
        con: [],
    },

    { name: "shoot the target out of a portal on hit",
        pro: ['control','vitality'],
        con: [],
    },

    { name: "sow nodes that grow explosively",
        pro: ['control'],
        con: [],
    },

    { name: "short-circuit all electronics in a small radius",
        pro: ['utility'],
        con: [],
    },

    { name: "intensify the effects of gravity on the target",
        pro: ['control','utility'],
        con: [],
    },

    { name: "send the target flying",
        pro: ['control','control'],
        con: [],
    },

    { name: "shatter any material as if it was glass",
        pro: ['strength','strength','utility'],
        con: ['control','control'],
    },

    { name: "are covered with microscopic spines",
        pro: ['utility'],
        con: [],
    },
    { name: "create shockwaves on hit",
        pro: ['control','utility'],
        con: [],
    },
    { name: "temporarily eject the target out of their body",
        pro: ['utility','utility','utility'],
        con: ['strength','strength'],
    },
    { name: "turn scars into fresh wounds",
        pro: ['strength','utility'],
        con: ['technique'],
    },
    { name: "make the target fall asleep",
        pro: ['utility','utility'],
        con: ['vitality'],
    },
    { name: "rip holes in reality",
        pro: ['technique','control'],
        con: ['vitality'],
    },
    { name: "get stronger with repeated hits",
        pro: ['utility'],
        con: ['technique'],
    },
    { name: "distorts memories",
        pro: ['technique','control'],
        con: ['utility','strength'],
    },
    { name: "can be infused with energy over time",
        pro: ['vitality'],
        con: [],
    },
    { name: "can phase through solid matter",
        pro: ['utility'],
        con: [],
    }

];

const vectors = [
     'Weapons'
   , 'Blades'
   , 'Punches'
   , 'Strikes'
   , 'Kicks'
   , 'imbued objects'
   , 'tags'
   , 'tentacles'
   , 'claws'
   , 'taps'
   , 'whips'
   , 'controlled objects'
   , 'caltrops'
   , 'Tackles'
   , 'Bodychecks'
   , 'Martial Arts'
   //, 'Munitions'
   , 'Ribbons'
   , 'Feathers'
   , 'Papers'
   , 'Strings'
   , 'YoYos'
   , 'Ropes'
   , 'Limbs'
   , 'Nunchucks'
   , 'Staves'
   , 'Knives'
   , 'Spears'
   , 'Fingernails'
   , 'Touches'
   , 'Headbuts'
   , 'elongated tongue strikes'
   , 'spines'
   , 'hair'
   , 'gauntlets'
   , 'horns'
   , 'sledgehammers'
   , 'elbows'
   , 'rapiers'
   , 'flails'
   , 'stingers'
   , 'tridents'
   , 'pounces'
   , 'rapiers'
   , 'short-range projectiles'
   , 'claps'
   , 'syringes'
   , 'flicks'
   , 'airbags'
   , 'slams'
   , 'slaps'
   , 'harpoons'
   , 'lances'
   , 'branches'
   , 'stakes'
]

const desc = [ // Desc, Subclass, Descriptions
   [ 'Flaming',"Flurry",['Fire']]
   , ['Enchanted',"Flurry",['Energy']]
   , ['Telekinetic',"Flurry",['Force']]
   , ['Electrified',"Flurry",['Lightning']]
   , ['Space-warping',"Debuff",['Illusion']]
   , ['stretching',"Debuff",['Illusion']]
   , ['magnetic',"Debuff",['Metal','Lightning']]
   , ['glowing',"Debuff",['Light','Toxic']]
   , ['burning',"Flurry",['Fire']]
   , ['invisible',"Flurry",['Force']]
   , ['silent',"Flurry",['Force']]
   , ['freezing',"Debuff",['Water']]
   , ['icey',"Debuff",['Water']]
   , ['explosive',"All or Nothing",['Fire']]
   , ['fleshy',"Debuff",['Fire']]
   , ['necrotic',"Debuff",['Fire']]
   , ['imploding',"All or Nothing",['Energy','Illusion']]
   , ['folding',"Debuff",['illusion']]
   , ['transmuting',"All or Nothing",['Fire']]
   , ['quick',"Flurry",['Wind']]
   , ['heavy',"Flurry",['Force']]
   , ['lava',"Debuff",['Fire','Earth']]
   , ['water',"Flurry",['Water']]
   , ['rock',"Flurry",['Earth']]
   , ['grassy',"Debuff",['Life']]
   , ['wind',"Debuff",['Wind']]
   , ['eldritch',"All or Nothing",['Illusion']]
   , ['gravity',"Debuff",['Force']]
   , ['hardlight',"Debuff",['Light']]
   , ['steel',"Flurry",['Metal']]
   , ['razor',"Debuff",['Metal']]
   , ['cloth',"Debuff",['Life']]
   , ['muscle',"Flurry",['Life']]
   , ['bone',"Flurry",['Life']]
   , ['metalic',"Flurry",['Metal']]
   , ['vaccuum',"Debuff",['Force']]
   , ['void',"All or Nothing",['Force','Dark']]
   , ['radioactive',"Flurry",['Toxic','Energy']]
   , ["orbiting","Debuff",['Force']]

   , ["venomous","Debuff",['Toxic']]
   , ["tranquilizing","All or Nothing",['Toxic']]
   , ["crushing","Flurry",['Force']]
   , ["disintegrating","All or Nothing",['Time']]
   , ["spring-loaded","Flurry",['Metal']]
   , ["supersonic","Debuff",['Wind']]
   , ["laser","Flurry",['Light','Energy']]
   , ["caustic","Debuff",['Toxic']]
   , ["crystalline","Debuff",['Earth','Light']]
   , ["spiky","Flurry",['Metal','Earth']]
   , ["thorny","Debuff",['Life','Earth']]
]

const classPros = ['strength','strength','technique'];

exports.genInfo = (cluster) => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var vector = vectors[Math.floor(Math.random()*vectors.length)].toLowerCase();
    var descriptionTbl = desc[Math.floor(Math.random()*desc.length)];
    description = descriptionTbl[0].toLowerCase();
    //Attacks with (description) (vector) that (effect) 
    info["power"] = "Attacks with "+description+" "+vector+" that " + effect.name.toLowerCase() + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = description+" "+vector;
    
    info["description"] = description;


    if (cluster) //gathering subpowers
    {
        info['minors']= []
        info.bonus[0].splice(info.bonus[0].indexOf(classPros[2]),1,"utility")

        
        function filterCombos(pair){//name, description. Adds 
            for (let elem of descriptionTbl[2]){
                for (let elem2 of pair[2]){
                    if (elem2.toLowerCase() == elem.toLowerCase()){
                        return true;
                    }
                }
            }
        }
        var possibleCombinations = desc.filter(filterCombos);

        for (let i = 0; i<cluster;i++){
            var minorInfo = possibleCombinations[Math.floor(Math.random()*possibleCombinations.length)];

            var minorPower = minorInfo[0].toLowerCase()+" strikes";
            var flavor = `Attacks have ${minorPower.toLowerCase()}.`

            var minor = [minorPower,flavor,minorInfo[1]]// powersnippet, flavor,subclass
            info.minors.push(minor)
        }
            
    }


    return info;
}


exports.genMinor = () => {
    var vector = vectors[Math.floor(Math.random()*vectors.length)].toLowerCase();
    var description = desc[Math.floor(Math.random()*desc.length)];

    return ([description[0].toLowerCase(),vector,description[1]])

}


const availableSubclasses = ["Debuff","Flurry","All or Nothing"] //to check if a subclass still exists
exports.getSubclass = (power) => {
    if (power.subclass && availableSubclasses.lastIndexOf(power.subclass) >-1){ // if power has a specifically written subclass
        return(power.subclass);
    }
    var mySubclass = ""
    for (tbl of desc){
        //console.log(info[0])
        var targetStr = "Attacks with "+tbl[0];
        if(power.info.substring(0,targetStr.length) == targetStr){
            mySubclass =tbl[1];
        }
    }
    if (mySubclass == ""){
        //console.log('no striker sub')
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
    if (retaliation && !(mySub=='Flurry' && cape.battlestats.subbonus.active == true)){
        mySub = 'Retaliation'
    }
    var myStrike = cape.power.shape;//default for customs and 
    
    var myFlavor = ""

    switch(mySub){
        case("Debuff"):
            myFlavor = `${cape.name}'s ${myStrike} assail ${targetList[0].name}`
            break;
        case("Flurry"):
            if (cape.battlestats.subbonus.active == false){ // first strike hits
                myFlavor = `${cape.name} assaults ${targetList[0].name} with ${myStrike}`
            }else{
                myFlavor = `${cape.name} unleashes a frenzy  of ${myStrike} at ${targetList[0].name}`
            }
            break;
        case("All or Nothing"):
            myFlavor = `${cape.name}'s ${myStrike} strike at ${targetList[0].name}`
            break;
        case("Retaliation"):
            myFlavor = `${cape.name} turns their ${myStrike} to ${targetList[0].name}`
    }
    return myFlavor;
}


