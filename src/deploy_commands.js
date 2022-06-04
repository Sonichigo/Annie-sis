const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path')
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
require('dotenv').config()

const dotenv = require('dotenv')

dotenv.config({
  path: path.join(__dirname, '..', '.env')
})
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands = [];

const commandFiles = fs
  .readdirSync('./src/commands')
  .map(folder =>
    fs
      .readdirSync(`./src/commands/${folder}`)
      .filter(file => file.endsWith('.js'))
      .map(file => `./commands/${folder}/${file}`)
  )
  .flat();

for (const file of commandFiles) {
  const command = require(`${file}`);
  if (Object.keys(command).length === 0) continue;
  commands.push(command.data.toJSON());
}

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID), {
      body: commands
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();


/*
rest.get(Routes.applicationCommands(process.env.CLIENT_ID))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationCommands(process.env.CLIENT_ID)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    })
    .then(rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands
    }));
    */