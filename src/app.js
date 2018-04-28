console.log("starting E-D-G-E.. ");

/* FIREBASE */
const admin  = require('firebase-admin');
const serviceAccount = require("../run/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://e-d-g-e.firebaseio.com"
});
const database = admin.firestore();
/* END FIREBASE */

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
let config = require("../run/config.json");

// dynamic command dir
const cmdFiles = fs.readdirSync('./src/cmd');

const refs = {
	"config": config,
	"client": client,
	"database": database
};

client.commands = new Discord.Collection();
for (const file of cmdFiles) {
	let cmd = require(`./cmd/${file}`);
	client.commands.set(cmd.name, cmd);
}

// events
client.on('ready', () => {
	console.log("OK!");
});

client.on('message', msg => {
	if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

	// parses command arguments
	const args = msg.content.slice(config.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)){
		msg.reply("There is no such command!");
		return;
	}

	try {
		client.commands.get(command).execute(refs , msg, args);
	} catch (error) {
		console.error(error);
		msg.reply('Error :/');
	}
});

// start
client.login(config.token);
