require('./env')
const { Client, GatewayIntentBits } = require('discord.js');

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
        msg.reply('bad word u ban');
        return false;
    } 
    
});

console.log(process.env.TOKEN)
client.login(process.env.TOKEN);