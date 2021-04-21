const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");


//modules
const armoryModule = require('../structures/armory')
const searchModule = require('../structures/search');
const HQModule = require(`./headquarters`)
const leaderboardModule = require('./leaderboard.js')


var  pageTime = (2*60*1000)
const rightArrowIcon = '➡️'
const leftArrowIcon = '⬅️'


/*
Item Rarities:
Market: 30%
Expensive: 20%
Fortune: 10%
Scrap Tech: 10%
Tinker Tech: 10%
Premium Tech: 5%
*/

var sellingTags = []//names of items being sold, to crosscheck duplication
var currentSales = [];
var dailySales = [] // Market - Fortune Items
var weeklySales = [] // Tinker - Premium Tech
var scrapSales = [] //scrap items

var currentDate = null;
var currentWeek = null;
const basePrices = {
    ["Scrap Tech"]: 200,
    ["Market"]: 500,
    ["Expensive"]: 1000,
    ["Fortune"]: 2500,
    ["Tinker Tech"]: 5000,
    ["Premium Tech"]: 10000,
}

const itemClasses = [
    "Weapon", "Costume","Gadget"
]
function getRandomItem(itemClass, rarityPool,ignorables){
    var rarity = ""
    
    if (rarityPool){
        rarity = rarityPool[Math.floor(Math.random()*rarityPool.length)]
    }else{
        var randomNum = Math.floor(Math.random()*100);
    if (randomNum < 30)
        rarity ="Market";
        else if(randomNum < 50)
            rarity ="Expensive";//expensive
        else if(randomNum < 65)
            rarity ="Fortune";//fortune
        else if(randomNum < 82)
            rarity ="Scrap Tech";//scrap tech
        else if(randomNum < 92)
            rarity ="Tinker Tech";//tinker tech
        else{
            rarity = "Premium Tech";// premium tec
        }
    }

    return(armoryModule.returnRandomClass(itemClass,rarity,ignorables));
}
function newItems(){
    currentDate = new Date();

    dailySales = [];
    scrapSales = [];
    sellingTags = [];

    for (var i = 0;i<6;i++){ // daily

        var item = getRandomItem(itemClasses[Math.floor(i/2)],["Market","Expensive","Fortune"],sellingTags);
        
        dailySales.push(item)
        sellingTags.push(item.name)
    }
    if (!currentWeek || currentWeek != Math.floor(currentDate.getDate()/7 )) //weekly items
    {   
        weeklySales = []
        currentWeek = Math.floor(currentDate.getDate()/7);
        for (var i = 0;i<3;i++){ // scrap tech
            var item = getRandomItem(itemClasses[i],["Tinker Tech","Premium Tech"],sellingTags);
            
            weeklySales.push(item)
            sellingTags.push(item.name)
        }
    }

    for (var i = 0;i<3;i++){ // scrap tech
        var item = getRandomItem(itemClasses[i],["Scrap Tech"],sellingTags);
        
        scrapSales.push(item)
        sellingTags.push(item.name)
    }

    currentSales = [...dailySales,...weeklySales,...scrapSales]

    for (let i of currentSales){
        console.log("Now Selling: "+i.name)
    }
}
function isInt(value) {
    return !isNaN(value) && 
        parseInt(Number(value)) == value && 
        !isNaN(parseInt(value, 10));
}

async function buyItem(client,teamData,message,args){
    if (!args[0]){
        message.reply("Specify what item to buy.");
        return;
    }
     
    var targetItem = currentSales[args[0]-1] || null
    // if they typed the name of the item
    if (targetItem == null) {

        var results = searchModule.fillCapes(args.join(" "),currentSales,1)
        var collections = results[0];
        if (collections[0]){
            targetItem = collections[0];
        }
    }

    var stock = 1;
    
    if (args[1] && isInt(args[args.length-1])){
        stock = Number(args[args.length-1])
    }
    if (stock < 1){
        message.reply("You must buy at least 1 item.");
        return;
    }

    if (teamData.armory && teamData.armory.length >= HQModule.getMaxItems(teamData)){
        message.reply("Your inventory is full.");
        return;
    }
    if (teamData.armory.length+stock > HQModule.getMaxItems(teamData)){
        message.reply(`You can not buy ${stock} items with ${HQModule.getMaxItems(teamData)-teamData.armory.length} space available.`)
        return;
    }

    if(targetItem == null){
        message.reply(args[0]+" is not currently being sold.");
        return;
    }



    var price = Math.floor(basePrices[targetItem.rarity]*targetItem.payscale*stock);
    if (teamData.funds < price){
        message.reply("You do not have enough funds to purchase the "+targetItem.name);
        return;
    }

    teamData.funds = teamData.funds - price;

    //adding to armory, also adding armory if it was not there beforehand
    if (teamData.armory){
        for (let i = 0; i < stock;i++){
            teamData.armory.push(targetItem.name);
        }
    }
    else{
        teamData["armory"] = [];
        teamData.armory.push(targetItem.name);
    }
    
    await client.teamsDB.set(`${message.author.id}`, teamData);
    leaderboardModule.update(client,teamData);

    message.reply(`You have bought x${stock} `+targetItem.name+" for $"+price+".");

}

const itemTypeAbb = {
    ["Weapon"]: "🗡️",
    ["Costume"]: "👕",
    ["Gadget"]: "🧨",
};
module.exports.run = async (client, message, args) =>{
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }
    
    if (message.content.substring(1,4).toLowerCase() == "buy"){
        buyItem(client,teamData,message,args);
        return;
    }

    const newDate = new Date();
    if (newDate.getDate() != currentDate.getDate()){
        //console.log(newDate.getDate());
        //console.log(currentDate.getDate());
        newItems();
    }

    var displayPages = []
    
    var count = 0;

    for (var i = 0; i<3;i++){
        var display = new MessageEmbed()
        .addField("**Funds**", "$"+teamData.funds, false)
        var limit = 6;
        switch(i){
            case(0):
                display.setTitle("Daily Shop")
                display.setColor("#FFCC00")
                display.setFooter("Shop refreshes with new items in "+(24-newDate.getHours()) + " hours.");
                break;
            case(1):
                display.setColor("#0099FF")
                display.setTitle("Weekly Shop")
                limit = 9;

                break;
            case(2):
                display.setTitle("Scrapyard")
                display.setColor("#993333")
                display.setFooter("New dump in "+(24-newDate.getHours()) + " hours.");
                limit = 12;
                break;
        }

        var sales = ""
        for (let itemIndex=count;itemIndex< limit; itemIndex++){
            var item = currentSales[itemIndex];
            sales+= `${++count} ${itemTypeAbb[item.class]} **${item.name}**  📦 ${item.capacity} \n`+
            "💰 $"+Math.floor(basePrices[item.rarity]*item.payscale)+" | "+
            armoryModule.explainStats(item.bonus)+"\n*"+item.description+"*\n";
        }
        
        display.addField("**Available Products**",sales,false)
        display.addField("Help","Use command `,buy (item) (amount)` to purchase.");
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
    name: "shop",
    description: "Check the current market place. Items change every 24h",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}

module.exports.limits = {
    ratelimit: 1,
    cooldown: 1000*5
}

module.exports.setup = async ()=>{
    newItems();
}