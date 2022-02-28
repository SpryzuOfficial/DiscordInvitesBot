const fs = require('fs');

require('dotenv').config();

const {Client, Intents, Collection} = require('discord.js');

const createSlash = require('./slashcommands');
const keepAlive = require('./server');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES]});

client.slashcommands = new Collection();
const slashCommandFiles = fs.readdirSync('./slash_commands').filter(file => file.endsWith('.js'));

for(const file of slashCommandFiles)
{
    const slash = require(`./slash_commands/${file}`);
    client.slashcommands.set(slash.data.name, slash);
}

createSlash();
client.on('ready', () =>
{
    console.log(client.user.tag);
});

client.on('interactionCreate', async(interaction) =>
{
    try
    {
        if(interaction.isCommand())
        {
            const slashcmds = client.slashcommands.get(interaction.commandName);

            if(!slashcmds) return;

            await slashcmds.run(client, interaction);
        }
    }
    catch(error)
    {
        console.log(error);
    }
});

if(process.env.PRODUCTION == 1)
{
    keepAlive
}

client.login(process.env.TOKEN);