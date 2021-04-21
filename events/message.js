const {owners,publicguilds} = require('../config');

const shortcuts = {
    ['m']: "menu",
    ['c']: "cape",
    ['cluster']: "scout",


    ["operation"]: "op",
    ["respond"]: "op",
    ["response"]: "op",
    ["mission"]: "op",
    ["recon"]: "op",


    ['re']: 'op',
    ["abort"]: "op",

    ["rename"]: "name",
    ["n"]: "name",
    ["s"]: "stats",
    ["t"]: "stats",
    ["team"]: "stats",
    ["stat"]: "stats",
    ["statistics"]: "stats",

    ['f']: 'feat',
    ['feats']: 'feat',
    ['feet']: 'feat',

    
    ["reserve"]: "reserve",
    ["reserves"]: "reserve",
    ["reserved"]: "reserve",
    ["res"]: "reserve",
    ["rsv"]: "reserve",

    ["recall"]: "reserve",

    ["buy"]: "shop",
    ["catalog"]: "shop",
    ["store"]: "shop",

    ["i"]: "inventory",
    ["inv"]: "inventory",
    ["inven"]: "inventory",
    ["armory"]: "inventory",
    ["armoury"]: "inventory",

    ["give"]: "inventory",
    ["equip"]: "inventory",
    ["take"]: "inventory",
    ["unequip"]: "inventory",
    ["trash"]: "inventory",

    ["tinker"]: "research",

    ['update']: "info",
    ['personalinfo']: "info",


    ['picture']: "pic",
    ['image']: "pic",
    ['logo']: "pic",
    ['approve']: "pic",

    ['switch']: "swap",

    ['lb']: "leaderboard",
    ['board']: "leaderboard",
    ['top']: "leaderboard",
    ['leader']: "leaderboard",
    ['leaders']: "leaderboard",

    ["terr"]: "map",
    ["territory"]: "map",
    ["ter"]: "map",
    ["districts"]: "map",
    ["district"]: "map",

    ["pay"]: "trade",
    ["fight"]: "arena",

    ['change']: 'admin',
    
    ['sort']: 'swap',
    ['dec']: 'decree',
    ['d']: 'decree',

    ['toggle']: 'role',
}

module.exports = async (client, message) => {
    if (message.author.bot) return; // eliminating bots
    
    const args = message.content.split(/ +/g);
    const command = args.shift().slice(client.prefix.length).toLowerCase();


    var cmd = client.commands.get(command);
    if (!cmd && shortcuts[command] != null){
        cmd = client.commands.get(shortcuts[command]);
    }

     // if message does not start with prefix then return
    if (!message.content.toLowerCase().startsWith(client.prefix)) return;
    

    if (!cmd) return; // if cmd doesnt exist
    if (!message.guild || !message.guild.me.permissions.has(["SEND_MESSAGES"])) return;


    // if cmd is only availible for shardbot
    if (cmd.requrements && cmd.requrements.shardHubOnly && !publicguilds[0]!=message.guild.id) return;

    if(cmd.requirements.ownerOnly && !owners.includes(message.author.id))
        return message.reply("You do not have permission to use this command!");

    if(cmd.requirements.userPerms && !message.member.permissions.has(cmd.requirements.userPerms))
        return message.reply(`You must have following permissions: ${missingPerms(message.member, cmd.requirements.userPerms)}`);

    if(cmd.requirements.clientPerms && !message.guild.me.permissions.has(cmd.requirements.clientPerms))
        return message.reply(`I am missing the following permissions: ${missingPerms(message.guild.me, cmd.requirements.clientPerms)}`);


    if (cmd.limits && !owners.includes(message.author.id)){
        const current = client.limits.get(`${command}-${message.author.id}`);

        if (!current) client.limits.set(`${command}-${message.author.id}`,1);
        else {
            if (current >= cmd.limits.ratelimit){
            return;}
            client.limits.set(`${command}-${message.author.id}`,current+1);
        }

        setTimeout(()=>{
            client.limits.delete(`${command}-${message.author.id}`);
        }, cmd.limits.cooldown)
    }

    if (args[0] && args[0].toLowerCase() == "help"){
        message.reply(cmd.help.description);
        return;
    }

    cmd.run(client, message, args);
}

const missingPerms = (member, perms) => {
    const missingPerms = member.permissions.missing(perms)
        .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);
    
    return missingPerms.length > 1 ?
        `${missingPerms.slice(0,-1).join(", ")} and ${missingPerms.slice(-1)[0]}` :
        missingPerms[0];
}