/* Author: D3add3d */

module.exports = {
    name: 'help',
    description: 'Lists all commands',
    execute(refs, msg, args) {
        let helpString = "```\nAvailable commands:\n";
        refs.commands.forEach((value, key, map) => {
            global.winston.debug('key: ' + key);
            helpString = helpString.concat('\n',refs.config.discord.prefix,value['name'],' -- ',value['description']);
        });
        helpString = helpString.concat('\n```');
        msg.channel.send(helpString);
    }
};