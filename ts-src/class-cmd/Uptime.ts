/* Author: D3add3d */

import {ICommand} from "../ICommand";
import * as Discord from "discord.js";

export default class Uptime implements ICommand {
    readonly description: string;
    readonly name: string;
    readonly type: number;
    constructor() {
        this.description = "Gets the bot's uptime - replaces ping";
        this.name = "uptime";
        this.type = 0;
        //test
    }
    execute(refs: object, msg: Discord.Message, args: Array<string>) {
        refs["winston"].debug("Uptime command executed by:", msg.author.username);
        let uptime = process.uptime();
        let hours = Math.floor(uptime / 3600);
        let minutes = Math.floor(uptime / 60 % 60);
        let seconds = Math.floor(uptime % 60);
        msg.reply("Current uptime is: " + this.pad(hours) + ":" + this.pad(minutes) + ":" + this.pad(seconds)).catch(() => {
            refs["winston"].error("Unable to send reply!");
        });
    }
    pad(toPad: number): string {
        return (toPad < 10 ? "0" : "") + toPad;
    }
}