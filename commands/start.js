const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");

//modules
const capeModule = require(`${filePath}/cape.js`);
const infoModule = require(`${filePath}/stats.js`);
const customModule = require("../chargen/customs.js");
const mapModule = require(`${filePath}/maps.js`);

const backups = {
    ["108349221026955264"]: {"userid":"108349221026955264","name":"Del Mar","funds":12470,"reputation":2260,"capes":[{"name":"Mara","class":"Breaker","age":15,"alias":"Mei Margo","strength":8,"vitality":8,"utility":3,"control":1,"technique":5,"level":5,"xp":0,"power":{"info":"Enters a water star state granting them elemental projectiles and intangibility, but the breaker form takes time to grow stronger.","shape":"star state","description":"water","subclass":"Cycle"},"info":"They are a case 53, their power an intrinsic part of their body.","activity":"none","id":0,"battlestats":null,"item":{"name":"Steel Plate","durability":0,"holderid":0}},{"name":"Flotsam","class":"Brute","age":24,"alias":"Heath Hinman","strength":6,"vitality":8,"utility":3,"control":1,"technique":3,"level":5,"xp":0,"power":{"info":"Protects self through projectile shields that redistributes damage to nearby targets.","shape":"fists","description":"projectile"},"info":"They have a personal vendetta against drugs.","activity":"none","id":1,"battlestats":null,"item":{"name":"Cheap Costume","durability":0,"holderid":1},"weapon":null},{"name":"Corposant","class":"Mover","age":23,"alias":"Madel Kampmann","strength":3,"vitality":6,"utility":1,"control":5,"technique":3,"level":2,"xp":18,"power":{"info":"Can move through hazards via  warping personal space while causing fiery explosions.","shape":"fists","description":"warping personal space"},"info":"It's well known that their parent was a terrifying villain.","activity":"none","id":2,"battlestats":null,"item":{"name":"Laser Gun","durability":11,"holderid":2},"weapon":"laser gun"},{"name":"Lamprey","class":"Striker","age":25,"alias":"Cairo Giorgi","strength":6,"vitality":7,"utility":2,"control":1,"technique":4,"level":2,"xp":2,"power":{"info":"Attacks with"+ 
    "radioactive strikes that create a parasitic effect in the target.","shape":"radioactive strikes","description":"radioactive"},"info":"Their power is a bud of a rival of the team.","activity":"none","id":3,"battlestats":null,"item":{"name":"Cheap Costume","durability":1,"holderid":3}},{"name":"Reef Master","class":"Changer","age":21,"alias":"Zaid Polloch","strength":5,"vitality":9,"utility":1,"control":2,"technique":4,"level":2,"xp":14,"power":{"info":"Changes cyclically into a massive carnivorous form with blaster capabilities.","shape":"carnivorous form","description":"massive"},"info":"They are a case 53, their power an intrinsic part of their body.","activity":"none","id":4,"item":null,"battlestats":null},{"name":"Boatswain","class":"Tinker","age":18,"alias":"Harri Vivie","strength":4,"vitality":5,"utility":6,"control":5,"technique":1,"level":2,"xp":8,"power":{"info":"Tinkers with  predictive weapons through working on others, but they cannot focus on one project.","shape":"predictive weapon","description":"weapons","subclass":"Combat","ResearchClasses":["Combat","Nuker","Mitigation","Ambush","Damage","Rebound"],"UnlockedClasses":["Combat"]},"info":"Their power lashes out uncontrollably under stress.","activity":"none","id":5,"battlestats":null}],"nextid":6,"activecapes":[],"armory":[{"name":"Molotov","durability":7,"holderid":-1},{"name":"Cheap Costume","durability":10,"holderid":1},{"name":"Cheap Costume","durability":10,"holderid":3},{"name":"Steel Plate","durability":20,"holderid":0},{"name":"Laser Gun","durability":20,"holderid":2},{"name":"Laser Gun","durability":20,"holderid":-1},{"name":"Buster Sword","durability":16,"holderid":-1}],"preferences":{"ping":"all","usercolor":"blue","color":"BLUE"},"info":"A coastal themed Corporate "+
    "team owned by a collection of small businesses along the shoreline.","HQ":3},

    ["153249576957116417"]: {"userid":"153249576957116417","name":"The Elementals","funds":99928,"reputation":11018,"capes":[{"name":"Eruption","class":"Master","age":23,"alias":"Renelle Bowlds","strength":2,"vitality":6,"utility":5,"control":7,"technique":5,"level":3,"xp":27,"power":{"info":"Sprouts explosive clones that have strategic ability.","shape":"clones","description":["explosive","Trample"]},"info":"Their power is a bud off of another team member.","activity":"none","id":17,"battlestats":null},{"name":"Skywalker","class":"Stranger","age":16,"alias":"Aydin Rettig","strength":4,"vitality":8,"utility":3,"control":3,"technique":10,"level":3,"xp":26,"power":{"info":"By visual illusions, is able to avoid auditory detection by a narrowly defined group of people.","shape":"fists","description":{"name":"visual illusions","pro":["technique"],"con":[],"subclass":"Ambush"}},"info":"They have a personal vendetta against drugs.","activity":"none","id":14,"battlestats":null,"item":{"name":"Sword","durability":0,"holderid":14},"weapon":"sword"},{"name":"Sandbag","class":"Master","age":25,"alias":"Terrance Wistrup","strength":5,"vitality":6,"utility":2,"control":9,"technique":5,"level":3,"xp":28,"power":{"info":"Materializes giant mites that latch onto targets.","shape":"mites","description":["giant","Anchor"]},"info":"They demand beauty in all things.","activity":"none","id":16,"battlestats":null},{"name":"Crystalline","class":"Shaker","age":20,"alias":"Eilis Amalie","strength":5,"vitality":5,"utility":2,"control":8,"technique":3,"level":3,"xp":23,"power":{"info":"Generates glass walls that cover an "
+"immense area.","shape":"walls","description":"glass"},"info":"They are a case 53, their power an intrinsic part of their body.","activity":"none","id":11,"battlestats":null},{"name":"Atmoscry","class":"Thinker","age":21,"alias":"Makai Volkan","strength":5,"vitality":4,"utility":5,"control":2,"technique":8,"level":4,"xp":6,"power":{"info":"Has increased access to environmental observation through borrowing cognitive space from those nearby, but information can be completely wrong.","shape":"fists","description":"borrowing cognitive space from those nearby"},"info":"They are willing to do anything to rise to the top of the heap.","activity":"none","id":12,"battlestats":null,"item":{"name":"Buster Sword","durability":0,"holderid":12},"weapon":"buster sword"},{"name":"Prometheus","class":"Master","age":22,"alias":"Elliott Aviva","strength":6,"vitality":5,"utility":5,"control":5,"technique":1,"level":4,"xp":34,"power":{"info":"Births flaming statues that have super strength.","shape":"statues","description":["flaming","Trample"]},"info":"They believe "
+"that their powers come from demons, gods, magic, aliens, or something similarly crazy.","activity":"none","id":4,"battlestats":null,"item":{"name":"Cheap Costume","durability":0,"holderid":4}},{"name":"Stone Golem","class":"Breaker","age":17,"alias":"Yusuf Barde","strength":11,"vitality":6,"utility":4,"control":3,"technique":4,"level":5,"xp":0,"power":{"info":"Enters a rocky leviathan state granting them armor-penetration and an elemental blast, but they slowly lose control over their form.","shape":"leviathan state","description":"rocky","subclass":"Negation"},"info":"By default, their power is extremely lethal.","activity":"none","id":13,"battlestats":null,"item":{"name":"Kevlar Vest","durability":0,"holderid":13}},{"name":"Daedalus","class":"Tinker","age":18,"alias":"Samir Guss","strength":4,"vitality":7,"utility":9,"control":5,"technique":3,"level":5,"xp":0,"power":{"info":"Tinkers with  defensive vehicles through building supercomputers to aid their creation, but their personality has been ground away into something toxic or empty.","shape":"defensive weapon","description":"vehicles","subclass":"Mitigation","ResearchClasses":["Mitigation","Nuker","Surveillance","Strategist","Damage","Artillery"],"UnlockedClasses":["Mitigation","Nuker","Surveillance"]},"info":"They have a long history of violence and a bad reputation.","activity":"none","id":15,"battlestats":null},{"name":"Abyssal","class":"Changer","age":26,"alias":"Nada Raffarty","strength":5,"vitality":10,"utility":2,"control":3,"technique":5,"level":5,"xp":0,"power":{"info":"Changes as their emotions heighten into a boney oceanic form with destructive striker properties.","shape":"oceanic form","description":"boney"},"info":"Their paranoia tends to sabatoge their long term efforts.","activity":"none","id":10,"battlestats":null,"item":{"name":"Kevlar Vest","durability":0,"holderid":10}},{"name":"Ironblood","class":"Breaker","age":25,"alias":"Magdalene Bradshaw","strength":9,"vitality":7,"utility":4,"control":2,"technique":3,"level":5,"xp":0,"power":{"info":"Enters a magnetic statue state granting them natural armour and enhanced strength, but the longer they are in breaker form, the more severe the consequences when they leave it.","shape":"statue state","description":"magnetic","subclass":"Negation"},"info":"Their power warped their normal form enough that they do not have a civilian identity.","activity":"none","id":2,"battlestats":null,"item":{"name":"Cheap Costume","durability":0,"holderid":2}}],"nextid":18,"activecapes":[],"armory":[{"name":"Cheap Costume","durability":10,"holderid":4},{"name":"Kevlar Vest","durability":8,"holderid":13},{"name":"Kevlar Vest","durability":8,"holderid":10},{"name":"Buster Sword","durability":16,"holderid":12},{"name":"Sword","durability":26,"holderid":14},{"name":"Cheap Costume","durability":10,"holderid":2},{"name":"Nanofilament blade","durability":40,"holderid":-1}],"preferences":{"ping":"all","usercolor":"purple","color":"PURPLE"},"info":"","HQ":5}

}


module.exports.run = async (client, message, args) =>{

    const hasData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (hasData != 0 && (args[0] != "RESET")) {
        if (!(args[0] && args[0].toLowerCase() == "backup" && backups[message.author.id])){
            message.reply("You are already playing. To reset your data use 'start RESET' command.");
            return;
        }
    }
    else if (hasData != 0 && hasData!= null){
        for (cape of hasData.capes){
            if (cape.activity != "none"){
                message.reply("You can not reset your data while you are on an operation.");
                return;
            }
        }
    }
    var teamData = new Object();

    if (args[0] && args[0].toLowerCase() == "backup"){
        if (backups[message.author.id]){
            teamData = backups[message.author.id];
            await client.teamsDB.set(`${message.author.id}`, teamData);
            message.reply("Backup restored!");
            message.channel.send(infoModule.teamDisplay(teamData));
            return;
        }
    }

    teamData["userid"] = message.author.id;
    teamData["name"] = (message.member.nickname || message.member.user.username)+"'s Team";
    teamData["funds"] = 100;
    teamData["reputation"] = 0;
    
    teamData["capes"] = [capeModule.genCape()];

    teamData["nextid"] = 1; // cape ids
    teamData["activecapes"] = []; // capes on operations
    teamData["armory"] = [
     /*   {name:"cool item",
        durability: 110,
        holderid: 1
        },
        {name:"dead item",
        durability: 0,
        holderid: -1
        },
        {name:"lost item",
        durability: 110,
        holderid: 3
        },
        {name:"deader item",
        durability: 0,
        holderid: -1
        },
        {name:"already existing item",
        durability: 110,
        holderid: 1
        },*/

    ]//unused weapons
    
    teamData['preferences'] = {
        ["ping"]: "all",
        ['usercolor']: "green",
        ['color']: "GREEN"

    },

    teamData["info"] = "";

    // removing old authority data from map
    if (true){
        mapModule.removeAllAuth(message.author.id);
    }

    //adding customs if they have them
    teammData = customModule.run(teamData,message.author.id);
    
    message.reply("New Game Created!");
    message.channel.send(infoModule.teamDisplay(teamData));
    for (cape of teamData.capes){
        capeModule.showData(cape, message);
    }
    message.channel.send("Welcome to Shardbot! Next step is to chose where you want your HQ to be located with the `,map HQ` command. "+
    "You can rename your team with `,name team [teamname]` and your cape with `,name [cape] [name]`");
    await client.teamsDB.set(`${message.author.id}`, teamData);

}

module.exports.help = {
    name: "start",
    description: "Sets up a new game for the user",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}