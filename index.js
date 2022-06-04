const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const ping = require('./commands/ping.js')
const react = require('./commands/react.js')

client.on('ready',() =>{
    console.log("Client is ready!")

    ping(client,'ping',message => {
        message.channel.send('Pong!!')
    })
    react(client,'485793313442627604',['🧡','✅'])
})
client.login(config.token)