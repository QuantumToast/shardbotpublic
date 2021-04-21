const { MessageEmbed } = require("discord.js");
const { capeicon } = require('../config');
const { getName } = require('../chargen/names');
const {genInfo} = require('../chargen/powers')
const {getSubclass} = require('../chargen/powers')
const tinkerModule = require('../chargen/classifications/tinker')

const traitsModule = require('../chargen/traits')

const armoryModule = require('../structures/armory')
const levelModule = require('../structures/level')
const flavorModule = require("../chargen/flavor.js")
const denyImage = "https://upload.wikimedia.org/wikipedia/commons/b/bc/Not_allowed.svg"
const featModule = require('../structures/feats');

const powerModule = require('../chargen/powers');
const { cairoVersion } = require("canvas");

// class color themes
const classThemes = {
    ["Blaster"]: {["color"]: 'BLUE', ["icon"]: "https://i.imgur.com/sjt5y6L.png"},
    ['Striker']: {["color"]: 'ORANGE', ['icon']: "https://i.imgur.com/U76yllw.png"},
    ['Tinker']: {['color']: 'GREY', ['icon']: "https://i.imgur.com/Q64Pd7V.png"},
    ['Changer']: {['color']: 'GREEN', ['icon']: "https://i.imgur.com/iumdz1G.png"},
    ['Breaker']: {['color']: 'YELLOW', ['icon']: "https://i.imgur.com/evXkY6N.png"},
    ['Thinker']: {['color']: 'PURPLE', ['icon']: "https://i.imgur.com/SiEuyJd.png"},
    ['Shaker']: {['color']: '#40E0D0', ['icon']: "https://i.imgur.com/RcKnK5h.png"},
    ['Master']: {['color']: '#FF61E2', ['icon']: "https://i.imgur.com/ZpiBOzo.png"},
    ['Mover']: {['color']: '#99FF33', ['icon']: "https://i.imgur.com/hIPTu0J.png"},
    ['Brute']: {['color']: 'RED', ['icon']: "https://i.imgur.com/mQR6w6h.png"},
    ['Stranger']: {['color']: 'BLACK', ['icon']: "https://i.imgur.com/zLsMIPu.png"},
    ['Trump']: {['color']: "#F2F2F2", ['icon']: 'https://i.imgur.com/HMvVCgA.png'}
}
const classEmojis = {
    ["Brute"]: "🛡️",
    ["Striker"]: "🥊",
    ["Blaster"]: "☄️",
    ["Tinker"]: "🔧",
    ["Thinker"]: "🧠",
    ["Master"]: "🕹️",
    ["Shaker"]: "⛰️",
    ["Stranger"]: "👻",
    ["Changer"]: "🦈",
    ["Breaker"]: "✨",
    ["Mover"]: "🥏",
    ["Trump"]: '♻️'
}
//baselines
const statBaseline = {
    strength: 3,
    vitality: 5,
    utility: 2,
    control: 2,
    technique: 3,
}

function newCape(args,cluster,preDefinedStatSpread){ //If cluster is a number then it should create X amount of minor power flavorings and return them in array
    var cape = new Object();
    var powerData = genInfo(args,cluster);

    cape["name"] = getName();
    cape["class"] = powerData.class;
    cape["age"] = Math.floor(Math.random()*12+12);
    cape["alias"] = cape.name;

    // randomizing stats from baseline
    if (preDefinedStatSpread){
        //console.log(preDefinedStatSpread)
        cape["strength"] = statBaseline.strength + preDefinedStatSpread[0];
        cape["vitality"] = statBaseline.vitality + preDefinedStatSpread[1];
        cape["utility"] = statBaseline.utility + preDefinedStatSpread[2];
        cape["control"] = statBaseline.control + preDefinedStatSpread[3];
        cape["technique"] = statBaseline.technique + preDefinedStatSpread[4];
    }else{
        cape["strength"] = statBaseline.strength + Math.floor(Math.random()*3) - 1;
        cape["vitality"] = statBaseline.vitality + Math.floor(Math.random()*3) - 1;
        cape["utility"] = statBaseline.utility + Math.floor(Math.random()*3) - 1;
        cape["control"] = statBaseline.control + Math.floor(Math.random()*3) - 1;
        cape["technique"] = statBaseline.technique + Math.floor(Math.random()*3) - 1;
    }
    

    cape["level"] = 0;
    cape["xp"] = 0;
    
    cape["power"] = {
        ["info"]: powerData.power,
        ["shape"]: powerData.shape,
        ['description']: powerData.description
    }

    //saving subclasses and shit
    if (cape.class == 'Tinker'){
        cape.power["ResearchClasses"]
    }
    if (cape.class=='Trump'){
        cape.power['trumpstats']=powerData.trumpstats;
        cape.power['subclass']=powerData.subclass
    }
    

    cape['info'] = flavorModule.getInfo();

    cape['activity'] = 'none';

    //console.log(cape.class+ " / "+cape.power.info);
    // adding bonus stats
    for (var attribute of powerData.bonus[0]){
        cape[attribute]++;
    }
    for (var attribute of powerData.bonus[1]){
        cape[attribute]--;
    }

    if (cape.strength < 1){
        cape.strength = 1;
    }
    if (cape.vitality < 1){
        cape.vitality = 1;
    }
    if (cape.utility < 1){
        cape.utility = 1;
    }
    if (cape.control < 1){
        cape.control = 1;
    }
    if (cape.technique < 1){
        cape.technique = 1;
    }

    /*/randomizing stats for April fools
    if (cape.strength+cape.technique+cape.vitality+cape.control+cape.utility < 23){
        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }
        let baseArray = [cape.strength,cape.vitality,cape.utility,cape.control,cape.technique]
        baseArray = shuffleArray(baseArray);
        cape.strength = baseArray[0];
        cape.vitality = baseArray[1];
        cape.utility = baseArray[2];
        cape.control = baseArray[3];
        cape.technique = baseArray[4];
    }*/


    cape["id"] = 0;

    return ([cape,powerData]);
}

const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]
const statEmojis = {
    ["strength"]: "👊",
    ["vitality"]: "❤️",
    ["utility"]: "⚡",
    ["control"]: "⌚",
    ["technique"]: "🎯",
}
const itemTypeAbb = {
    ["Weapon"]: "🗡️",
    ["Costume"]: "👕",
    ["Gadget"]: "🧨",
};

const blank = '📦'

function capeDisplay(cape, title){

    var display = new MessageEmbed()
    .setColor(classThemes[cape.class].color)
    .setAuthor(title || `New Parahuman Recruit`, classThemes[cape.class].icon)
    .addField("**Name**", cape.alias, true)
    //.addField("**Age**", `${cape.age} years old`, true)
    .addField(`${classEmojis[cape.class]} **Class**`,`${cape.class}: ${getSubclass(cape)}`,true)
    .addField(`👤 **Traits**`, traitsModule.getList(cape),true);

    if (cape["image"] && cape["image"]["approved"]){
        display.setImage(cape["image"]['url']);
    }
    if (cape["image"] && cape["image"]["denied"]){
        display.setImage(denyImage);
    }

    var powerInfo = cape.power.info;
    var clusterInfo = "";



    if (cape.power.minors){
        powerInfo+= "\n*Minor Powers*\n"
        for (let minor of cape.power.minors){
            powerInfo+=`${classEmojis[minor[3]]} (${minor[2]}): ${minor[1]}\n`
        }
        if (cape.clustermates){
            clusterInfo = `Cluster with ${concatNamesIntoList(cape.clustermates)}.`;
        }
    }

    if (cape.power.shape != 'fists' && cape.power.shape != 'weapon'){
        display.addField("**Power ⚔️**", powerInfo, false);
    }else{
        display.addField("**Power**", powerInfo, false);
    }

    
    if (cape.info){
        display.addField("**Info**", cape.info+` ${cape.age} years old. ${clusterInfo}`, false);
    }else if (clusterInfo!=""){
        display.addField("**Info**", `${cape.age} years old. ${clusterInfo}`, false);
    }
    

    var fakeStats = {
        ['strength']: cape.strength,
        ['vitality']: cape.vitality,
        ['utility']: cape.utility,
        ['control']: cape.control,
        ['technique']: cape.technique,

    }
    armoryModule.calculateStats(fakeStats,cape.items)

    var info = `👊 Strength: ${cape.strength} `;
    if (fakeStats["strength"] != cape.strength){
        info+="("+fakeStats["strength"]+")";
    }
    info+= ` | ❤️ Vitality: ${cape.vitality}`;
    if (fakeStats["vitality"]  != cape.vitality){
        info+="("+fakeStats["vitality"]+")";
    }
    info+= ` | ⚡ Utility: ${cape.utility}`;
    if (fakeStats["utility"]  != cape.utility){
        info+="("+fakeStats["utility"]+")";
    }
    info+= ` | ⌚ Control: ${cape.control}`;
    if (fakeStats["control"]  != cape.control){
        info+="("+fakeStats["control"]+")";
    }
    info+= ` | 🎯 Technique: ${cape.technique}`;
    if (fakeStats["technique"]  != cape.technique){
        info+="("+fakeStats["technique"]+")";
    }
    display.addField("**Stats**", info,false);


    var itemText = "";

    if (cape.feats && cape.feats.length > 0){
        var featText = "";
        for (let feat of cape.feats){
            featText += `${feat[0]}\n`
            var data = featModule.getFeat(feat[0]);
            var text = data.info;
            if (feat[1]){
                text=text.replace('[DATA]',feat[1]);
            }
            featText+=`*${text}*\n`

        }
        display.addField("Feats",featText);
    }

    if (cape.items && cape.items.length > 0){
        for (let item of cape.items){
            const data = armoryModule.getData(item)
            itemText+= `${itemTypeAbb[data.class]} **${item}** ${blank.repeat(data.capacity)} : `+
            armoryModule.explainStats(data.bonus)+"\n*"+data.description+"*\n"
        }
        display.addField("Items",itemText);
    }
    
    
    
    if (cape.level && cape.level > 0){
        var xpData = levelModule.returnLevel(cape);
        const fillChar = `\\`
        const emptyChar = "\xa0"
        var spaces = 20-xpData[2] 
        if (spaces<0){
            spaces = 0
        }
        
        display.addField("Level: "+cape.level,
            "`["+fillChar.repeat(xpData[2])+emptyChar.repeat(spaces)+"]`"+`(${xpData[1]}%)`
        )
    }

    if (cape.class == "Tinker" && title != "Random Parahuman"){
        display.addField("🛠️ Tinker Mastery: "+`${cape.power.UnlockedClasses.length}/${cape.power.ResearchClasses.length}`,
            `Unlocked: ${cape.power.UnlockedClasses.join(" | ")}\n`+
            "Use `,research "+cape.name+" [name]` to change their focus from the researched options. Unlock new research every 2nd level."
        )
    }

    if (title != "Random Parahuman"){
        display.setFooter("Use ,info to give your cape extra details.\nAdd a picture of your cape with ,pic\nSet feats with ,feat (cape)");
    }

    return (display);
}


//make all clustermates have the same stat baseline
const classes = [
    "Blaster",
    "Shaker",
    "Master",
    "Mover",
    "Changer",
    "Tinker",
    "Brute",
    "Stranger",
    "Breaker",
    "Thinker",
    "Striker"
]

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function concatNamesIntoList(targetList){
    var result = ""
    for (var i = 0; i < targetList.length;i++){
        if (i == targetList.length-1 && i != 0){
            result+= "and "
        }
        result+= targetList[i];
        if (i != targetList.length-1 && targetList.length > 2){
            result+= ","
        }
        if (i != targetList.length-1){
            result+= " "
        }
    }
    return result;
}




module.exports.createCluster= function createCluster(clusterSize){
    
    var clusterClasses = [];
    var clusterMates = []
    var finalCapes = []//final array of cape objs that gets exported

    var statSpread = [] //predefined stat spread
    var statTotal = 0;
    for (let i=0;i<5;i++){
        var x = (Math.floor(Math.random()*3) - 1)
        statSpread.push(x)
        statTotal+=x;
    }
    if (statTotal > 4-clusterSize){
        var reduces = statTotal-(4-clusterSize);
        for (let i=0; i<statSpread.length && reduces > 0;i++){
            if (statSpread[i]== 1){
                statSpread[i]=0;
                reduces--;
            }
        }
    }

    //getting classes
    for (let i = 0; i < clusterSize; i++){
        let newClass = classes[Math.floor(Math.random()*11)];
        while (clusterClasses.includes(newClass)){
            newClass = classes[Math.floor(Math.random()*11)];
        }
        //console.log(newClass)
        clusterClasses.push(newClass); 
    }

    

    //genning capes (cape,powerinfo): Power info hold)minors array [powersnippet,powerflavor, minorsubclass]
    for (let i = 0; i<clusterSize; i++){
        var capeData = newCape([clusterClasses[i]],clusterSize-1,shuffleArray(statSpread))
        capeData[0].power['minors']=[]
        clusterMates.push(capeData)
    }
    
    //sharing all the minor powers
    for (let i= 0; i < clusterSize;i++){
        var minors = clusterMates[i][1].minors
        var givenTick = 0;
        for (let j=0; j<clusterSize;j++){
            if (i!=j){
                var minorData = minors[givenTick];

                minorData.push(clusterClasses[i])
                clusterMates[j][0].power.minors.push(minorData)//adding class so subclass doesnt have to search
                givenTick++;

            }
        }
    }

    
    for (let capeData of clusterMates){
        finalCapes.push(capeData[0])
    }


    // removing duplicate subclasses (missing minors giving both (tinker))
    for (let cape of finalCapes){
        var mySubclass = powerModule.getSubclass(cape)

        for (let i=0;i< cape.power.minors.length;i++){
            var minorData = cape.power.minors[i]
            if (minorData[2]==mySubclass && cape.class != 'Tinker'){
                if (minorData[3]=='Tinker'){
                    minorData[2] = tinkerModule.getNewSubclass(cape.power.minors);
                    continue;
                }
                switch(mySubclass){
                    case("Negation"): //negation overlap, whatever the breaker origin gets changed
                        var availibleSubclass = ["Cycle","Focus"]
                        if (cape.class == "Breaker"){
                            cape.power.subclass = availibleSubclass[Math.floor(Math.random()*availibleSubclass.length)]
                        }
                        if (cape.class == "Brute"){
                            minorData[2] = availibleSubclass[Math.floor(Math.random()*availibleSubclass.length)];
                        }
                        break;
                    case("Nuker"):
                        var availibleSubclass = ["Artillery","Suppression"]
                        if (cape.class=="Shaker"){
                            minorData[2] = availibleSubclass[Math.floor(Math.random()*availibleSubclass.length)];
                        }
                        if (cape.class=="Blaster"){
                            minorData[2] = "Environment";
                        }
                        break;
                }
            }
            
        }
        

    }


    //adding cluster names to eachother
    for (let cape of finalCapes){
        cape['clustermates']=[]
        for (let mate of finalCapes){
            if (mate.name != cape.name){
                cape.clustermates.push(mate.name)
            }
        }
    }

    return (finalCapes)

}



module.exports.run = async (client, message, args ) => {
    
    cape = newCape(args)[0];
    message.reply(capeDisplay(cape, "Random Parahuman"));
}

module.exports.help = {
    name: "cape",
    description: "Generates a random cape. You can specify any of the currently added classes.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}
module.exports.limits = {
    ratelimit: 1,
    cooldown: 1000*2
}

//Secondary functions

module.exports.genCape = (args) =>{
    return newCape(args)[0];
}
module.exports.showData = (cape, message, title) =>{
    message.reply(capeDisplay(cape, title));
}
module.exports.returnDisplay = (cape, title) =>{
    return(capeDisplay(cape, title));
}