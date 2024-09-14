const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { clearOffences } = require('./database.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription('Clears a users offences')
        .addUserOption(user => 
            user.setName('user')
            .setDescription('Clears this users offences')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setContexts(['Guild']),
    async execute(interaction) {
        const serverId = interaction.guildId;
        const user = interaction.options.getUser('user');
        const userId = user.id;
        // remove later these are for debugging
        console.log(serverId + " " + userId);
        await clearOffences(userId, serverId);
        await interaction.reply(`Cleared ${user}'s offences`);
    }
}