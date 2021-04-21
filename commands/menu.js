const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");
const {capeIcon,prefix} = require("../config.js");
var  pageTime = (2*60*1000)
const rightArrowIcon = '➡️'
const leftArrowIcon = '⬅️'

const Canvas = require('canvas');

const pages = [
    {
        title: "Team Management",
        list: [    //[cmd, desc]
            ['stats [cape]','Open team or cape stat card.'],
            ["name ['team' | cape] [text]","Change your team's name or cape's alias." ],
            ["info ['team' | cape] [text]","Change a cape's or your team's info blurb." ],
            ["pic ['team' | cape-id] [img url]","Add an image to your team or cape card." ],
            ["scout","Pay $500 to be offered a new recruit."],
            ["drop [cape]","Remove a cape from your team."],
            ["swap [cape id] [cape id]","Swap the positions of two capes on your roster."],
            ["sort [key]","Sort your team by level or stats."],
            ["upgrade","Buy a HQ expansion."],
            ["research","Manage tinker subclasses."]
        ]
    },
    {
        title: "Operations & Territory",
        list: [    //[cmd, desc]
            ['op',"Shows avalible operations."],
            ['re',"Shows response menu."],
            ['abort [capes]',"Ends the cape's ongoing mission."],
            ["map", 'Manage HQ and district authority.'],
            ["decree", 'Implement bonuses in districts you control.']
        ]
    },
    {
        title: "Gear Management",
        list: [    //[cmd, desc]
            ['shop',"Opens today's catalog."],
            ['buy [item]',"Purchases an item from catalog."],

            ['armory',"View bought items."],
            ['give [item] [cape]',"Give cape bought item."],
            ['take [cape]',"Takes item a cape is holding."],
            ['trash [item]','Delete item from armory.']
        ]
    },
    {
        title: "Multiplayer",
        list: [    //[cmd, desc]
            ['trade',"Opens today's catalog."],
            ['leaderboard',"Display leaderboards for districts,rep, or funds."],
            ['fight',"Challenge another team to a simulated fight."],
            ['search [team] [cape]', "Show a specific team or character card."]
        ]
    }
]




module.exports.run = async (client, message, args) =>{

    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }

    var color = 'BLUE';
    if (teamData['preferences'] && teamData['preferences']['color']){
        color = teamData['preferences']['color']
    }


    var displayPages = []

    for (let i = 0; i < pages.length; i++){
        var display = new MessageEmbed()
        .setColor(color);
        display.setTitle("Shardbot Menu");
        var infoList = "";
        for (let cmd of pages[i].list){
            infoList+="`"+prefix+cmd[0]+"` "+cmd[1]+"\n";
        }
        display.addField(pages[i].title+(` ${i+1}/${pages.length}`),infoList);

        display.addField("Misc",
        "`,help [cmd]` for more details.\n`,pref` to open preference settings.")
        displayPages.push(display)
    }

    var currentPage = 0
    const myPost = await message.reply(displayPages[currentPage]);
    myPost.react(leftArrowIcon);  
    myPost.react(rightArrowIcon); 
    
    const filter = (reaction, user) => {
        if ((reaction.emoji.name === leftArrowIcon || reaction.emoji.name === rightArrowIcon) && user.id === message.author.id){
            
            function flip(){
                myPost.edit(displayPages[currentPage]);
                myPost.react(leftArrowIcon);  
                myPost.react(rightArrowIcon); 
            }
            if (reaction.emoji.name === rightArrowIcon && displayPages[currentPage+1]){
                currentPage++;
                flip();
                return true;
            }
            if (reaction.emoji.name === leftArrowIcon && displayPages[currentPage-1]){
                currentPage--;
                flip();
                return true;
            }
        }
    };
    myPost.awaitReactions(filter, {max: 10, time: pageTime, errors: ['time'] })
    .then( collected =>  {})
    .catch(collected => {
        // console.log("end inven paging")
     });
}

module.exports.help = {
    name: "menu",
    description: "Shows game's main menu and command directory.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}
module.exports.limits = {
    ratelimit: 3,
    cooldown: 1000*5
}
