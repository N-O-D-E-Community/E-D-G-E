const winston = require('winston');
winston.add(winston.transports.File, { filename: "edge.log" });
winston.level = 'info'; //TODO: set to info in production

global.winston = winston;

winston.info('Starting E-D-G-E...');

const path = require('path');
const fs = require('fs');
let config = null;
const Discord = require('discord.js');
const client = new Discord.Client();
const admin = require('firebase-admin');

let serviceAccount = null;

try {
    // noinspection JSFileReferences
    serviceAccount = require('../run/serviceAccountKey.json');
} catch (e) {
    winston.error('Could not load serviceAccountKey.json, is it there? Is it readable?');
    process.exit(0);
}

/*
Try to load the config file, if it does not exist create one from template and save it
 */
try {
    // noinspection JSFileReferences
    config = require('../run/config.json');
} catch (e) {
    let filePath = path.join(process.cwd(), './run/config.json');
    if (fs.existsSync(filePath)) {
        winston.info('Failed to load the config.json file ' + filePath);
        winston.error(e);
        process.exit(0);
    }
    winston.info('No config file found, creating a template.');
    config = {
        "discord": {
            "token": "MY_BOT_USER_TOKEN",
            "prefix": "MY_PREFIX",
            "owner": "MY_SNOWFLAKE_ID"
        },
        "firebase": {
            "databaseURL": "https://MY_PROJECT_NAME.firebaseio.com"
        },
        "email": {
            "hostnameBlacklist": [
                "example.com"
            ],
            "ownerEmail": "admin@example.com",
            "from": "\"E-D-G-E\" <e-d-g-e@MY_DOMAIN.TLD>",
            "to": "testing@example.com, testing2@example.com",
            "smtp": {
                "host": "smtp.MY_SMTP_SERVICE.TLD",
                "port": 587,
                "secure": false,
                "auth": {
                    "user": "MY_SMTP_USER",
                    "pass": "MY_SMTP_PASSWORD"
                }
            }
        }
    };

    winston.debug('Creating config.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(config, null, "\t"));
    } catch(error) {
        winston.error('Failed to create config file! Most probably missing permissions.');
        process.exit(0);
        //winston.error(error);
    }

    winston.info('Please edit ', filePath, ' and restart the app.'); //avoid type conversion by using commas instead of concat.
    process.exit(0);
}

/* FIREBASE */
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebase.databaseURL
});
const database = admin.firestore();
/* END FIREBASE */


//BOT MODERATORS
global.edgemods = [];
database.collection('moderators').onSnapshot((snapshot) => {
    winston.debug('Collection moderators changed, updating');
    global.edgemods = [];
    snapshot.forEach(doc => {
        global.edgemods.push(doc.data());
    })
}, (error) => {
    winston.error('Error getting collection moderators');
    winston.error(error);
});
const unsub = function() {
    winston.debug('Unsubscribing...');
    database.collection('moderators').onSnapshot(() => {});
};

// dynamic command dir
const cmdFiles = fs.readdirSync('./src/cmd');

let commands = new Discord.Collection();
for (const file of cmdFiles) {
    let cmd = require(`./cmd/${file}`);
    commands.set(cmd.name, cmd);
}

const refs = {
    "config": config,
    "client": client,
    "database": database,
    "unsub": unsub,
    "commands": commands
};

// events
client.on('ready', () => {
    winston.info("E-D-G-E ready!");
});

client.on('message', msg => {
    if (!msg.content.startsWith(config.discord.prefix) || msg.author.bot) return;

    // parses command arguments
    const args = msg.content.slice(config.discord.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!commands.has(command)) {
        winston.debug('User ', msg.author.username, ' tried to execute non-existing command');
        msg.reply('requested command was not found!');
        return;
    }

    try {
        commands.get(command).execute(refs, msg, args);
    } catch (error) {
        winston.error('An error occurred while executing command!');
        winston.error(error);
        msg.reply('an error has occurred, please notify bot developers.');
    }
});

// start
client.login(config.discord.token).catch(err => {
    winston.info('******EDIT CONFIG.JSON TO CONTINUE******');
    winston.error(err);
    process.exit(0);
});
