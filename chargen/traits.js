

const traits = [
    ['Calm','Aggressive'],     
    //How cape prefers to set up missions.  "setup"

    ['Impulsive','Reserved'],  
    //How cape prefers to initiate missions. "initiate"

    ['Reckless','Cautious'],   
    //How cape prefers to end missions.        "end"

    ['Stubborn','Cooperative'],             
    //Changes the weight of the cape’s agreements.
    // Cooperatives will make chaos threshold for disagreement higher while stubborns raise their own vote.
]


module.exports.genTraits = ()=>{
    var myTraits = [];
    function filter(pair){
        if (Math.floor(Math.random()*2) == 0){
            myTraits.push(pair[Math.floor(Math.random()*2)])
        }
    }
    traits.filter(filter);
    if (myTraits.length < 1){
        myTraits.push(traits[Math.floor(Math.random()*traits.length)][Math.floor(Math.random()*2)])
    }
    return myTraits;
}

module.exports.getList = (cape) =>{
    if (!cape['traits']){
        cape['traits'] = module.exports.genTraits();
    }
    return(cape.traits.join("\n"))
}
module.exports.getTraits = (cape) =>{
    if (!cape['traits']){
        cape['traits'] = module.exports.genTraits();
    }
    return(cape.traits)
}

module.exports.makeChoice = (capes,givenChoices) =>{ //setup, initiate, end

    var tieGap = 1;

    var firstChoice = 0;
    var secondChoice = 0;

    var firstCapes = [];
    var secondCapes = [];

    for (let cape of capes){
        if (!cape.traits){
            cape['traits'] = module.exports.genTraits()
        }
        if (cape.traits.includes(givenChoices[0])){
            firstChoice++;
            firstCapes.push(cape);
            if (cape.traits.includes("Stubborn")){
                firstChoice++;
            }
        }
        if (cape.traits.includes(givenChoices[1])){
            secondChoice++;
            secondCapes.push(cape);
            if (cape.traits.includes("Stubborn")){
                secondChoice++;
            }
        }
        if (cape.traits.includes("Cooperative")){
            tieGap--;
        }
        
    }

    var noTie = false
    if ((firstChoice > secondChoice && firstChoice-secondChoice >=tieGap) || (secondChoice > firstChoice && secondChoice-firstChoice >=tieGap)){
        noTie = true
    }


    if (noTie && (firstChoice != secondChoice)){
        if (firstChoice > secondChoice){
            return([givenChoices[0],firstCapes]);
        }else{
            return([givenChoices[1],secondCapes]);
        }
    }else{
        return(["tie",[...firstCapes,...secondCapes]]);
        
    }
}
