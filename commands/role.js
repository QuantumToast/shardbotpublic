const roleList = {
    ["trade"]: "775135243936989224",
    ['manhattan']: '772177728363429939',
    ['staten']: '772177684406730783',
    ['bronx']: '772177617767759874',
    ['brooklyn']: '772177655070982154',
    ['queens']: '775147647215992852',
    ['survey']: '783075338245767168',
    ['hero']: '783121530375897089',
    ['villain']: '783121635037020211',
    ['cluster']: '789362434925133824'
}            


module.exports.run = async (client, message, args) => {
    //console.log(message.guild.roles);
    if (args[0]){
        if (roleList[args[0].toLowerCase()]){
            const role = message.guild.roles.cache.get(roleList[args[0].toLowerCase()]);
            //var member = message.guild.mem

            //add role
            if(message.member.roles.cache.get(role.id)){
                message.member.roles.remove(role).catch(console.error);
                message.reply(`Removed ${args[0].toLowerCase()} role.`)
            } 
            else{
                const teamData = await client.teamsDB.get(`${message.author.id}`,null);
                //checking villain and hero roles, each requires 2k rep 
                if (args[0].toLowerCase()=='hero' && (!teamData || teamData.reputation < 1000)){
                    message.reply("You need 1,000 reputation to have the hero role.")
                    return;
                }
                if (args[0].toLowerCase()=='villain' && (!teamData || teamData.reputation > -1000)){
                    message.reply("You need -1,000 reputation to have the villain role.")
                    return;
                }
                message.member.roles.add(role).catch(console.error);
                message.reply(`Assigned ${args[0].toLowerCase()} role.`)
            }
        }else{
            return;
        }
    }else{
        message.reply(module.exports.help.description)
        return;
    }
}

module.exports.help = {
    name: "role",
    description: "Toggles optional roles for Shardbot server.\n"+
    "`hero / villain / survey /trade / manhattan / staten / bronx / brooklyn / queens `"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
    shardHubOnly: true,

}