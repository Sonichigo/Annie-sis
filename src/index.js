const fs = require('fs');
const wait = require('util').promisify(setTimeout);
const { Client, Collection, Intents } = require('discord.js');
const Levels = require('discord-xp')
const path = require('path')
require('dotenv').config()

Levels.setURL(process.env.mongoPath)

const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '..', '.env')
})

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
const commandFiles = fs
  .readdirSync('./src/commands')
  .map(folder =>
    fs
      .readdirSync(`./src/commands/${folder}`)
      .filter(file => file.endsWith('.js'))
      .map(file => `./commands/${folder}/${file}`)
  )
  .flat();
for (file of commandFiles) {
	const command = require(`${file}`);
	client.commands.set(command.data.name, command);
   };
   
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName)
	//console.log(client.commands.get(interaction.commandName))
	await interaction.deferReply();
	await wait(2000);
  if (!command) return;
	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error);
		return interaction.editReply({ content: 'There was an error while executing this command!',ephemeral:true});
	}
});

client.on('message', async (message) => {
  if (message.author.bot) return
  if (message.channel.type === 'dm') return
  const randomXp = Math.floor(Math.random() * 10) + 10
  const hasLevelUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp)
  
  if (hasLevelUp) {
    message.reply(`Congrats! You've leveled up to level: ${(await Levels.fetch(message.author.id, message.guild.id)).level}`)
  }
})

client.login(process.env.BOT_TOKEN)

