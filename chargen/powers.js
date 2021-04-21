const {genInfo} = require('./classifications/blaster');


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
    "Striker",
    "Trump"
]



exports.genInfo = (args,cluster)=> {
    var classification = classes[Math.floor(Math.random()*classes.length)];


    if (classification == 'Trump' && cluster){
            classification = classes[Math.floor(Math.random()*11)]; //Clusters exclude Trumps... for now owo
    }
    if (classification == 'Trump'){
        if (Math.floor(Math.random()*4)+1 != 1){
            classification = classes[Math.floor(Math.random()*classes.length)];
        }
    }
    
    if (args && args[0]){
        for (paraClass of classes){
            if (paraClass.toLowerCase() === args[0].toLowerCase()){
                classification = paraClass;
            }
        }
    }


    const {genInfo} = require(`./classifications/${classification.toLowerCase()}`);

    var power = genInfo(cluster);
    power["class"] = classification;

    return power;
}


exports.getSubclass = (cape)=>{
    if (cape.class=="Human"){
        return("Human");
    }
    const {getSubclass} = require(`./classifications/${cape.class.toLowerCase()}`);
    return(getSubclass(cape.power));
}
