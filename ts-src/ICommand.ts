import * as Discord from "discord.js";

export interface ICommand {
    readonly name: string;
    readonly description: string;
    readonly type: number;
    execute(refs:object, msg:Discord.Message, args:Array<string>);
    getName():string;
    getDescription():string;
    getType():number;
}