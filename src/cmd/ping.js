module.exports = {
    name: 'ping',
    description: 'Ping-Pong command',
    execute(refs, msg, args) {
        msg.channel.send('Pong? xD');
    }
};
