const { SlashCommandBuilder } = require('@discordjs/builders');

const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Sends a discord invitation link to everyone in the server.')
        .addStringOption(option => option.setName('link').setDescription('Invitation link').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Description of the sended message').setRequired(true)),
    
    async run(client, interaction)
    {
        try
        {
            const link = interaction.options.getString('link');
            let description = interaction.options.getString('description');

            try
            {
                const desc = fs.readFileSync(`${description}`);
                if(desc)
                {
                    description = desc;
                }
            }
            catch(error)
            {
                console.log(error);
            }

            interaction.guild.members.cache.forEach(async(member) =>
            {
                if(member.id != client.user.id && !member.user.bot)
                {
                    await member.send(`${description}\n${link}`).catch(() => console.log(`Error to send message ${member.user.username}`));
                }
            });

            interaction.reply('Invitations sended');
        }
        catch(error)
        {
            console.log(error);
        }
    }
}