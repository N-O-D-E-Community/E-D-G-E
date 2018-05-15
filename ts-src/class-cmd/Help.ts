/* Author: D3add3d */

import {ICommand} from "../ICommand";
import * as Discord from "discord.js";

export default class Help implements ICommand {
    readonly description: string;
    readonly name: string;
    readonly type: number;

    constructor() {
        this.description = "Lists all commands";
        this.name = "help";
        this.type = 0;
    }

    execute(refs: object, msg: Discord.Message, args: Array<string>) {
        let type = 0;
        if(msg.author.id === refs["config"].discord.owner) {
            type = 2; //owner
        } else if(msg.member ? msg.member.hasPermission(refs["client"].Permissions.FLAGS.MANAGE_MESSAGES, false, true, true) : false) {
            type = 1; //mod
        } else {
            type = 0; //regular
        }
        refs["winston"].debug("type: " + type);
        let helpString = "```\nCommands available for you:\n";
        refs["commands"].forEach((value, key) => {
            refs["winston"].debug("key: " + key);
            if(type >= value.getType()) {
                helpString = helpString.concat("\n", refs["config"].discord.prefix, value.getName(), " -- ", value.getDescription(), " (", value.getType(), ")");
            }
        });
        if(type > 0) {
            helpString = helpString.concat("\n\nWho can run these commands: 0 - anyone; 1 - moderator; 2 - owner");
        }
        helpString = helpString.concat("\n```");
        msg.author.createDM().then(chan => {
            chan.send(helpString);
        }, () => {
            msg.reply(helpString).catch(() => { refs["winston"].error("Unable to send reply!") });
        });
    }

    getDescription(): string {
        return this.description;
    }

    getName(): string {
        return this.name;
    }

    getType(): number {
        return this.type;
    }

}