module.exports = {
    name: 'stop',
    description: 'Stops the bot',
    execute(refs, msg, args) {
        if (msg.author.id === refs.config.owner) {
            msg.channel.send('Stopping...');
            refs.client.destroy();
        } else {
            msg.channel.send('Unauthorized!');
        }
    }
};