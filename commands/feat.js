const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const searchModule = require('../structures/search');
const featModule = require('../structures/feats');

const powerModule = require('../chargen/powers')


const featRemovalPrice = 25000

const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]
const classThemes = {
    ["Blaster"]: {["color"]: 'BLUE', ["icon"]: "https://i.imgur.com/sjt5y6L.png"},
    ['Striker']: {["color"]: 'ORANGE', ['icon']: "https://i.imgur.com/U76yllw.png"},
    ['Tinker']: {['color']: 'GREY', ['icon']: "https://i.imgur.com/Q64Pd7V.png"},
    ['Changer']: {['color']: 'GREEN', ['icon']: "https://i.imgur.com/iumdz1G.png"},
    ['Breaker']: {['color']: 'YELLOW', ['icon']: "https://i.imgur.com/evXkY6N.png"},
    ['Thinker']: {['color']: 'PURPLE', ['icon']: "https://i.imgur.com/SiEuyJd.png"},
    ['Shaker']: {['color']: '#40E0D0', ['icon']: "https://i.imgur.com/RcKnK5h.png"},
    ['Master']: {['color']: '#FF61E2', ['icon']: "https://i.imgur.com/ZpiBOzo.png"},
    ['Mover']: {['color']: '#99FF33', ['icon']: "https://i.imgur.com/hIPTu0J.png"},
    ['Brute']: {['color']: 'RED', ['icon']: "https://i.imgur.com/mQR6w6h.png"},
    ['Stranger']: {['color']: 'BLACK', ['icon']: "https://i.imgur.com/zLsMIPu.png"},
    ['Trump']: {['color']: "#F2F2F2", ['icon']: 'https://i.imgur.com/HMvVCgA.png'}
}

function calcMaxFeats(cape){
    if (cape.level <= 5){
        return 0;
    }
    return (cape.level-5)
}

module.exports.run = async (client, message, args) =>{
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }

    if (args[0]){
        var compiledList = [...teamData.capes]
        if (teamData['reservedcapes']){
            compiledList = [...teamData.capes, ...teamData.reservedcapes]
        }

        var targetCape = compiledList[args[0]-1] || "null"

        // if they typed the name of the cape
        if (targetCape == "null") {
            var results = searchModule.fillCapes(args.join(' '), compiledList, 1);
            var collection = results[0];
            if (collection[0]){
                targetCape = collection[0];
            }
        }
        if (targetCape == "null"){
            message.reply("Could not identity cape."); 
            return;
        }


        //console.log("saving")
        var mySubclass = powerModule.getSubclass(targetCape);

        if (args[1]){
            if (targetCape.activity != "none" || (teamData.reservedcapes && teamData.reservedcapes.includes(targetCape))){
                message.reply("You can not change feats while on a mission.")
                return;
            }

            var found = false;

            if (args[1].toLowerCase() == 'remove'){ //removing feats
                if (!targetCape.feats || targetCape.feats.length == 0){
                    message.reply(`${targetCape.name} has no feats to remove.`);
                    return;
                }
                // getting dictionary data for the search module
                var availibleFeatData = [];
                for (let feat of [...targetCape.feats,...targetCape.unusedfeats]){
                availibleFeatData.push(featModule.getFeat(feat[0]));
                }
 
                // identifying the feat grabbed
                var targetFeatData = null;
                var targetFeat= null;
                var featResults = searchModule.fillCapes(args[2],availibleFeatData);
                var collection = featResults[0];
                if (collection[0]){
                    targetFeatData = collection[0];
                }
                if (!targetFeatData){
                    message.reply("Could not identify feat.");
                    return;
                }

                var targetId = targetCape.id;
                var price = featRemovalPrice;

                //removing an unused feat should be free
                for (let feat of targetCape.unusedfeats){
                    if (feat[0] == targetFeatData.name){
                        price = 0;
                    }
                }

                const offer = await message.channel.send("React with ❌ in the next 5 minutes to **PERMANENTLY DELETE** "+targetCape.name+"'s "+targetFeatData.name+" feat for $"+price);

                offer.react("❌");  
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '❌' && user.id === message.author.id;
                };
                
                offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
                .then( async collected =>  {
                    teamData = await client.teamsDB.get(`${message.author.id}`, 0);

                    if (teamData.funds < price){
                        message.reply("You can not afford to remove a feat - $"+price)
                        return;
                    }

                    for (var i = 0; i < teamData.capes.length; i++){
                        var cape = teamData.capes[i];
                        if (cape.id == targetId){
                            if (cape.activity != "none" || (teamData.reservedcapes && teamData.reservedcapes.includes(cape))){
                                message.reply("You can not alter an active cape's feats.");
                                return;
                            }
                            else{

                                var removed = false;
                                for (let i = 0; i<cape.unusedfeats.length&& !removed;i++){
                                    if (cape.unusedfeats[i][0] == targetFeatData.name){
                                        removed = true;
                                        cape.unusedfeats.splice(i,1);
                                    }
                                }
                                for (let i = 0; i<cape.feats.length&& !removed;i++){
                                    if (cape.feats[i][0] == targetFeatData.name){
                                        removed = true;
                                        cape.feats.splice(i,1);
                                    }
                                }
                                if (!removed){
                                    message.reply("Can not find feat.")
                                    return;
                                }

                                var protoTxt = '';
                                if (targetFeatData.name == 'Prototype'){
                                    cape.items = []
                                    protoTxt = ' Their items have been taken due to their capacity changing.'
                                }

                                

                                teamData.funds = teamData.funds - price;

                                await client.teamsDB.set(`${message.author.id}`, teamData);

                                message.reply("Removed "+cape.name+`'s ${targetFeatData.name} feat.${protoTxt}`);
                                return;

                            }
                        }
                    }

                    message.reply("Could not identify cape.");
                    return;
                })
                .catch(collected => {
                    offer.edit('You have not responded in time.');
                });


            }else{//adding feats
                if (!targetCape.unusedfeats || targetCape.unusedfeats.length == 0){
                    message.reply(`${targetCape.name} has no feats availible to set.`);
                    return;
                }
                if (targetCape.feats.length >= calcMaxFeats(targetCape)){
                    messsage.reply(`${targetCape.name} can not set any more feats (Max ${calcMaxFeats(targetCape)})`);
                    return;
                }

                // getting dictionary data for the search module
                var availibleFeatData = [];
                for (let feat of targetCape.unusedfeats){
                    availibleFeatData.push(featModule.getFeat(feat[0]));
                }

                // identifying the feat grabbed
                var targetFeatData = null;
                var targetFeat= null;
                var featResults = searchModule.fillCapes(args[1],availibleFeatData);
                var collection = featResults[0];
                if (collection[0]){
                    targetFeatData = collection[0];
                }
                if (!targetFeatData){
                    message.reply("Could not identify feat.");
                    return;
                }

                const offer = await message.channel.send("React with ✅ in the next 5 minutes to add "+targetFeatData.name+" to "+targetCape.name+"'s feats.");

                offer.react("✅");  
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '✅' && user.id === message.author.id;
                };
                
                offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
                .then( async collected =>  {
                    teamData = await client.teamsDB.get(`${message.author.id}`, 0);

                    for (var i = 0; i < teamData.capes.length; i++){
                        var cape = teamData.capes[i];
                        if (cape.id == targetCape.id){
                            if (cape.activity != "none" || (teamData.reservedcapes && teamData.reservedcapes.includes(cape))){
                                message.reply("You can not alter an active cape's feats.");
                                return;
                            }

                            if (!cape.unusedfeats || cape.unusedfeats.length == 0){
                                message.reply(`${cape.name} has no feats availible to set.`);
                                return;
                            }
                            if (cape.feats.length >= calcMaxFeats(cape)){
                                messsage.reply(`${cape.name} can not set any more feats (Max ${calcMaxFeats(cape)})`);
                                return;
                            }

                            var removed = false;
                            var pushedFeat = null;
                            for (let i = 0; i<cape.unusedfeats.length&& !removed;i++){
                                if (cape.unusedfeats[i][0] == targetFeatData.name){
                                    removed = true;
                                    pushedFeat = cape.unusedfeats[i]
                                    cape.unusedfeats.splice(i,1);
                                }
                            }
                            if (!removed){
                                message.reply("Can not find feat.")
                                return;
                            }
                            cape.feats.push(pushedFeat)
                            


                            await client.teamsDB.set(`${message.author.id}`, teamData);

                            message.reply(`Added ${pushedFeat[0]} to ${cape.name}'s feats.`);
                            return;

                            
                        }
                    }

                    message.reply("Could not identify cape.");
                    return;
                })
                .catch(collected => {
                    offer.edit('You have not responded in time.');
                });
            }
            

            

        }else{
            var display = new MessageEmbed()
            .setColor(classThemes[targetCape.class].color)
            .setAuthor(`${targetCape.name} Feats`);

            var activeFeats = '';
            var unusedFeats = '';
            var featLength = 0;
            if (targetCape.feats){
                featLength = targetCape.feats.length
                for (let feat of targetCape.feats){
                    activeFeats += `**${feat[0]}**\n`
                    var data = featModule.getFeat(feat[0]);
                    var text = data.info;
                    if (feat[1]){
                        text=text.replace('[DATA]',feat[1]);
                    }
                    activeFeats+=`*${text}*\n`

                }
                for (let feat of targetCape.unusedfeats){
                    unusedFeats += `**${feat[0]}**\n`
                    var data = featModule.getFeat(feat[0]);
                    var text = data.info;

                    if (feat[1]){
                        text = text.replace("[DATA]",feat[1]);
                    }
                    unusedFeats+=`*${text}*\n`

                }
            }

            if (activeFeats==''){
                activeFeats = 'No active feats.';
            }
            if (unusedFeats==''){
                unusedFeats = 'No unused feats.';
            }
            display.addField(`Feats ${featLength}/${calcMaxFeats(targetCape)}`,activeFeats)
            display.addField(`Unset Feats`,unusedFeats)

            display.addField(`Management`,
            'Set a feat: `,feat (cape) (feat)`\n'+
            'Remove a feat for $'+featRemovalPrice+' or an unused feat for free:\n`,feat (cape) remove (feat)`'
            )
            message.reply(display)
        }

        await client.teamsDB.set(`${message.author.id}`, teamData);
        return;
    }

    message.reply("Specify a cape to bring up their available feats. `,feat (cape)`");
}

module.exports.help = {
    name: "feat",
    description: "Give feats to your cape to improve specific areas.",
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
