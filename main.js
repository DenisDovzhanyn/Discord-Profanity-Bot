require('./env')
const { Client, GatewayIntentBits } = require('discord.js');

const pg = require('knex') ({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        ssl: false
    }
    
})

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
        let numOffences;
        await pg('User')
        .insert({
            id: userId,
            user_name: userName
        }).onConflict('id')
        .ignore();

        await pg('Servers')
        .insert({
            id: serverId,
            server_name: serverName
        }).onConflict('id')
        .ignore();

        await pg('user_server_offences')
        .insert({
            user_id: userId,
            server_id: serverId,
            num_offences: 1
        })
        .onConflict(['user_id', 'server_id'])
        .merge({
            num_offences: pg.raw('user_server_offences.num_offences + 1')
        })
        .returning('num_offences')
        .then(newOffences => {
            numOffences = newOffences;
        })
        // we gotta handle stuff here
        
        if (numOffences === 1) msg.reply(`/mute ${userName} 5`)
        console.log(numOffences);
    }
});

console.log(process.env.TOKEN)
client.login(process.env.TOKEN);