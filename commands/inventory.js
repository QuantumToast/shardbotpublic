const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const capeModule = require(`${filePath}/cape.js`)
const shopModule = require(`${filePath}/shop.js`)
const armoryModule = require('../structures/armory')
const searchModule = require('../structures/search');
const HQModule = require(`./headquarters`);
const { table } = require('console');
const { stringify } = require('querystring');


var  pageTime = (2*60*1000)
const rightArrowIcon = '➡️'
const leftArrowIcon = '⬅️'

function compileItemMetaData(teamData){
    //console.log(teamData.armory)
    var unUsedItems = []; // elements: ([itemobj, duplicates,count]) duplicates of max durability stack
    //console.log(teamData)
    for (var item of teamData.armory){
        var found = false;
        for (let pair of unUsedItems){
            if (pair[0]==item){
                pair[1]++;
                found= true;
            }
        }
        if (!found){
            var data = armoryModule.getData(item)

            unUsedItems.push([item,1,data])
        }
    }
    
    // Get cape's items, and remove their count from the items
    for (var cape of teamData.capes){
        if (cape.items){
            for (let item of cape.items){
                for (let pair of unUsedItems){
                    if (item == pair[0]){
                        pair[1]--;
                    }
                }
            }
        }
    }
    
    return unUsedItems;
}

async function giveItem(client,teamData,message,args){
    var unusedItems = []
    var spareData = compileItemMetaData(teamData); // elements: ([itemobj, duplicates]) duplicates of max durability stack
    
    for (let tbl of spareData){
        if (tbl[1] > 0){
            unusedItems.push(tbl[0])
        }
    }

    //finding item
    var argsConcat = args.join(" ");
    var offset = 2;

    var targetCape = teamData.capes[args[0]-1] || null
    if (targetCape && args[0]>9){ // if op num was in double digits offset increases
        offset = 3;
    }
    if (!targetCape){
        var results = searchModule.fillCapes(argsConcat,teamData.capes,1);
        var collection = results[0];
        if (collection[0]){
            targetCape = collection[0]
            offset = results[1];
        }
    }
    if (!targetCape){
        message.reply("Invalid cape.");
        return;
    }


    var targetItem = unusedItems[args[1]-1] || null;
    
    if(targetItem == null){
        var results = searchModule.fillStrings(argsConcat.substring(offset),unusedItems,1);
        var collection = results[0];
        if (collection[0]){
            //console.log(collection[0])
            targetItem = collection[0]
        }
    }

    if(targetItem == null){
        message.reply("Your item input is invalid.")
        return;
    }

    
    var data = armoryModule.getData(targetItem)

   // console.log(data);
    if (targetCape.power.shape.toLowerCase() != "fists"&&targetCape.power.shape.toLowerCase() != "weapon"){
        if (data.class == "Weapon"){
            message.reply(targetCape.name+" already uses "+targetCape.power.shape+" as a weapon. They can use Costumes or Gadgets.")
            return;
        }
    }

    var result = "Gave "+targetCape.name+" the ";
    if (targetCape.items != null){
        for (let i = 0; i < targetCape.items.length;i++){
            if (armoryModule.getData(targetCape.items[i]).class == data.class){
                result = "Swapped "+targetCape.name+"'s "+targetCape.items[i]+" for the "; 
                targetCape.items.splice(i,1);//removing old one
            }
        }
    }

    result+= targetItem+"."
    if (!targetCape['items']){
        targetCape['items'] = []
    }
    
    // weapon goes first, then costume then gadget
    targetCape['items'].push(targetItem)
    const itemPriorities = {
        ['Weapon']: 3,
        ['Costume']: 2,
        ['Gadget']: 1
    }
    
    function classSort(a,b){
        return(
            itemPriorities[armoryModule.getData(b).class]-itemPriorities[armoryModule.getData(a).class]
        )
    }
    
    targetCape['items'] = targetCape['items'].sort(classSort)


    //calculating capacity
    var calcedCapacity=0
    for (let heldItem of targetCape.items){
        calcedCapacity+= armoryModule.getData(heldItem).capacity
    }
    if (calcedCapacity > calcCapacity(targetCape)){
        message.reply(`${targetCape.name} does not have the capacity(${blank} ${calcedCapacity-data.capacity}) for the ${targetItem}(${blank} ${-data.capacity} )`);
        return;
    }

    if (data.class.toLowerCase() == "weapon"){
        targetCape["weapon"] = targetItem.toLowerCase();
    }

    await client.teamsDB.set(`${message.author.id}`, teamData);

    message.reply(result);
}
async function takeItem(client,teamData,message,args){
    var takenCapes = teamData.capes
    var takenItems = "all"; // either a name, 'all', or item type

    var argsConcat = args.join(" ");
    var offset = 2;

    var targetCape = teamData.capes[args[0]-1] || null
    if (targetCape && args[0]>9){ // if op num was in double digits offset increases
        offset = 3;
    }
    if (!targetCape){
        var results = searchModule.fillCapes(argsConcat,teamData.capes,1);
        var collection = results[0];
        if (collection[0]){
            targetCape = collection[0]
            offset = results[1];
        }
    }

    if (!targetCape && !(args[0] && args[0].toLowerCase() =='all')){
        message.reply("Invalid cape.");
        return;
    }
    else if (args[0].toLowerCase() !='all'){
        takenCapes = [targetCape]
    }

    var targetItem =  null;
    if (args[0].toLowerCase() != 'all' && targetCape.items){
        targetItem = targetCape.items[args[1]-1] || null
    }
    if(targetItem == null){
        var results = searchModule.fillStrings(argsConcat.substring(offset),teamData.armory,1);
        var collection = results[0];
        if (collection[0]){
            //console.log(collection[0])
            targetItem = collection[0]
        }
    }
    if (!targetItem && !(args[1] && (args[1].toLowerCase() =='all' || args[1].toLowerCase() =='weapon' || args[1].toLowerCase() =='gadget' || args[1].toLowerCase() =='costume'))){
        message.reply("Invalid item input.");
        return;
    }
    else if (args[1].toLowerCase() !='all'){
        takenItems = targetItem
    }else{
        takenItems = args[1].toLowerCase()
    }
    

    
    
    //console.log(teamData.armory);   
    var result = ""
    for (var cape of takenCapes){
        if (cape.items && cape.items.length > 0){
            if (takenItems == "all"){
                for (let item of cape.items){
                    result += "Took the "+item+" from "+cape.name+".\n"
                }
                cape.items = [];
                if (cape.weapon){
                    cape.weapon = null;
                }
            }else {
                var taken = false;
                for (let i = 0; i < cape.items.length && !taken; i++){
                    var item = cape.items[i]
                    if (item == takenItems || armoryModule.getData(item).class.toLowerCase() == takenItems){
                        if (armoryModule.getData(item).class == 'Weapon'){
                            cape.weapon = null;
                        }
                        taken = true;
                        result += "Took the "+item+" from "+cape.name+".\n"
                        cape.items.splice(i,1);
                    }
                }
                if (!taken && takenCapes.length == 1){
                    message.reply(targetCape.name+` does not have a(n) ${takenItems}.`);
                }
            }
        }else if (takenCapes.length == 1){
            message.reply(targetCape.name+` does not have a(n) ${takenItems}.`);
            return;
        }
    }
    //console.log(teamData.armory);
    await client.teamsDB.set(`${message.author.id}`, teamData);

    message.reply(result);
}
async function trashItem(client,teamData,message,args){
    var unusedItems = []

    var mySpareItems = compileItemMetaData(teamData)

    for (var i = 0; i<mySpareItems.length;i++){
        var tbl = mySpareItems[i]
        if (tbl[1] > 0){
            unusedItems.push(tbl[0])    
        }
    }

    //finding item
    var targetItem = unusedItems[args[0]-1] || null;

    if(targetItem == null){
        for (var i = 0;i < unusedItems.length;i++){
            var item = unusedItems[i]
            if (item && item.toLowerCase()  == args[0].toLowerCase()){
                targetItem = item
            }
        }
    }

    if(targetItem == null){
        message.reply("Your item input is invalid.")
        return;
    }

    
    const offer = await message.channel.send("React with ❌ in the next 5 minutes to destroy the "+targetItem+" permanently.");

    offer.react("❌");  
    const filter = (reaction, user) => {
        return reaction.emoji.name === '❌' && user.id === message.author.id;
    };
    
    offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {

        teamData = await client.teamsDB.get(`${message.author.id}`, 0);
        var newArmory = compileItemMetaData(teamData);
        var updatedCore = newArmory.filter(function(pair){
            if (pair[1] > 0){
                return true;
            }
            return false;
        })
        var updatedItem = null;
        var targetIndex = null;
        for (let i=0;i<updatedCore.length;i++){
            let newItem = updatedCore[i]
            if (newItem[0] == targetItem){
                targetIndex = i
                updatedItem = newItem
            }
        }
        if (updatedItem && updatedItem[1] >0 ){
            teamData.armory.splice(teamData.armory.indexOf(updatedItem[0]),1); //removed
            await client.teamsDB.set(`${message.author.id}`, teamData);
            message.reply("Deleted "+updatedItem[0]+".");
            return;
        }else if(updatedItem && updatedItem[1] ==0 ){
            message.reply("Item can not be trashed while equipped.");
            return;
        }

        message.reply("Could not find "+targetItem+".");
        return;

    })
    .catch(collected => {
        message.reply('You have not responded in time.');
    });
}


const itemTypeAbb = {
    ["Weapon"]: "🗡️",
    ["Costume"]: "👕",
    ["Gadget"]: "🧨",
};
const blank = '📦'

var personalCapacity = 3; //Cape's maximum capacity
function calcCapacity(cape){
    var myCap = 3;
    if (cape.feats){
        for (let feat of cape.feats){
            if (feat[0]=='Prepper'){
                myCap++
            }
        }
    }
    return myCap
}

module.exports.run = async (client, message, args) =>{
    const teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    //console.log(stringify(teamData))
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }
    if (!teamData.armory){
        message.reply("You have no items. Check the ,shop");
    }

    if (message.content.substring(1,5).toLowerCase() == "give" || message.content.substring(1,6).toLowerCase()=="equip"){
        giveItem(client,teamData,message,args);
        return;
    }
    if (message.content.substring(1,5).toLowerCase() == "take" || message.content.substring(1,8).toLowerCase()=="unequip"){
        takeItem(client,teamData,message,args);
        return;
    }
    if (message.content.substring(1,6).toLowerCase() == "trash"){
        trashItem(client,teamData,message,args);
        return;
    }

    var count = 0;

    var info = "";
    var activeInfo = ""

    count = 0;

    var pages = []

    var coreItems = compileItemMetaData(teamData);//lists items ['name', duplicate]

    // Get cape's items, and remove their count from the items
    for (var cape of teamData.capes){
        var myText = ""
        if (cape.power.shape != 'fists' && cape.power.shape != 'weapon'){
            myText = `⚔️ ${cape.name}: `;
        }else{
            myText = `🖐️ ${cape.name}: `
        }
        if (cape.items){
            var myCap = 0;
            for (let item of cape.items){
                for (let pair of coreItems){
                    if (item == pair[0]){
                        myText+=itemTypeAbb[pair[2].class].repeat(pair[2].capacity);
                        myCap+=pair[2].capacity
                    }
                }
            }
            myText+=blank.repeat(calcCapacity(cape)-myCap)
            if (cape.items.length > 0){
                myText+= " "+(cape.items.join(" / "))
            }
            
        }else{
            myText+= blank.repeat(calcCapacity(cape))
        }
        myText+='\n'
        activeInfo+= myText
    }

    // print the unused items
    const spaceChar = `\xa0`;

    var longestCharItem = 0;
    for (let itemPair of coreItems){
        if (itemPair[1] == 0){
            continue;
        }
        var myLength = itemPair[0].length
        if (itemPair[1] > 1){
            myLength+=5;
            if (itemPair[1] > 9){
                myLength++;
            }
        }
        if (myLength > longestCharItem){
            longestCharItem = myLength+1
        }
    }
    

    for (var itemPair of coreItems){
        if (itemPair[1] == 0){
            continue;
        }
        var item = itemPair[0]
        var data = itemPair[2]
        var duplicateTxt = "";
        

        var repeats = longestCharItem-itemPair[0].length;
        if (count > 9){
            repeats--;
        }

        if (itemPair[1] > 1){
            duplicateTxt = ` (x${itemPair[1]})`
            repeats-=5;
        }
        if (repeats < 1){ repeats = 1;}

        info+= itemTypeAbb[data.class]+"`"+`${++count} ${item}${spaceChar.repeat(repeats)} ${duplicateTxt}${"`"} ${blank.repeat(data.capacity)} `+
        armoryModule.explainStats(data.bonus)+"\n";
        if (count%10 == 0){
            pages.push(info);
            info = "";
        }
    }
    
    

    if (info == "" && pages.length < 1){
        info = "You have no unused items. Visit the shop to check some out."
        pages.push(info)
    }
    if (info != ""){
        pages.push(info);
    } 

    
    var displayPages = []
    
    for (let i = -1; i < pages.length; i++){
        var display = new MessageEmbed()
        .setColor("GREY");
        display.setTitle(teamData.name +" Armory "+`(${teamData.armory.length}/${HQModule.getMaxItems(teamData)})`)
        
        if (i==-1){
            if (activeInfo != ""){
                display.addField("**Current Capacity** "+(`${i+2}/${pages.length+1}`),activeInfo);
            }else{
                display.addField("**Equipped Items**" +(`${i+2}/${pages.length+1}`),"Your team has no items equiped.");
            }
        }else{
            display.addField("**Unused Items** "+(`${i+2}/${pages.length+1}`),pages[i]);
        }

        display.addField("Actions",
        "Give an item: `,give (cape) (item)`\n"+
        "Take an item: `,take (cape/'all') (item/'all'/item type)`\n"+
        "Trash an item: `,trash (slot)`"
        )
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
    name: "inventory",
    description: "Show's user's item inventory.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}
