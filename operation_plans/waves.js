// This Module is dedicated to creating and pulling enemy npc stats for waves
/*
 - Police
 - PRT
 - Independent Heros
 - Protectorate Team?/ Heroic Team?
 - Hero back up
*/

const { getLastName,getDescription } = require('../chargen/names');
const capeModule = require('../commands/cape');

const defaultGuard = {
    
    name: `Guard `,
    class:"Human",

    weapon: "Pistol",
    items:["Pistol"],

    strength: 3,
    vitality: 5,
    utility: 2,
    control: 1,
    technique: 3,
}
const defaultPolice = {
    
    name: `Officer `,
    class:"Human",

    weapon: "Pistol",
    items:["Pistol"],

    strength: 3,
    vitality: 6,
    utility: 2,
    control: 3,
    technique: 3
}
const defaultPRT = {
    
    name: `Trooper `,
    class:"Human",

    weapon: "Foam Launcher",
    items:["Foam Launcher"],

    strength: 3,
    vitality: 7,
    utility: 4,
    control: 5,
    technique: 4,
}

const defaultMerc = {
    name: `Mercenary `,
    class:"Human",

    weapon: null,
    items:["Basic Costume"],

    strength: 5,
    vitality: 8,
    utility: 2,
    control: 4,
    technique: 5
}
const mercWeapons = ['Assault Rifle','Sniper Rifle','Nanofilament blade','Grenade Launcher'];
const villainItems = ['Perso'];

module.exports.getEnemies =(enemyType,population,startingIndex) => {
    var enemies = [];
    if (!startingIndex){
        startingIndex = 0
    }

    for (let i=0;i<population;i++){
        var enemy;
        switch(enemyType){
            case("Mercenaries"):
                if (Math.floor(Math.random()*2)==1){//cape or normie
                    enemy = capeModule.genCape();
                    enemy.name = getDescription()+" Mercenary";
                    if (enemy.power.shape != 'fists'){
                        var weapon = mercWeapons[Math.floor(Math.random()*mercWeapons.length)]
                        enemy.weapon = weapon.toLowerCase();
                        enemy['items'] = [weapon]
                    }
                }else{
                    enemy = {
                        id: i+startingIndex,
                        name: getDescription()+" Mercenary",
                        class: defaultMerc.class,
                        weapon:defaultMerc.weapon,
                        items:["Basic Costume"],
                        class:"Human",

                        strength:defaultMerc.strength, 
                        vitality:defaultMerc.vitality,
                        utility:defaultMerc.utility, 
                        control:defaultMerc.control,
                        technique:defaultMerc.technique, 
                    }
                    var weapon = mercWeapons[Math.floor(Math.random()*mercWeapons.length)]
                    enemy.weapon = weapon.toLowerCase();
                    enemy.items.push(weapon)
                }
                break;
            case("Villians"): 
                enemy = capeModule.genCape();
                enemy['id'] = i+startingIndex;
                enemy.name = getDescription()+" Villain";
                enemy.items = ['Personalized Costume'];

                break;
            default:
                console.log("Default: "+enemyType )
        }


        enemies.push(enemy)
    }

    //console.log(enemies)
    return enemies;
}


module.exports.getWave = (level)=>{
    var enemyTeam = []
    switch(level){
        case(1): // guard
            for (let i = 0; i < 4; i++){
                var newGuard = {
                    id: i,
                    name: defaultGuard.name+getLastName(),
                    class: defaultGuard.class,
                    weapon:defaultGuard.weapon,
                    item:defaultGuard.item,
                    strength:defaultGuard.strength, 
                    vitality:defaultGuard.vitality,
                    utility:defaultGuard.utility, 
                    control:defaultGuard.control,
                    technique:defaultGuard.technique, 
                }
                enemyTeam.push(newGuard)
            }
            break;
        case(2): // police
            for (let i = 0; i < 5; i++){
                var newCop = {
                    id: i,
                    name: defaultPolice.name+getLastName(),
                    class: defaultPolice.class,
                    weapon:defaultPolice.weapon,
                    item:defaultPolice.item,
                    strength:defaultPolice.strength, 
                    vitality:defaultPolice.vitality,
                    utility:defaultPolice.utility, 
                    control:defaultPolice.control,
                    technique:defaultPolice.technique, 
                }
                enemyTeam.push(newCop)
            }
            break;
        case(3): //PRT
            for (let i = 0; i < 7; i++){
                var newPRT = {
                    id: i,
                    name: defaultPRT.name+getLastName(),
                    class: defaultPRT.class,
                    weapon:defaultPRT.weapon,
                    item:defaultPRT.item,
                    strength:defaultPRT.strength, 
                    vitality:defaultPRT.vitality,
                    utility:defaultPRT.utility, 
                    control:defaultPRT.control,
                    technique:defaultPRT.technique, 
                }
                enemyTeam.push(newPRT)
            }
            break;

        case(4): // Independent heros/heroteam, if not then skip directly to Hero team
            for (let i = 0; i < 3+Math.floor(Math.random()*3); i++){
                var newHero = capeModule.genCape();
                newHero.name = getDescription()+" Hero";
                enemyTeam.push(newHero)
            }
            break;
        default:
            return (getWave(1))
    }

    return enemyTeam;
}