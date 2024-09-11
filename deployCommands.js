const { REST, Routes } = require('discord.js');
require('./env');
const command = require('./commands.js');

const commandDataInJson = [command.data.toJSON()];
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('deploying command')
        console.log(commandDataInJson);
        const sendCommand = await rest.put(
            Routes.applicationCommands(process.env.APPLICATION_ID),
            {body: commandDataInJson}
        )
    } catch(error) {
        console.log(error);
    }
    
})();

