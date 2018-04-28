console.log('Starting E-D-G-E...');

const path = require('path');
const fs = require('fs');
let config = null;
const Discord = require('discord.js');
const client = new Discord.Client();
const admin = require('firebase-admin');
const serviceAccount = require('../run/serviceAccountKey.json');

/*
Try to load the config file, if it does not exist create one from template and save it
 */
try {
    config = require('../run/config.json');
} catch (e) {
    let filePath = path.join(process.cwd(), './run/config.json');
    if (fs.existsSync(filePath)) {
        console.log('Failed to load the config.json file ' + filePath);
        console.error(e);
        process.exit(0);
    }
    console.log('No config file found, creating a template.');
    config = {
        "token": "YOUR_TOKEN",
        "prefix": "YOUR_PREFIX",
        "owner": "YOUR_SNOWFLAKE_ID",
        "databaseURL": "FIREBASEIO_DATABASE_URL"
    };

    try {
        fs.writeFileSync(filePath, JSON.stringify(config, null, "\t"));
    } catch(error) {
        console.log('Failed to create config file!');
        console.error(error);
    }

    console.log('Please edit ', filePath, ' and restart the app.'); //avoid type conversion by using commas instead of concat.
    process.exit(0);
}

/* FIREBASE */
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.databaseURL
});
const database = admin.firestore();
/* END FIREBASE */

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

    if (!client.commands.has(command)) {
        msg.reply('requested command was not found!');
        return;
    }

    try {
        client.commands.get(command).execute(refs, msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('an error has occurred, please notify bot developers.');
    }
});

// start
client.login(config.token).catch(err => {
    console.log('******EDIT CONFIG.JSON TO CONTINUE******');
    console.log(err);
    process.exit(0);
});
