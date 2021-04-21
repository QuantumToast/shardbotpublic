const armoryModule = require('../structures/armory')

const defenses = [
    ["tanks",
        "Brute",
        "Changer",
        "Shaker",
        "Breaker",
    ],
    ["avoids",
        "Mover",
        "Stranger",
        "Thinker",
        "Master",
    ],
    ["dodges",
        "Tinker",
        "Blaster",
        "Striker",
        "Trump",
    ]
]

module.exports.getDefense = (className)=>{
    for (flavor of defenses){
        for (c of flavor){
            if (c == className){
                return(flavor[0]);
            }
        }
    }
    return("dodges");
}

const personalInfo = [
    'They have a subtance abuse problem'
,    'Their power is a bud off of another team member'
,    'Their power is a bud of a rival of the team'
,    "It's well known that their parent was a famous hero"
,    "It's well known that their parent was a terrifying villain"
,    'Their power is incrediby ugly and disturbing'
,    'They have a disability that their power helps them work around'
,    'Their power warped their normal form enough that they do not have a civilian identity'
,    'They have a long history of violence and a bad reputation'
,    'They have a problem with authority figures'
,    'They are a very recent trigger, and often screw up under pressure'
,    'They triggered at an extremely young age'
,    'Their personality has been warped by their power, enough that they are really hard to talk to'
,    "It's well known that they killed someone"
,    'They have a personal vendetta against drugs'
,    'They have a personal vendetta against kid-killers'
,    'They have a personal vendetta against cops'
,    'Before triggering, they worked in law enforcement, and bring that focus with them'
,    'They are incredibly trusting and naive'
,    'They are extremely manipulative and toxic'
,    "They're just plain nasty to be around"
,    'They have a history of stealing from teammates'
,    'They are willing to do anything to rise to the top of the heap'
,    'They once belonged to a hero team that fell apart'
,    'They once belonged to a villain team that was taken down'
,    'They were horribly scarred by a rival'
,    'They demand beauty in all things'
,    'Their sadism is well known in the area'
,    'They have connections to a foriegn crime syndicate'
,   'They suffer from extreme memory loss'
,    'They are a tinker or master construct, independent since their trigger'
,    'They act much more childish then their age should suggest'
,    'Their paranoia tends to sabatoge their long term efforts'
,    'Their power is constantly on, they can never turn it completely off'
,    'They have a bad habit of falling in love with teammates'
,   'They are a case 53, their power an intrinsic part of their body'
,   'They are doing their best to cover up their past connections to a well known hate group'
,    'They believe that their powers come from demons, gods, magic, aliens, or something similarly crazy'
,    "They have a strange obsession with 'monstrous' capes"
,    'They suffer from depression'
,    'They have extreme manic episodes'
,    'Their power lashes out uncontrollably under stress'
,    'By default, their power is extremely lethal'
,    "They came close to dying once, and haven't been the same ever since"
,    "Their family has no clue they're a cape"
,    "They don't like using their power, but their obligations leave them no choice"
,   " They're still figuring out the nuances of their power"
,    "Their civilian identity is widely known"
,    "An injury altered their power in a noticeable way"
,    "Their power is dangerously addictive to use"
,    "They only communicate in a made-up language"
,    "Their power has arguably made them a better person"
,    "Their tactics are unusual, but effective"
,    "They're a natural team leader"
,    "They have a small, almost unnoticeable power-related mutation" 
,    "They're currently homeless"
,    "They have a strong desire to prove their worth"
,    "They are extremely stubborn"
,    "They grew up in extreme poverty"
,    "They have a tendency to disappear, sometimes for multiple days"
,    "They're pleasant and easy to talk to"
,    "They tend to go to great lengths for those they care about"
,    "They're very professional in costume"
,    "They don't do too well in stressful situations"
,    "Their patience is legendary"
,    "They're good at thinking on their feet"
,    "They have trouble making decisions, even small ones"
,    "They always consult a thinker before comitting to a course of action"
,    "They hate being the center of attention"
,    'They have a sweet tooth and are constantly craving snacks'
,    'They have an eating disorder'
,    'They hate being touched'
,    'They are from a foreign country'
,    'They have an extreme political ideology'
,    'They cannot keep their mouth shut'
,    'They almost died after their trigger, having to be rescued by someone else'
,    'They think the endbringers are a punishment from god'
,    'They engage in political activism'
,    'They have covered up a murder in their past'
,    'They killed an abusive parent'
,    'Their parents are dead and they refuse to say why'
,    'Their little sibling also has powers'
,    'They come from a huge family and are not used to getting attention'
,    'They cannot remember their life before their trigger'
,    'They are used to living in luxury'
]

module.exports.getInfo = ()=>{
    var text = personalInfo[Math.floor(Math.random()*personalInfo.length)]+".";
    return text;
}


const weaponizedClasses = [
    "Blaster",
    "Breaker",
    "Shaker",
    "Changer",
    "Striker",
    "Master",
    "Tinker",
    'Trump'
]

module.exports.flavorAttack = (cape,targetList,resultList,retaliation,lb)=>{
    //console.log('starting flavor')
    // weaponized classes should also account for custom powers??
    var flavor = "";
    //see if class is weaponized
    if (weaponizedClasses.lastIndexOf(cape.class)!= -1){
        //console.log('has a class')
        const {attackFlavor} = require(`./classifications/${cape.class.toLowerCase()}`)
        //console.log('retrieving class module')
        flavor = attackFlavor(cape,targetList,resultList,retaliation);
    }else{
        // check for weapons flavor, in case of custom
        if (cape.class != 'Human' && cape.power.shape != 'fists' && cape.power.shape != 'weapon'){
            flavor = `${cape.name} attacks ${targetList[0].name} with ${cape.power.shape.toLowerCase()}`
        }else{
            //normie
            var weapon = "fists"
            var weaponType = 'default'

            //console.log('has a weapon: '+cape.weapon)
            
            const itemData = armoryModule.getData(cape.weapon);
            if (itemData){
                weapon = cape.weapon;
                weaponType = itemData.weaponType;
            }
            //checking for stranger to add ambush flavor
            if (cape.battlestats.subclass == 'Ambush' && cape.battlestats.subbonus.hasAttacked == false){
                weaponType = "Ambush"
            }
            
            if (retaliation){
                switch(weaponType){
                    case("Gun"):
                        flavor = `${cape.name} returns fire at ${targetList[0].name}`
                        break;
                    case("Melee"):
                        flavor = `${cape.name} swings their ${weapon.toLowerCase()} back at ${targetList[0].name}`
                        break;
                    case("Ambush"):
                        flavor = `${cape.name} surprises ${targetList[0].name} with their ${weapon.toLowerCase()}`
                        break;
                    default:
                        flavor = `${cape.name} attacks ${targetList[0].name} back with their ${weapon.toLowerCase()}`
                    break;
                }

            }else{
                switch(weaponType){
                    case("Gun"):
                        flavor = `${cape.name} shoots ${targetList[0].name} with their ${weapon.toLowerCase()}`
                        break;
                    case("Melee"):
                        flavor = `${cape.name} swings their ${weapon.toLowerCase()} at ${targetList[0].name}`
                        break;
                    case("Ambush"):
                        flavor = `${cape.name} ambushes ${targetList[0].name} with their ${weapon.toLowerCase()}`
                        break;
                    default:
                        flavor = `${cape.name} attacks ${targetList[0].name} with their ${weapon.toLowerCase()}`
                    break;
                }

            }
        }

        
    }
    flavor = flavor.replace(' their'," "+(cape['pos'] || 'their'))
    return flavor;
}



