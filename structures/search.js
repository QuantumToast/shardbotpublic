
// built for searching for a specific cape or capes() or items


function compareStrings(testStr, baseStr){
    var strength = 0;    //strength measures how much the strings match per consequitive character from left to right
    testStr = testStr.toLowerCase();
    baseStr = baseStr.toLowerCase();

    var i = 0;
    while (i == strength && i <= testStr.length && i <= baseStr.length){
        if (testStr.substring(0,i+1) == baseStr.substring(0,i+1)){
            strength++;
        }
        i++;
    }
    if (testStr.substring(strength-1,strength) == " "){
        //console.log('deteted space')
        strength--;
    }
    return(strength)
}





module.exports.fillCapes = (testString,capes,tempLimit)=>{
    //console.log('str: '+testString);
    var collection = [];
    var cutOff = 0;
    var limit = tempLimit || 1

    for (var i = 0; i < limit; i++){
        var currCape = null;
        var currStrength = 0;
        
        for (let cape of capes){
            var newStrength = compareStrings(cape.name, testString)
            if (newStrength > currStrength){
                currCape = cape;
                currStrength = newStrength;
            }
        }
        if (currCape != null){
            collection.push(currCape);
        }
        
        //.log(testString+" > "+testString.substring(currStrength+1,testString.length+1))
        testString = testString.substring(currStrength+1,testString.length+1);
        cutOff = cutOff+currStrength+1
    }
    //console.log(collection);
    return([collection, cutOff]);
}
module.exports.fillStrings = (testString,list,tempLimit)=>{
    //console.log('str: '+testString);
    var collection = [];
    var cutOff = 0;
    var limit = tempLimit || 1

    for (var i = 0; i < limit; i++){
        var currString = null;
        var currStrength = 0;
        
        for (let string of list){
            var newStrength = compareStrings(string, testString)
            if (newStrength > currStrength){
                currString = string;
                currStrength = newStrength;
            }
        }
        if (currString != null){
            collection.push(currString);
        }
        
        //.log(testString+" > "+testString.substring(currStrength+1,testString.length+1))
        testString = testString.substring(currStrength+1,testString.length+1);
        cutOff = cutOff+currStrength+1
    }
    //console.log(collection);
    return([collection, cutOff]);
}

module.exports.fillFromDatabase = (testString,database,tempLimit)=>{
    //console.log('str: '+testString);
    var collection = [];
    var cutOff = 0;
    var limit = tempLimit || 1

    for (var i = 0; i < limit; i++){
        var currTeam = null;
        var currStrength = 0;
        
        for (let pairedValue of database){
            if (pairedValue.value != 0 && pairedValue.value && pairedValue.key !='NextClusterID'){
                var newStrength = compareStrings(pairedValue.value.name, testString)
                if (newStrength > currStrength){
                    currTeam = pairedValue.value;
                    currStrength = newStrength;
                }
            }
        }
        if (currTeam != null){
            collection.push(currTeam);
        }
        //.log(testString+" > "+testString.substring(currStrength+1,testString.length+1))
        testString = testString.substring(currStrength+1,testString.length+1);
        cutOff = cutOff+currStrength+1
    }
    //console.log(collection);
    return([collection, cutOff]);
}
module.exports.fillUserList = (testString,list,tempLimit)=>{
    //console.log('str: '+testString);
    var collection = [];
    var cutOff = 0;
    var limit = tempLimit || 1

    for (var i = 0; i < limit; i++){
        var currData = null;
        var currStrength = 0;
        
        for (let data of list){
            var userData = data[1];
            
            var string = userData.displayName;
            if (!string){
                string = userData.user.username;
            }
            
            var newStrength = compareStrings(string, testString)
            if (newStrength > currStrength){
                currData = userData;
                currStrength = newStrength;
            }
        }
        if (currData != null){
            collection.push(currData);
        }
        
        //.log(testString+" > "+testString.substring(currStrength+1,testString.length+1))
        testString = testString.substring(currStrength+1,testString.length+1);
        cutOff = cutOff+currStrength+1
    }
    //console.log(collection);
    return([collection, cutOff]);
}


var testTeamData = {
    capes:[
        {
            name: "Bozer"
        },
        {
            name: "gandhI"
        },
        {
            name: "Boxer BEATZ"
        }
    ],
}


//module.exports.fillCapes("bozer gandhi boxer BEATz",testTeamData.capes,1);