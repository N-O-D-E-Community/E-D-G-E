/* Author: D3add3d */

module.exports = {
    name: 'help',
    description: 'Lists all commands',
    type: 0,
    execute(refs, msg, args) {

        let type = '';

        if(msg.author.id === refs.config.discord.owner) {
            type = 2; //owner
        } else if(global.edgemods.find(elem => { return elem.snowflake === msg.author.id; })) {
            type = 1; //mod
        } else {
            type = 0; //regular
        }

        global.winston.debug('type: ' + type);

        let helpString = "```\nCommands available for you:\n";
        refs.commands.forEach((value, key, map) => {
            global.winston.debug('key: ' + key);
            if(type >= value['type']) {
                helpString = helpString.concat('\n', refs.config.discord.prefix, value['name'], ' -- ', value['description'], ' (', value['type'], ')');
            }
        });
        if(type > 0) {
            helpString = helpString.concat('\n\nWho can run these commands: 0 - anyone; 1 - moderator; 2 - owner');
        }
        helpString = helpString.concat('\n```');
        msg.author.createDM().then(chan => {
            chan.send(helpString);
        }, () => {
            msg.reply(helpString);
        });
    }
};