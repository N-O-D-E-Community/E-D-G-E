/* Author: D3add3d */

module.exports = {
    name: 'stop',
    description: 'Stops the bot',
    type: 2,
    execute(refs, msg, args) {
        global.winston.debug('Stop command executed by: ', msg.author.username);
        if (msg.author.id === refs.config.discord.owner) {
            msg.channel.send('Stopping.');
            global.winston.info('Stopping.');
            setTimeout(() => {
                refs.unsub();
                refs.client.destroy();
                process.exit(0)
            }, 1000);
        } else {
            global.winston.debug('Message author not authorized to use stop command, username: ', msg.author.username);
            msg.reply('you are not authorized to run this command!');
        }
    }
};