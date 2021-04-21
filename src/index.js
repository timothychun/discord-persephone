const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const PREFIX = '!';
// const Members = client.guilds.cache.get("GuildID").members.map()


// Login
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnected!');
});

client.on('message', (msg) => {
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;

  const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (commandName == 'hewwo') {
    return msg.channel.send('Hewwo!!');
  }

  if (commandName == 'bee') {
    return msg.channel.send('my creator is johnny and he’s the smartest person in the world');
  }

  if (commandName == 'iris') {
    return msg.channel.send('the most beautiful person to grace my pupils. i adore and love her so much');
  }

  if (commandName == 'peepee') {
    return msg.channel.send('poopoo');
  }

  if (commandName == 'shop') {
    return msg.channel.send({
      files: ['./images/shopjep.jpg'],
      'Welcome to my shop!\n Look upon my wares.',
    });
  }

  if (commandName == 'baybee') {
    return msg.channel.send('is me!!');
  }

});

// client.on('message', (msg) => {
//   if (msg.author.id === JOHNNY) {
//     if (msg.content.search('tomato') >= 0) {
//       msg.channel.send('potato');
//     }
//   }
// })

client.login(process.env.CLIENT_ID);
