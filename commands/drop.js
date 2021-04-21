const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const leaderboardModule = require('./leaderboard.js')

//modules


module.exports.run = async (client, message, args) =>{

    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return;
    }
    if (teamData.capes.length == 1){
        message.reply("You can not drop your only cape.");
        return;
    }

    var targetCape = teamData.capes[args[0]-1] || "null";
    var dropFromReserved = false;
    if (targetCape == "null" && teamData['reservedcapes']){
        targetCape = teamData.reservedcapes[args[0]-1-(teamData.capes.length)] || "null"
        if (targetCape != "null"){
            dropFromReserved = true;
        }
    }


    
    if (targetCape == "null"){
        message.reply("Could not identity cape."); 
        return;
    }


    if (targetCape.activity != 'none' && !dropFromReserved){
        message.reply("You can not drop an active cape!");
        return;
    }
    
    const targetId = targetCape.id;

    function calcRepCost(){
        var rsvLength = 0;
        if (teamData['reservedcapes']){
            rsvLength = teamData['reservedcapes'].length
        }
        var repCost = Math.floor(Math.abs(teamData.reputation/(teamData.capes.length+rsvLength)))
        if (targetCape['hiretime'] && Number(targetCape.hiretime)+(5*60*1000) > new Date().getTime()){
            repCost = 0;
        }
        return(repCost)
    }
    function calcTotalCapes(){
        var rsvLength = 0;
        if (teamData['reservedcapes']){
            rsvLength = teamData['reservedcapes'].length
        }
        var capeLen = teamData.capes.length+rsvLength

        return(capeLen)
    }

    const offer = await message.channel.send("React with ❌ in the next 5 minutes to drop **"+targetCape.name+"** from your team.\n"+
    "*Dropping this cape will lose you "+(calcRepCost())+ " reputation.*"
    );

    offer.react("❌");  
    const filter = (reaction, user) => {
        return reaction.emoji.name === '❌' && user.id === message.author.id;
    };
    
    offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {
        teamData = await client.teamsDB.get(`${message.author.id}`, 0);
        if (teamData.capes.length < 2){
            message.reply("Can not drop your last cape!");
            return;
        }
        for (var i = 0; i < teamData.capes.length; i++){
            var cape = teamData.capes[i];
            if (cape.id == targetId){
                if (cape.activity != "none"){
                    message.reply("You can not drop an active cape.");
                    return;
                }
                else{
                    var totalCapes = calcTotalCapes()
                    teamData.reputation = Math.ceil(teamData.reputation/totalCapes*(totalCapes-1));
                    teamData.capes.splice(i,1); // first element removed
                    await client.teamsDB.set(`${message.author.id}`, teamData);
                    leaderboardModule.update(client,teamData);

                    message.reply("Dropped "+cape.name);
                    return;
                }
            }
        }
        if (!teamData['reservedcapes']){
            return;
        }
        for (var i = 0; i < teamData.reservedcapes.length; i++){
            var cape = teamData.reservedcapes[i];
            if (cape.id == targetId){
                for (let oldItem of teamData.armory){
                    if (oldItem.holderid==cape.id){
                        oldItem.holderid = -1;
                    }
                }
                var totalCapes = calcTotalCapes()
                teamData.reputation = Math.ceil(teamData.reputation/totalCapes*(totalCapes-1));

                teamData.reservedcapes.splice(i,1); // first element removed
                await client.teamsDB.set(`${message.author.id}`, teamData);
                leaderboardModule.update(client,teamData);

                message.reply("Dropped "+cape.name);
                return;
            }
        }
    })
    .catch(collected => {
        offer.edit('You have not responded in time.');
    });
}

module.exports.help = {
    name: "drop",
    description: "Removes cape from team. `,drop [cape-id]`",
}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}