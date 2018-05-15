import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";
import * as Discord from "discord.js";
import * as admin from "firebase-admin";

/* INITIALIZE WINSTON */
winston.add(winston.transports.File, { filename: "edge-ts.log" });
winston.level = "debug";
winston.info("Starting E-D-G-E TypeScript Edition...");
/* END WINSTON */

/* DECLARE VARIABLES */
let config;
let serviceAccount: string;
let database;
let refs;
let commands;
let client;
/* END VARIABLES */

/* LOAD THE CONFIGURATION FILE */
try {
    config = require("../run/config.json");
} catch (e) {
    let filePath = path.join(process.cwd(), "./run/config.json");
    if(fs.existsSync(filePath)) {
        winston.error("Failed to load config.json! Please check if node has read permissions.");
        winston.error(e);
        process.exit(1);
    }
    winston.info("Could not find config.json, creating it now...");
    let template =
        {
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

    try {
        fs.writeFileSync(filePath, JSON.stringify(template, null, "\t"));
    } catch (e) {
        winston.error("Could not write config.json, please ensure that node has write permissions!");
        winston.error(e);
        process.exit(1);
    }

    winston.info("Configuration file \"config.json\" was created in directory \"run\", please edit this file following the instructions in README.md and run the bot again.");
    process.exit(0);
}
/* END CONFIGURATION FILE */

/* INITIALIZE FIREBASE */
try {
    serviceAccount = require("../run/serviceAccountKey.json");
} catch (e) {
    winston.error("An error occurred loading serviceAccountKey.json, please check if the file exists and if node has read permissions.");
    winston.error(e);
    process.exit(1);
}
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: config.firebase.databaseURL
    });
} catch (e) {
    winston.error("Could not initialize Firebase Admin SDK!");
    winston.error(e);
    process.exit(-1);
}
database = admin.firestore();
/* END FIREBASE */

/* LOAD COMMANDS */
async function loadCommands()
{
    try {
        let cmdClasses = fs.readdirSync("./built/class-cmd");
        commands = new Discord.Collection();
        for (let file of cmdClasses) {
            winston.debug(process.cwd());
            winston.debug(`./class-cmd/${file}`);
            let command = await import(`./class-cmd/${file}`);
            let constr = Object.keys(command)[0];
            let instance = new command[constr]();
            winston.debug(instance);
            winston.debug(instance["name"]);
            commands.set(instance["name"], instance);
        }
    } catch (e) {
        winston.error("An error has occurred while loading commands!");
        winston.error(e);
        process.exit(1);
    }
}
/* END COMMANDS */

loadCommands().then(() => {
/* DISCORD.JS */
client = new Discord.Client();
refs = {
    "config": config,
    "client": client,
    "database": database,
    "commands": commands,
    "winston": winston
};
// EVENTS
client.on("ready", () => {
    winston.info("E-D-G-E TypeScript Edition ready!");
});
client.on("message", msg => {
    if (!msg.content.startsWith(config.discord.prefix) || msg.author.bot) return;
    // parses command arguments
    let args = msg.content.slice(config.discord.prefix.length).split(/ +/);
    let command = args.shift().toLowerCase();

    winston.debug(commands);

    if (!commands.has(command)) {
        winston.debug("User", msg.author.username, "tried to execute non-existing command");
        msg.reply("requested command was not found!").then(() => {
            winston.silly("Reply successfully sent");
        }, () => {
            winston.error("Could not send a reply!");
        });
        return;
    }
    try {
        let cmd = commands.get(command);

        winston.debug("command type: " + cmd["type"]);

        switch(cmd["type"]) {
            case 2:
                msg.author.id === refs.config.discord.owner ? cmd.execute(refs, msg, args) : msg.reply("you are not authorized to use this command!");
                break;
            case 1:
                (msg.author.id === refs.config.discord.owner || msg.member ? msg.member.hasPermission(client.Permissions.FLAGS.MANAGE_MESSAGES, false, true, true) : false) ? cmd.execute(refs, msg, args) : msg.reply("you are not authorized to use this command!");
                break;
            default:
                cmd.execute(refs, msg, args);
        }
    } catch (error) {
        winston.error("An error occurred while executing command!");
        winston.error(error);
        msg.reply("an error has occurred, please notify bot developers.").catch(() => { winston.error("Could not send a reply!") });
    }
});
// LOGIN
client.login(config.discord.token).catch(err => {
    winston.error("Unable to login, please check \"config.json\"");
    winston.error(err);
    process.exit(-1);
});
/* END DISCORD.JS */
});