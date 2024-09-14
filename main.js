require('dotenv').config()
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const { increaseUsersOffenceByOne }  = require('./offence.service');
const clear = require('./commands');
const consumeApi = require('./profanity.service');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
client.commands = new Collection();
client.commands.set(clear.data.name, clear);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    command = interaction.client.commands.get(interaction.commandName);
    
    if (!command) {
        interaction.reply(`Command ${interaction.commandName} not found`);
        return;
    }

    await command.execute(interaction);
})

client.on(Events.MessageCreate, async (msg) => {
    console.log(`Received message: ${msg.content}`);
    // convert to lower case first
    const sentence = msg.content.toLowerCase();
    // hit api
    
    // convert promise to plain text which will either return true or false
    const response = await consumeApi(sentence);

    console.log(response);
    if (response === 'true'){
        // if true we will want to pull user id AND server id. We do this bc we want to tie the user offences with the server so 
        // people dont get punished for offences from other servers
        const userId = msg.author.id;
        const userName = msg.author.tag;
        const serverId = msg.guild.id;
        const serverName = msg.guild.name;
        
        const numberOfOffences = await increaseUsersOffenceByOne(userId, userName, serverId, serverName);

        // we gotta handle stuff here
        try {
            if (numberOfOffences === 1) {
                await msg.member.timeout(5 * 60 * 1000);
                msg.channel.send(`Muted ${msg.author.displayName} for 5 minutes`);
            } else if (numberOfOffences === 2) {
                await msg.member.timeout(15 * 60 * 1000);
                await msg.channel.send(`Muted ${msg.author.displayName} for 15 minutes`);
            } else if (numberOfOffences >= 3){
                await msg.member.ban();
                msg.channel.send(`Banned ${msg.author.displayName}`);
            } 
        } catch (error) {
            msg.channel.send(`Not enough permissions to punish ${msg.author.displayName}`)
        }
       
    }
});

client.login(process.env.TOKEN);