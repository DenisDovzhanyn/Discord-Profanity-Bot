require('./env')
const { Client, GatewayIntentBits } = require('discord.js');

const curses = [
    'fuck',
    'cock',
    'penis',
    'poop',
    'shit'
]
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

client.on('messageCreate', msg => {
    console.log(`Received message: ${msg.content}`);
    curses.every(curse => {
        const sentence = msg.content.toLowerCase();
        if (sentence.includes(curse)){
            msg.reply('bad word u ban');
            return false;
        } 
    })
});

console.log(process.env.TOKEN)
client.login(process.env.TOKEN);