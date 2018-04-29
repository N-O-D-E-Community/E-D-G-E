/* Author: D3add3d */

module.exports = {
    name: 'help',
    description: 'Lists all commands',
    execute(refs, msg, args) {
        let helpString = "```\nAvailable commands:\n";
        //global.winston.debug(refs.commands);
        refs.commands.forEach((value, key, map) => {
            global.winston.debug('key: ' + key);
            //global.winston.silly(value);
            helpString.concat('\n',refs.config.discord.prefix,value['name'],'\t\t',value['description']);
        });
        helpString.concat('\n```');
        msg.channel.send(helpString);
    }
};