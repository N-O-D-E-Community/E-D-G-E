/* Author: D3add3d */

import {ICommand} from "../ICommand";
import * as Discord from "discord.js";

export default class Stop implements ICommand {
    description: string;
    name: string;
    type: number;
    public constructor() {
        this.description = "Stops the bot";
        this.name = "stop";
        this.type = 2;
    }
    public execute(refs: object, msg: Discord.Message, args: Array<string>) {
        refs["winston"].debug("Stop command executed by:", msg.author.username);
        msg.channel.send("Stopping.");
        refs["winston"].info("Stopping.");
        setTimeout(() => {
            refs["client"].destroy();
            process.exit(0)
        }, 1000);
    }

    public getDescription(): string {
        return this.description;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): number {
        return this.type;
    }
}