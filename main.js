require('./env')
const { Client, GatewayIntentBits } = require('discord.js');
const increaseOffence  = require('./offence.service');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
    console.log(`Received message: ${msg.content}`);
    // convert to lower case first
    const sentence = msg.content.toLowerCase();
    // hit api
    const hitAPI = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${sentence}`)
    // convert promise to plain text which will either return true or false
    const response = await hitAPI.text();

    console.log(response);
    if (response === 'true'){
        // if true we will want to pull user id AND server id. We do this bc we want to tie the user offences with the server so 
        // people dont get punished for offences from other servers
        const userId = msg.author.id;
        const userName = msg.author.tag;
        const serverId = msg.guild.id;
        const serverName = msg.guild.name;
        console.log(`username: ${userName}`)
        console.log(`serverName: ${serverName}`)
        
        const numberOfOffences = increaseOffence(userId, userName, serverId, serverName);

        // we gotta handle stuff here
        msg.reply('bad');
        if (numberOfOffences === 1) {
            msg.member.timeout(5 * 60 * 1000);
            msg.channel.send('lol bro got muted for 5 min');
        } else if (numberOfOffences === 2) {
            msg.member.timeout(15 * 60 * 1000);
            msg.channel.send('LMAOOO BRO MUTED FOR 15 MIN');
        } else if (numberOfOffences >= 3){
            msg.member.ban();
            msg.channel.send('LMAOO BANNED');
        } 
        console.log(numberOfOffences);
    }
});

console.log(process.env.TOKEN)
client.login(process.env.TOKEN);