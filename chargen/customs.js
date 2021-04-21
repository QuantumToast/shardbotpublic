
const { MessageEmbed } = require("discord.js");
const { capeicon } = require('../config');

const capeModule = require("../commands/cape.js");


// Customs, specialized data for people that helped me on the project - also for testing specific classes

const customCapes = {
    // Mandy - Forge
    ["307362180909498371"]: {
        name: "Forge",
        class: "Striker",
        age: 23,
        alias: "uhh....Sarah?",
        
        strength: 6,
        vitality: 7,
        utility: 4,
        control: 2,
        technique: 5,

        power: {
            ['subclass']: 'Damage',

            ["power"]: 'Enchants items with powers and fights with a halo of golden weapons.',
            ["bonus"]: ['strength', 'strength', 'technique'],
            ['shape']: 'golden weapons',
            ['description']: 'halo',
        }
    },
    // Quantum - Arsenal
    ["153249576957116417"]:{
        name: "Arsenal",
        class: "Tinker",
        age: 23,
        alias: "Tess Layfield",

        strength: 5,
        vitality: 3,
        utility: 7,
        control: 2,
        technique: 4,

        power: {
            ['power']: 'Tinkers with lightning powered scrap weapons.',
            ['bonus']: ['utility', 'strength'],
            ['shape']: 'scrap weapons',
            ['description']: 'lightning powered',

        }

    },
    // Oberon - Angler Danger
    ["131977273623576576"]:{
        name: "Angler Danger",
        class: "Changer",
        age: 17,
        alias: "Trent Dunbar",

        strength: 3,
        vitality: 8,
        utility: 2,
        control: 4,
        technique: 3,

        power: {
            ['power']: 'Changes bodyparts, granting various sea monster features.',
            ['bonus']: ['vitality','vitality', 'strength'],
            ['shape']: 'fins',
            ['description']: 'sea monster body',
            ['subclass']: 'Adaption',
        }
    },
    // Grenade - Bod
    ["321238339699081216"]:{
        name: "Bodhisattva",
        class: "Breaker",
        age: 20,
        alias: "Scott",

        strength: 4,
        vitality: 4,
        utility: 4,
        control: 6,
        technique: 5,

        power: {
            ['power']: "Shifts into a golden buddha statue to control order and chaos.",
            ['bonus']: ["Vitality", "Utility"],
            ['shape']: "order waves",
            ['description']: "golden energy"
        }

    },
    // ATW - Reign
    ["511907087903752195"]:{
        name: "Reign",
        class: "Shaker",
        age: 34,
        alias: "Alexander-Theodore Williams",
        
        strength: 6,
        vitality: 4,
        utility: 3,
        control: 9,
        technique: 3,
        
        power: {
            ['subclass']: 'Environment',
            ['power']: "Creates fields of fractured reality that overwrite areas of existance with his own.",
            ['bonus']: ["Control", "Control"],
            ['shape']: "laboratory hazards",
            ['description']: "fracture fields"
        }
    },
    // Aaron - Frostpunk
    ["341575500617089024"]:{
        name: "Frostpunk",
        class: "Striker",
        age: 19,
        alias: "Akari‌ ‌Kurohi‌ ‌",
        
        strength: 5,
        vitality: 4,
        utility: 3,
        control: 4,
        technique: 5,
        
        power: {
            ['subclass']: 'Damage',

            ['power']: "Creates icy limbs to attack while generating a protective frost nova around themselves.",
            ['bonus']: ["Technique", "Control"],
            ['shape']: "ice",
            ['description']: "frost nova"
        }
    },
    
    // Hyper - Athena
    ["138340069311381505"]:{
        name: "Athena",
        class: "Thinker",
        age: 17,
        alias: "Kirsten B. Griffin",

        strength: 3,
        vitality: 4,
        utility: 5,
        control: 6,
        technique: 6,
        
        power: {
            ['power']: "Nothing to see here.",
            ['bonus']: ["Technique", "Utility"],
            ['shape']: "spear",
            ['description']: "skills"
        }
    },
   // Sass - Forte
   ["202456005429297153"]:{
        name: "The Sword Sage",
        class: "Thinker",
        age: 17,
        alias: "Chet Willingham",

        strength: 5,
        vitality: 3,
        utility: 3,
        control: 4,
        technique: 6,
        
        power: {
            ['subclass']: 'Combat',
            ['power']: "Godlike mastery over sword-like objects.",
            ['bonus']: ["Strength", "Technique"],
            ['shape']: "sword",
            ['description']: "sword techniques"
        },
    },
    // Unis - DJ 
   ["195951867254145024"]:{
    name: "DJ Hip Hop",
    class: "Tinker",
    age: 1,
    alias: "DJ Hip Hop",

    strength: 3,
    vitality: 3,
    utility: 6,
    control: 5,
    technique: 4,
    
    power: {

        ['power']: "Builds reality warping musical devices.",
        ['bonus']: ["Utility", "Strength"],
        ['shape']: "vynl slicers",
        ['description']: "music waves"
    },
    },
    
    //  Jellysnake - Crystalclear (for bughunting)
    ["99372840192589824"]:{
        name: "Crystalclear",
        class: "Thinker",
        age: 24,
        alias: "Crystalclear",
    
        strength: 4,
        vitality: 4,
        utility: 6,
        control: 6,
        technique: 5,
        
        power: {
            ['power']: "Shoots exploding crystal shards that pass through barriers and can see through solid objects.",
            ['bonus']: ["Control", "Strength"],
            ['shape']: "crystal blasts",
            ['description']: "crystaline vision"
        },
    },


    // Mock - Custom AI Tinker for bughunting
    ["333719172674748428"]:{
        name: "Maestro",
        class: "Tinker",
        
        age: 31,
        alias: "Thierry Dubois",
        
        level: 1,
        xp: 0,

        strength: 3,
        vitality: 5,
        utility: 9,
        control: 8,
        technique: 1,
        
        power: {
            ['subclass']: "Strategist",
            ['UnlockedClasses']: ['Strategist'],
            ['ResearchClasses']: ['Strategist','Surveillance','Mitigation','Debuff','Combat','Ambush'],
            ['power']: "AI development of hyperspecialized learning programs which constantly grow more intelligent over time in order to teach and tell the tinker information, but often his AI goes rogue and must be destroyed.",
            ['bonus']: ["Utility", "Utility"],
            ['shape']: "analysis gun",
            ['description']: "learning AIs"
        },
    },

    // Wildbow - ? lol
    ["194265523339395072"]:{
        name: "Scion",
        class: "Tinker",
        
        age: "Countless ",
        alias: "Warrior",
        
        level: 100,
        xp: 0,

        strength: 999,
        vitality: 999,
        utility: 999,
        control: 999,
        technique: 999,
        
        power: {
            ['subclass']: "Nuker",
            ['UnlockedClasses']: ['Nuker','Artillery','Suppression','Negation','Focus','Cycle','Mitigation','Regeneration','Adaption','Feast','Growth','Trample','Swarm','Slippery','Blitz','Environment',
            'Ambush','Avoidance','Debuff','Damage','All or Nothing'],
            ['ResearchClasses']: ['Nuker','Artillery','Suppression','Negation','Focus','Cycle','Mitigation','Regeneration','Adaption','Feast','Growth','Trample','Swarm','Slippery','Blitz','Environment',
            'Ambush','Avoidance','Debuff','Damage','All or Nothing'],
            ['power']: "Yes.",
            ['info']: "Holy shit wildbow actually played my game.",
            ['bonus']: ["Utility", "Utility"],
            ['shape']: "stilling beams",
            ['description']: "obliterating"
        },
    },


    // Bug Guy - Chitter
    ["251463560058765312"]:{
    name: "Chitter",
    class: "Master",
    age: 1,
    alias: "Chitter",

    strength: 4,
    vitality: 6,
    utility: 5,
    control: 4,
    technique: 4,
    
    power: {
        ['subclass']: 'Trample',
        ['power']: "Births cannibalistic bugs that eat eachother to grow more powerful.",
        ['bonus']: ["Control", "Strength"],
        ['shape']: "giant bugs",
        ['description']: "cannibalistic"
        },
    },


    // Blinkks - Shorty
    ["148445730200092673"]:{
        name: "Shorty",
        class: "Striker",
        age: 23,
        alias: "Amelia Russel",

        strength: 6,
        vitality: 4,
        utility: 5,
        control: 4,
        technique: 5,
        
        power: {
                ['subclass']: 'All or Nothing',
                ['power']: "Alters the size of objects they touch, shrinking and expanding them.",
                ['bonus']: ["Strength", "Control"],
                ['shape']: "resizing vehicles",
                ['description']: "resizing"
            },
    },

      /*/ 
    ["Keter"]:{
        name: "Keter",
        class: "Trump",
        age: 21,
        alias: "Damien Turner",

        strength: 6,
        vitality: 4,
        utility: 7,
        control: 4,
        technique: 5,

        power: {
                ['subclass']: 'Grant',
                ['power']: "Alters the size of objects they touch, shrinking and expanding them.",
                ['bonus']: ["Strength", "Control"],
                ['shape']: "resizing vehicles",
                ['description']: "resizing"
            },
    },*/    
    // custom captain helmet
    ["captainhelmet"]: {"name":"Captain Helmet","class":"Shaker","age":19,"alias":"Bradley Stilton","strength":4,"vitality":6,"utility":7,"control":4,"technique":3,"level":1,"xp":0,"power":{"info":"Creates bubbles that manipulate universal properties inside them.","shape":"bubbles","description":"world altering","subclass":
    "Environment"},"info":"Case 70 with Locke","activity":"none","id":5,"traits":["Cooperative","Calm"],"activitytime":1606621893091,"battlestats":null,"item":null,"recoverytime":1606350122887,"weapon":null},
    
    // custom Locke
    ["locke"]: {"name":"Locke","class":"Breaker","age":19,"alias":"Lock","strength":7,"vitality":5,"utility":4,"control":2,"technique":5,"level":1,"xp":0,"power":{"info":"Eats Captain Helmet's bubbles to enter an elemental breaker state.","shape":"elemental form","description":"world twisting","subclass":
    "Focus"},"info":"Case 70 with Captain Helmet","activity":"none","id":5,"traits":["Cooperative","Calm"],"activitytime":1606621893091,"battlestats":null,"item":null,"recoverytime":1606350122887,"weapon":null},
    
    

    // custom - contessa
    ["contessa"]:{
        name: "Contessa",
        class: "Thinker",
        age: 40,
        alias: "Fortuna",

        strength: 5,
        vitality: 5,
        utility: 99,
        control: 99,
        technique: 999,
        
        power: {
                ['subclass']: 'Strategist',
                ['power']: "Path to Victory.",
                ['bonus']: ["technique",'technique'],
                ['shape']: "fists",
                ['description']: "pathed actions"
            },
    },
    
    // custom Orbit
    ["orbit"]: {"name":"Orbit","class":"Brute","age":18,"alias":"Cole Reid","strength":6,"vitality":8,"utility":4,"control":2,"technique":3,"level":1,"xp":0,"power":{"info":"Creates a floating energy wisp to strengthen and heal himself.","shape":"fists","description":"wisp","subclass":
    "Regeneration"},"info":"He's discovered that his regeneration also clears aftereffects of drug overdose... uh oh","activity":"none","id":5,"traits":["Aggressive","Impulsive","Reckless"],"activitytime":1606621893091,"battlestats":null,"item":null,"recoverytime":1606350122887,"weapon":null},
    
    //custom epsilon
    ['epsilon']: {"name":"Epsilon","class":"Blaster","age":31,"alias":"Darren Fox","strength":4,"vitality":5,"utility":3,"control":7,"technique":4,"level":1,"xp":0,"power":{"info":"Manifests a gravity well that twists reality to yank people towards them.","shape":"blasts","description":"gravity", subclass: "Nuker"},"info":"Their personality has been warped by their power, enough that they are really hard to talk to.","activity":"none","id":28,"traits":["Calm"],"activitytime":1606625760146,"battlestats":null},

    // custom nada
    ['nada']: {"name":"Nada","class":"Tinker","age":21,"alias":"Ethan Hyde","strength":3,"vitality":4,"utility":7,"control":9,"technique":3,"level":1,"xp":0,"power":{"info":"[REDACTED]","shape":"maxtrix gun","description":"virus matrix","subclass":"Mitigation","ResearchClasses":["Mitigation","Surveillance","Environment","Combat","Artillery","Ambush"],"UnlockedClasses":["Mitigation","Surveillance","Environment"]},"info":"They are extremely paranoid.","activity":"none","id":9,"traits":["Calm","Reserved","Stubborn","Cautious"],"activitytime":1606621898794,"battlestats":null,"recoverytime":1606350141963},


    //custom Crow
    ['crow']: {"name":"Crow","class":"Striker","age":26,"alias":"Max Payne","strength":3,"vitality":5,"utility":6,"control":6,"technique":6,"level":1,"xp":0,"power":{subclass: "Debuff","info":"Grows and fires debilitating needles from his hands.","shape":"needles","description":"debilitating", minors: [["gas boosts","Shoulder's vent noxious gas that propels him forward","Blitz","Mover"]]},"info":"They are completely sadistic.","clusterid": -2,"clustermates":["Oscar Peters"],"activity":"none","id":28,"traits":["Aggressive","Reserved"],"activitytime":1606625760146,"battlestats":null},


    // custom Stellar
    ['stellar']: {"name":"Stellar","class":"Shaker","age":26,"alias":"Anthony William Anderson","strength":5,"vitality":1,"utility":6,"control":7,"technique":4,"level":1,"xp":0,"power":{"info":"Summons a small galaxy that spins around him. ","shape":"debris","description":"superhot", subclass: "Nuker"},"info":"Owe Cad a favour.","activity":"none","id":28,"traits":["Cautious"],"activitytime":1606625760146,"battlestats":null},
    

    //daed's recovery
    ['loki']: {"name":"Loki 🗡️","class":"Stranger","age":16,"alias":"Aydin Rettig","strength":5,"vitality":9,"utility":3 ,"control":3,"technique":10,"level":5,"xp":0,"power":{"info":"By visual illusions, is able to avoid auditory detection by a narrowly defined group of people.","shape":"fists","description":{"name":"visual illusions","pro":["technique"],"con":[],"subclass":"Ambush"}},"info":"One of the most terrifying capes of Valhalla, Loki stays unnoticed by all during his patrols until he decides to make himself known.","activity":"none","id":46,"battlestats":null,"item":null,"weapon":null,"image":{"approved":true,"denied":false,"url":"https://cdn.discordapp.com/attachments/746064216833654914/772190168597528586/015406224c7b0162a48b62bebca6810e.png"},"activitytime":1608254265625,"recoverytime":1608117476653,"traits":["Aggressive"],"sub":"he","obj":"him","pos":"his","items":["Precog Forcast"]}
    
    // copper's recovery
    ,['kuro']: {"name":"Kuro","class":"Thinker","age":21,"alias":"Jake Kimura","strength":4,"vitality":5,"utility":7,"control":4,"technique":7,"level":5,"xp":0,"power":{"info":"Has increased access to medical knowledge through learning from their alternate-selves, but their other senses are dulled.","shape":"fists","description":"learning from their alternate-selves"},"info":"Betray them before they get the chance to stab you in the back.","activity":"[capename] has lost a loved one.","id":94,"traits":["Stubborn"],"weapon":null,"item":null,"activitytime":1608151694351,"battlestats":null,"recoverytime":1608150420931,"image":{"approved":true,"denied":false,"url":"https://i.imgur.com/0LXCxHy.png","align":"left"},"items":[]}

    //ava's recoveries
    ,['vaporwave']: {"name":"Vaporwave","class":"Blaster","age":20,"alias":"Dominique Dewar","strength":8,"vitality":6,"utility":3,"control":7,"technique":4,"level":5,"xp":2,"power":{"info":"Fires vapor waves from turrets on their shoulder that burst on contact.","shape":"waves","description":"vapor"},"info":"It's well known that their parent was a famous hero.","activity":"none","id":106,"traits":["Aggressive","Reserved","Reckless","Cooperative"],"activitytime":1607863603931,"recoverytime":1607604359297,"item":null,"weapon":null,"battlestats":null,"items":[]}
}


function getCapeData(data){
    var cape = capeModule.genCape();

    cape["name"] = data.name;
    cape["class"] = data.class;
    cape["age"] = data.age;
    cape["alias"] = data.alias;

    // randomizing stats from baseline
    cape["strength"] = data.strength ;
    cape["vitality"] = data.vitality;
    cape["utility"] = data.utility;
    cape["control"] = data.control;
    cape["technique"] = data.technique;
    
    cape["power"]['info'] = data.power.power;
    cape["power"]['description'] = data.power.description;

    cape.power.shape = data.power.shape;
    if (data.power['subclass']){
        cape.power['subclass'] = data.power['subclass'];
    }
    if (data['level']){
        cape['level'] = data['level'];
    }
    if (data['xp']){
        cape['xp'] = data['xp'];
    }
    if (data.power['UnlockedClasses']){
        cape.power['UnlockedClasses']=data.power['UnlockedClasses'];
        cape.power['ResearchClasses']=data.power['ResearchClasses'];

    }

    cape["id"] = 0;

    return cape;
}

module.exports.grabCape = (ownerid,fullData) =>{
    if (fullData =='full' && customCapes[ownerid]){
        var cape = customCapes[ownerid];
        return cape;
    }
    var custom = customCapes[ownerid];
    if (custom){
        var cape = getCapeData(custom);
        return(cape);
    }
}

module.exports.run = (teamData,authorId,fullData)=> {
    
    if (customCapes[authorId]){
        var cape = getCapeData(customCapes[authorId]);
        cape.id = teamData.nextid;
        teamData.capes.push(cape);
        teamData.nextid++;
    }

    return teamData;
}
