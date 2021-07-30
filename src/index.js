const Discord = require("discord.js");
const client = new Discord.Client();
const Database = require("better-sqlite3");
const path = require("path");
const fs = require('fs');
require("dotenv").config();

const queries = require("../src/db-queries");
const db = new Database(path.resolve("data/mailbox.db"));
const mailboxDir = 'data/mailbox.txt';

const PREFIX = "!";
const adminID = ['143032936952758272', '528030849439105044'];

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
  if (!msg.content.startsWith(PREFIX) || !(msg.channel instanceof Discord.DMChannel) || !adminID.includes(msg.author.id) || msg.author.bot) return;

  const filter = (m) =>
    m.author.id === msg.author.id && m.channel instanceof Discord.DMChannel;
  const collector = msg.channel.createMessageCollector(filter, {
    max: 1,
  });

  const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // if (commandName === "message") {
  //   msg.channel.send("Send your message");

  //   collector.on("collect", (m) => {
  //     console.log(`Collected ${m.content}`);
  //     queries.addMessage(db, m.content, msg.author.username);
  //   });

  //   collector.on("end", (collected) => {
  //     // console.log(`Collected ${collected.size} items`);
  //     msg.channel.send("Thank you for your message");

  //     collected.each((value) => {
  //       console.log(value.content);
  //     });
  //   });
  // }

  if (commandName === "view") {
    const mailbox = queries.openMailbox(db);
    
    fs.writeFileSync(mailboxDir, '');
    let counter = 0;
    let allMessages = "";
    for (const mail of mailbox.iterate()) {
      fs.appendFileSync(mailboxDir, `${counter++}. ${mail.author} : ${mail.message}\n`, err => {
        if (err) {
          console.error(err);
          return;
        }
      });
      // msg.channel.send(`${counter++}. ${mail.author} : ${mail.message}\n`);
      // allMessages += `${counter++}. ${mail.author} : ${mail.message}\n`;
    }
    // msg.channel.send(allMessages);
    msg.channel.send({ files: ["./data/mailbox.txt"] });
  }

  else if (commandName === "total") {
    console.log(queries.getNumMessages(db));
  }

  else if (commandName === 'clear') {
    queries.clearTable(db);
    console.log('Cleared Table');
  }

  // else {
  //   console.log(`Collected ${msg.content}`);
  //   queries.addMessage(db, msg.content, msg.author.username);
  //   msg.channel.send("Thank you for your message");
  // }
});

client.on('message', (msg) => {
  if (msg.author.bot || msg.content.startsWith(PREFIX)) return;

  console.log(`Collected ${msg.content}`);
  queries.addMessage(db, msg.content, msg.author.username);
  msg.channel.send("Thank you for your message");
});

// client.on('message', (msg) => {
//   if (msg.author.bot) return;
//   else if (msg.channel instanceof Discord.DMChannel) {
//     console.log(msg.content);
//     msg.author.send("You're DMing me now!")
//       .then(msg => console.log(`Sent message: ${msg.content}`))
//       .catch(console.error);
//     return;
//   }
// });

// client.on("message", (msg) => {
//   if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;

//   const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
//   const commandName = args.shift().toLowerCase();
// });

client.login(process.env.CLIENT_ID);
