const Discord = require("discord.js");
const client = new Discord.Client();
const Database = require("better-sqlite3");
const path = require("path");
const fs = require('fs');
require("dotenv").config();

const queries = require("../src/db-queries");
const db = new Database(path.resolve("data/mailbox.db"));
const mailboxDir = './data/mailbox.txt';

const PREFIX = "!";
const adminID = process.env.ADMINID.split(' ');
console.log(adminID[0]);

// Login
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("for messages | !help", { type: "WATCHING" });
  queries.createTable(db);
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnected!");
});

client.on("message", (msg) => {
  if (!msg.content.startsWith(PREFIX) || 
      !(msg.channel instanceof Discord.DMChannel) || 
      !adminID.includes(msg.author.id) || 
      msg.author.bot) return;

  const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (commandName === "view") {
    msg.channel.send({ files: [mailboxDir] });
  }

  else if (commandName === "total") {
    console.log(queries.getNumMessages(db));
  }

  else if (commandName === 'clear') {
    fs.writeFileSync('./data/mailbox.db', '');
    fs.writeFileSync(mailboxDir, '');

    queries.createTable(db);

    console.log('Cleared Table');
    msg.channel.send('Cleared Table');
  }
});

client.on('message', (msg) => {
  if (msg.author.bot || 
      msg.content.startsWith(PREFIX) || 
      !(msg.channel instanceof Discord.DMChannel) ) return;

  console.log(`Collected ${msg.content}`);

  fs.appendFileSync(mailboxDir, `${msg.author.username} : ${msg.content}\n`, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
  if (msg.content === 'pee') {
    msg.channel.send('bro wtf why?');
  }
  else {
    msg.channel.send("Thank you for your message");
  }
});

client.login(process.env.CLIENT_ID);
