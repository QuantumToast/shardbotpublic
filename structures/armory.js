/*
Item:{
    String name: X
    String class: Weapon/Costume/Gadget
    String rarity: Market/Expensive/Fortune/Scrap Tech/Tinker Tech/Premium Tech
    String description: flavor text
    int durability: X (deincrementing each time)
    num payscale = X.X

    bonus:{
        set:{
            [stat]: overwrite value
        }
        alter: {
            [stat]: modifier
        }
    }

    String weaponType: Melee/Gun
}

*/

const foamLauncher = {
    name: "Foam Launcher",
    class: "Weapon",
    rarity: "PRT",

    description: "Spews containment foam",
    payscale: 1,
    durability: 20,

    bonus: {
        set: {
            ["strength"]: 2,
            ["technique"]: 5,
        },
        alter:{
            ['control']: 2
        }
    },

    weaponType: "Gun",
}

/*************************
 * 0 Capacity items
 ***********************/
const knife = {
    name: "Knife",
    class: "Weapon",
    rarity: "Scrap Tech",
    capacity: 0,

    description: "Hard edged shiv.",
    payscale: .3,
    durability: 15,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 1,
            ["control"]: -1,
        }
    }

    ,weaponType: "Melee",
}
const mace = {
    name: "Mace",
    class: "Weapon",
    rarity: "Scrap Tech",
    capacity: 0,

    description: "Spray 'n pray.",
    payscale: .3,
    durability: 15,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 1,
            ["utility"]: -1,
        }
    }

    ,
    weaponType: "Gun",

}
const helmet = {
    name: "Helmet",
    class: "Costume",
    rarity: "Market",
    capacity: 0,

    description: "Bonk.",
    payscale: .5,
    durability: 10,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 1,
            ["technique"]: -1,
        }
    }
}
const taser = {
    name: "Taser",
    class: "Weapon",
    rarity: "Market",
    capacity: 0,

    description: "Zip zap.",
    payscale: .3,
    durability: 15,

    bonus: {
        set: {
        },
        alter:{
            ["technique"]: 1,
            ["control"]: -1,
        }
    }

    ,weaponType: "Melee",
}
const luckycharm = {
    name: "Lucky Charm",
    class: "Gadget",
    rarity: "Market",
    capacity: 0,

    description: "Classic memorobelia.",
    payscale: 1,
    durability: 15,

    bonus: {
        set: {
            ["utility"]: 3,
            ["control"]: 1,
        },
        alter:{
        }
    }
}
const homemadecostume = {
    name: "Homemade Costume",
    class: "Costume",
    rarity: "Scrap Tech",
    capacity: 1,

    description: "Nothing a little ducktape can't fix.",
    payscale: 1,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 1,
            ["utility"]: -1,
        }
    }
}
/*************************
 * 1 Capacity items
 ***********************/
// WEAPONS
const sword = {
    name: "Sword",
    class: "Weapon",
    rarity: "Market",
    capacity: 1,

    description: "The LARPer said it was usable.",
    payscale: .5,
    durability: 26,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 1,
        }
    }

    ,weaponType: "Melee",

}
const pistol = {
    name: "Pistol",
    class: "Weapon",
    rarity: "Market",
    capacity: 1,

    description: "A classic firearm.",
    payscale: 1,
    durability: 20,

    bonus: {
        set: {
            ["strength"]: 4,
        },
        alter:{
            ["control"]: 1,
        }
    },

    weaponType: "Gun",
}
const spear = {
    name: "Spear",
    class: "Weapon",
    rarity: "Market",
    capacity: 1,

    description: "Good for controling engagements",
    payscale: .75,
    durability: 16,

    bonus: {
        set: {
        },
        alter:{
            ["control"]: 1,
        }
    }

    ,weaponType: "Melee",
}
const baseballbat = {
    name: "Baseball Bat",
    class: "Weapon",
    rarity: "Scrap Tech",
    capacity: 1,

    description: "Call me Casey.",
    payscale: .5,
    durability: 20,

    bonus: {
        set: {
        },
        alter:{
            ["technique"]: 1,
        }
    }

    ,weaponType: "Melee",

}
const crossbow = {
    name: "Crossbow",
    class: "Weapon",
    rarity: "Expensive",
    capacity: 1,

    description: "When bows are too mainstream; fuck you Katn-",
    payscale: 1,
    durability: 20,

    bonus: {
        set: {
        },
        alter:{
            ["control"]: 2,
            ["technique"]: -1,
        }
    },

    weaponType: "Gun",
}
const brassknuckles = {
    name: "Brass Knuckles",
    class: "Weapon",
    rarity: "Market",
    capacity: 1,

    description: "Wana-be Wolverine",
    payscale: .75,
    durability: 16,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 1,
            ["technique"]: 1,
            ["vitality"]: -1,
        }
    }

    ,weaponType: "Melee",
}
// COSTUMES
const basiccostume = {
    name: "Basic Costume",
    class: "Costume",
    rarity: "Market",
    capacity: 1,

    description: "Probably your signing bonus.",
    payscale: 1,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 2,
        }
    }
}
const heavycostume = {
    name: "Heavy Costume",
    class: "Costume",
    rarity: "Market",
    capacity: 1,

    description: "Someone's taking this way too seriously.",
    payscale: 1,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 3,
            ["technique"]: -1,
        }
    }
}
const lightcostume = {
    name: "Light Costume",
    class: "Costume",
    rarity: "Market",
    capacity: 1,

    description: "Rather scandalous don't ya think?",
    payscale: 1,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 1,
            ["control"]: 1,
        }
    }
}
// GADGETS
const smokegrenade = {
    name: "Smoke Grenade",
    class: "Gadget",
    rarity: "Market",
    capacity: 1,

    description: "Spews blinding clouds when triggered.",
    payscale: .3,
    durability: 4,

    bonus: {
        set: {
            ["control"]: 3,
        },
        alter:{
        }
    }
}
const pipebomb = {
    name: "Pipe Bomb",
    class: "Gadget",
    rarity: "Scrap Tech",
    capacity: 1,

    description: "Junkyard explosive. Powerful and accessible.",
    payscale: 2,
    durability: 4,

    bonus: {
        set: {

        },
        alter:{
            ["control"]: 1,
        }
    }
}
const grapplinghook = {
    name: "Grappling Hook",
    class: "Gadget",
    rarity: "Expensive",
    capacity: 1,

    description: "Make sure you aim correctly.",
    payscale: 1.4,
    durability: 16,

    bonus: {
        set: {
        },
        alter:{
            ["control"]: 2,
            ["vitality"]: -1,
        }
    }
}
const utilitybelt = {
    name: "Utility Belt",
    class: "Gadget",
    rarity: "Expensive",
    capacity: 1,

    description: "Do you really need an explanation?",
    payscale: 1.4,
    durability: 16,

    bonus: {
        set: {
        },
        alter:{
            ["utility"]: 1,
            ['strength']: -1,
        }
    }
}
const molotov = {
    name: "Molotov",
    class: "Gadget",
    rarity: "Scrap Tech",
    capacity: 1,

    description: "The anarchist classic.",
    payscale: 3,
    durability: 7,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 2,
            ["vitality"]: -1,
        }
    }
}
const shield = {
    name: "Shield",
    class: "Gadget",
    rarity: "Expensive",
    capacity: 1,

    description: "Active guard at +3: DR+4pip to 1l, shell tanks roll none.",
    payscale: 2,
    durability: 4,

    bonus: {
        set: {

        },
        alter:{
            ["vitality"]: 1,
        }
    }
}
/*************************
 * 2 Capacity items
 ***********************/
// WEAPONS

const lasergun = {
    name: "Laser Gun",
    class: "Weapon",
    rarity: "Tinker Tech",
    capacity: 2,

    description: "Pew pew.",
    payscale: 1,
    durability: 20,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 1,
            ["control"]: 1,
        }
    }

    ,weaponType: "Gun",

}
const grenadelauncher = {
    name: "Grenade Launcher",
    class: "Weapon",
    rarity: "Fortune",
    capacity: 2,

    description: "BOOM BABY.",
    payscale: 1.2,
    durability: 15,

    bonus: {
        set: {
            ["strength"]: 6,
        },
        alter:{
            ["vitality"]: -2,
        }
    }
}
const flamethrower = {
    name: "Flamethrower",
    class: "Weapon",
    rarity: "Fortune",
    capacity: 2,

    description: "BURN BABY.",
    payscale: 1.3,
    durability: 25,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 3,
            ["technique"]: -1,
        }
    }
}
const sniper = {
    name: "Sniper Rifle",
    class: "Weapon",
    rarity: "Expensive",
    capacity: 2,

    description: "A powerful but delicate rifle.",
    payscale: 1.4,
    durability: 20,

    bonus: {
        set: {
            ["strength"]: 5,
        },
        alter:{
            ["control"]: -2,
        }
    }

    ,weaponType: "Gun",

}
const assaultrifle = {
    name: "Assault Rifle",
    class: "Weapon",
    rarity: "Expensive",
    capacity: 2,

    description: "A practical killing machine.",
    payscale: .9,
    durability: 30,

    bonus: {
        set: {
            ["strength"]: 4,
        },
        alter:{
            ["control"]: 1,
        }
    }
    ,weaponType: "Gun",

}
const bustersword = {
    name: "Buster Sword",
    class: "Weapon",
    rarity: "Tinker Tech",
    capacity: 2,

    description: "It's not a phase mom.",
    payscale: 1,
    durability: 16,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 2,
        }
    }

    ,weaponType: "Melee",
}
const plasmablade = {

    name: "Plasma Blade",
    class: "Weapon",
    rarity: "Tinker Tech",
    capacity: 2,

    description: "Editted for copyright reasons.",
    payscale: 1.5,
    durability: 25,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 3,
            ["vitality"]: -1,
        }
    }

    ,weaponType: "Melee",
}
// COSTUME
const personalizedcostume = {
    name: "Personalized Costume",
    class: "Costume",
    rarity: "Premium Tech",
    capacity: 2,

    description: "Tailored to their every need.",
    payscale: 1,

    bonus: {
        set: {
        },
        alter:{
            ["utility"]: 1,
            ["vitality"]: 1,
        }
    }
}
const steelplate = {
    name: "Steel Plate",
    class: "Costume",
    rarity: "Fortune",
    capacity: 2,

    description: "Sturdy metal scales tied to a mesh costume.",
    payscale: 1,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 4,
            ["control"]: -1,
        }
    }
}
const powerarmor = {
    name: "Power Armor",
    class: "Costume",
    rarity: "Tinker Tech",
    capacity: 2,

    description: "BWAHAHAHAHAHA.",
    payscale: 2,
    durability: 25,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 2,
            ["vitality"]: 2,
            ["control"]: -1,
            ["technique"]: -1,
        }
    }
}
// GADGETS
const jetpack = {
    name: "Jetpack",
    class: "Gadget",
    rarity: "Tinker Tech",
    capacity: 2,

    description: "Boost into the skies. Hope you can steer.",
    payscale: 1.4,
    durability: 18,

    bonus: {
        set: {
        },
        alter:{
            ["control"]: 2,
        }
    }
}
const enhancerdrugs = {
    name: "Enhancer Drugs",
    class: "Gadget",
    rarity: "Fortune",
    capacity: 2,

    description: "Super steriods.",
    payscale: 1,
    durability: 15,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 1,
            ["vitality"]: 3,
            ["control"]: 2,
            ["utility"]: -2,
            ["technique"]: -1,
        }
    }
}
const kevlarcovering = {
    name: "Kevlar Covering",
    class: "Gadget",
    rarity: "Expensive",
    capacity: 2,

    description: "Professional ballistic reinforcement.",
    payscale: 1,
    durability: 8,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 2,
        }
    }
}
const recondrone = {
    name: "Recon Drone",
    class: "Gadget",
    rarity: "Premium Tech",
    capacity: 2,

    description: "Young drone with wishes to one day fly in the Middle East.",
    payscale: 1,
    durability: 8,

    bonus: {
        set: {
        },
        alter:{
            ["utility"]: 2,
            ["control"]: -1,
        }
    }
}

/*************************
 * 3 Capacity items
 ***********************/
// WEAPONS
const nanofilamentblade = {

    name: "Nanofilament blade",
    class: "Weapon",
    rarity: "Tinker Tech",
    capacity: 3,

    description: "Cuts through bones AND feelings.",
    payscale: 1.5,
    durability: 40,

    bonus: {
        set: {
            ["control"]: 4,
        },
        alter:{
            ["strength"]:4
        }
    }
    ,
    weaponType: "Melee",

}
// COSTUMES
const mechasuit = {
    name: "Mecha Suit",
    class: "Costume",
    rarity: "Tinker Tech",
    capacity: 3,

    description: "Giant and powerful tinker armor.",
    payscale: 4,
    durability: 25,

    bonus: {
        set: {
            ["strength"]: 5,
            ["vitality"]: 9,
        },
        alter:{
            ["control"]: 1,
            ["technique"]: -1,
        }
    }
}
const titanarmor = {
    name: "Titan Armor",
    class: "Costume",
    rarity: "Premium Tech",
    capacity: 3,

    description: "Bleeding edge protection.",
    payscale: 2,
    durability: 25,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 6,
        }
    }
}
// GADGETS
const combatAI = {
    name: "Combat Analyzer AI",
    class: "Gadget",
    rarity: "Premium Tech",
    capacity: 3,

    description: "Observes your enemies and guides your movements for the optimal outcome.",
    payscale: 1,
    durability: 35,

    bonus: {
        set: {
            ["technique"]: 5,
        },
        alter:{
            ["control"]: -2,
            ["utility"]: 3,

        }
    }
}
const precogforcast = {
    name: "Precog Forcast",
    class: "Gadget",
    rarity: "Premium Tech",
    capacity: 3,

    description: "100% accurate 49% of the time.",
    payscale: 1,
    durability: 35,

    bonus: {
        set:{
        },
        alter:{
            ["control"]: 4,
        }
    }
}




const armory = [
    knife
    ,mace
    ,helmet
    ,taser
    ,luckycharm
    ,homemadecostume

    ,sword
    ,pistol
    ,spear
    ,baseballbat
    ,crossbow
    ,brassknuckles
    ,basiccostume
    ,heavycostume
    ,lightcostume
    ,smokegrenade
    ,pipebomb
    ,grapplinghook
    ,utilitybelt
    ,molotov
    ,shield


    ,lasergun
    ,grenadelauncher
    ,flamethrower
    ,sniper
    ,assaultrifle
    ,bustersword
    ,plasmablade
    ,personalizedcostume
    ,steelplate
    ,powerarmor
    ,jetpack
    ,enhancerdrugs
    ,kevlarcovering
    ,recondrone


    ,nanofilamentblade
    ,mechasuit
    ,titanarmor
    ,combatAI
    ,precogforcast

    //prt stuff
    ,foamLauncher
];

module.exports.returnRandomRarity = (rarity)=>{ // returns a random item of given rarity
    var rareItems = [];
    for (item of armory){
        if (item.rarity.toLowerCase() == rarity.toLowerCase()){
            rareItems.push(item);
        }
    }
    return (rareItems[Math.floor(Math.random()*rareItems.length)])
}
module.exports.returnRandomClass = (itemClass,rarity,ignorables)=>{ // returns a random item of given rarity
    if (!ignorables){
        ignorables= [];
    }

    var myItems = [];
    for (let item of armory){
        if (item.class.toLowerCase() == itemClass.toLowerCase() && ignorables.indexOf(item.name) == -1 &&(!rarity||(rarity && item.rarity.toLowerCase() == rarity.toLowerCase())) ){
            myItems.push(item);
        }
    }
    if (myItems.length < 1){
        for (let item of armory){
            if (item.class.toLowerCase() == itemClass.toLowerCase()){
                myItems.push(item);
            }
        }
    }
    return (myItems[Math.floor(Math.random()*myItems.length)])
}

const statAbb = {
    ["strength"]: "👊",
    ["vitality"]: "❤️",
    ["utility"]: "⚡",
    ["control"]: "⌚",
    ["technique"]: "🎯",
};
const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]
module.exports.explainStats = (bonus)=>{
    var text = "";
    for (stat of statList){
        if (bonus.set[stat]){
            text+=statAbb[stat]+" ="+bonus.set[stat]+" "
        }
        if (bonus.alter[stat]){
           
            text+=statAbb[stat]+" "
            if (bonus.alter[stat] >0){
                text+="+"
            }
            text+=bonus.alter[stat]+" "
        }
    }
    
    return (text)
}

module.exports.calculateStats=(statSet,items)=>{
    if (!items ||  items.length < 1){
        return statSet;
    }
    //setting
    for (let item of items){
        var itemData = this.getData(item)
        var set = itemData.bonus.set;
        //console.log(statList)
        for (var stat of statList){
            if (set[stat] ){
                statSet[stat] = set[stat]
            }
        }
    }
    //altering
    for (let item of items){
        var itemData = this.getData(item)
        var alter = itemData.bonus.alter;
        for (stat of statList){
            if (alter[stat]){
                statSet[stat] = Number(statSet[stat])+Number(alter[stat])
                if (statSet[stat] < 1){
                    statSet[stat] = 1
                }
            }
        }
    }
    
    return statSet
    
}




module.exports.getData = (itemName)=>{
    if (!itemName){
        return null
    }
    //console.log(itemName)
    itemName = itemName.toLowerCase();
    for (let item of armory){
        if (itemName == item.name.toLowerCase()){
            return item;
        }
    }
    return null;
};