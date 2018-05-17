/* Author: D3add3d */

import {ICommand} from "../ICommand";
import * as Discord from "discord.js";

export default class Stop implements ICommand {
    readonly description: string;
    readonly name: string;
    readonly type: number;
    constructor() {
        this.description = "Stops the bot";
        this.name = "stop";
        this.type = 2;
    }
    execute(refs: object, msg: Discord.Message, args: Array<string>) {
        refs["winston"].debug("Stop command executed by:", msg.author.username);
        msg.channel.send("Stopping.");
        refs["winston"].info("Stopping.");
        setTimeout(() => {
            refs["client"].destroy();
            process.exit(0)
        }, 1000);
    }
}