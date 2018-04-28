console.log("starting E-D-G-E.. ");

// load config, create template if file doesn't exist
const fs = require('fs');

try{
	var config = require("../run/config.json");
} catch(e){
  let filePath = process.cwd() + "\\run\\config.json";
  if(fs.existsSync(filePath)){
    console.log("Your config file is invalid. Please edit " + filePath);
    process.exit(1);
  }
	console.log("No config file found, creating a template.");
	let config = {};
	config.prefix = "!";
	config.token = "insert-token-here";
	config.owner = "insert-id-here";
  fs.writeFileSync(filePath, JSON.stringify(config, null, "\t"),
  function (err) { console.log(err ? 'Error :'+err : 'ok') });

  console.log("Please edit " + filePath + " and restart the app.");
	process.exit(1);
}

const Discord = require('discord.js');
const client = new Discord.Client();

// dynamic command dir
const cmdFiles = fs.readdirSync('./src/cmd');

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
		client.commands.get(command).execute(config, client, msg, args);
	} catch (error) {
		console.error(error);
		msg.reply('Error :/');
	}
});

// start
client.login(config.token);
