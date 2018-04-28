module.exports = {
    name: 'ping',
    description: 'Ping-Pong command',
    execute(refs, msg, args) {
        global.winston.debug('Ping command executed');
        msg.channel.send('Pong? xD');
    }
};
