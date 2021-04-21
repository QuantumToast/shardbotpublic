const {token, prefix, postchannel} = require("./config");
const {Client, Collection} = require("discord.js");
const operations = require("./commands/operation.js")
const maps = require("./commands/maps.js")

const shop = require("./commands/shop.js")
const datasearch = require("./commands/database.js")




const bot = new Client({
    disableEveryone: true,
    disabledEvents: ["TYPING_START"],
});

//database: Key == 
const { VultrexDB } = require("vultrex.db");
const teamsDB = new VultrexDB({
    provider: 'sqlite',
    table: 'usertable',
    fileName: 'teamdatabase'
});
const questsDB = new VultrexDB({
    provider: "sqlite",
    table: 'questtable',
    fileName: 'questdatabase'
});
const imageQueDB = new VultrexDB({
    provider: "sqlite",
    table: 'imagetable',
    fileName: 'imagerequestque'
});
const leaderboardDB = new VultrexDB({
    provider: 'sqlite',
    table: 'leaderboards',
    fileName: 'leaderboards'
});


console.log("booting")

async function retrieveLeaderboard(){
    await leaderboardDB.connect(); // wait 
}

teamsDB.connect().then(()=>{
    console.log("got teamsdb");
    questsDB.connect().then(() => {
        console.log("got questsDB");
        imageQueDB.connect().then(() => {
            console.log("got image que");
            leaderboardDB.connect().then(() => {
                console.log("got leaderboard DB");
            
                bot.prefix = prefix;
                bot.commands = new Collection();
                bot.limits = new Map();
                bot.teamsDB = teamsDB;
                bot.questsDB = questsDB;
                bot.imagequeDB = imageQueDB;
                bot.leaderboardDB = leaderboardDB;
                
                const commands = require("./structures/command");
                commands.run(bot);
                
                const events = require('./structures/events');
                events.run(bot);
                
                bot.login(token);
                
                bot.on('ready', () => {
                    // running shop update loop
                    bot.user.setActivity(`,help | ,start`)
                    // bot.user.setActivity(`Under Maint`)
                    datasearch.setup(bot);

                    shop.setup(bot);
                    console.log("Set up shop");
                    

                    maps.setup(bot).then(()=>{
                        //bot.channels.cache.get(postchannel).send("Game is online!");
                        operations.setup(bot);
                    })

                })
            });
        });
    });
});



