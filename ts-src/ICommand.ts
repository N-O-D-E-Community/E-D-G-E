import * as Discord from "discord.js";

export interface ICommand {
    name: string;
    description: string;
    type: number;
    execute(refs:object, msg:Discord.Message, args:Array<string>);
    getName():string;
    getDescription():string;
    getType():number;
}