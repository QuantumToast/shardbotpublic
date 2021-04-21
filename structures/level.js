const maxLevel = 9;
const maxClusterLevel = 5;
const {getSubclass} = require('../chargen/powers')
const featsModule = require('../structures/feats');
//test 2

/*
        Level Up
    Upgrading primary stat: 45%
    Upgrading secondary stat: 30%
    Upgrading random stat: 25%

*/
const classList = {
    ['Blaster']: ['strength','control'],
    ['Breaker']: ['strength','utility'],
    ['Brute']: ['vitality','strength'],
    ['Changer']: ['vitality','technique'],
    ['Master']: ['control','utility'],
    ['Mover']: ['control','technique'],
    ['Shaker']: ['control','strength'],
    ['Stranger']: ['technique','vitality'],
    ['Striker']: ['strength','technique'],
    ['Thinker']: ['technique','utility'],
    ['Tinker']: ['utility','control'],
    ['Trump']: ['utility','vitality']

}
const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]


function calcMaxXp(level){
    return (level*25)
}

function setUp(cape){
    if(!cape.level){
        cape["level"] = 1;
        cape["xp"] = 0;
    }
}

function grantFeat(cape,text){
    if (!cape.unusedfeats){
        cape['unusedfeats']= [];
        cape['feats'] = [];
    }
    var usableFeats = featsModule.filterFeats(cape);
    if (usableFeats.length > 0){
        var newFeatData = usableFeats[Math.floor(Math.random()*usableFeats.length)];
        var newFeat= [newFeatData.name]
        if (newFeatData.potentialdata.length > 0){
            newFeat.push(newFeatData.potentialdata[Math.floor(Math.random()*newFeatData.potentialdata.length)]);
        }

        text+= 'They can now take the '+newFeatData.name+ ' feat. ';
        cape['unusedfeats'].push(newFeat);
        return text;
    };
    return 'They can not take any new feats.';
}

function levelUp(cape){
    var text = `${cape.name} leveled up to lv${cape.level}! `
    if (cape.level <= 5){// basic stat granting
        var stat;
        const lucky = Math.floor(Math.random()*100+1);
        if (lucky <=45){
            stat = classList[cape.class][0]
        }
        else if (lucky <= 45+30){
            if (cape.power.minors){
                stat= ['utility']
            }else{
                stat = classList[cape.class][1]
            }
        }
        else{
            stat = statList[Math.floor(Math.random()*statList.length)]
        }
        cape[stat]+= 1;
        text+= `They gained a point of ${stat}. `
    }else{//feat expanding
        text=grantFeat(cape,text);
    }
    

    if (cape.class == 'Tinker' && cape.level%2==0 && cape.level < 10){
        text+= "Their research has expanded! "
        if (!cape.power.subclass){
            getSubclass(cape);
        }
        //giving research
        for (var i = 0; i < cape.power.ResearchClasses.length;i++){
            if (cape.level >= i*2 && cape.power.UnlockedClasses.lastIndexOf(cape.power.ResearchClasses[i]) == -1){
                cape.power.UnlockedClasses.push(cape.power.ResearchClasses[i]);
            }
        }
    }   

    return text;
}

module.exports.giveXP = (cape,amnt)=>{
    setUp(cape);
    if(cape.level < maxLevel && (cape.level < maxClusterLevel || !cape.power.minors)){
        cape.xp+=amnt;
    }

    

    if(cape.xp >= calcMaxXp(cape.level)){
        cape.xp = cape.xp - calcMaxXp(cape.level);
        cape.level = cape.level+1

        return(levelUp(cape));
    }

    if (cape.level && cape.level > 5){
        if (Math.floor(Math.random()*100)<=Math.ceil(amnt)){
            return(grantFeat(cape,''))
        }
    }
    return(false)
}

module.exports.forceLevelUp = (cape,targetLv) =>{
    //console.log('forcing levelup')
    while (Number(cape.level) < Number(targetLv)){
        cape.level = Number(cape.level)+1
        levelUp(cape);
    }
}


module.exports.returnLevel = (cape)=>{ // returns a random item of given rarity
    setUp(cape);
    // [level, percentage, howmany ticks on a 20 progressbar]
    var data = [cape.level,Math.floor(cape.xp/calcMaxXp(cape.level)*100),Math.floor(cape.xp/calcMaxXp(cape.level)*100/5)]

    return data;
}
