module.exports = {
    name: 'stop',
    description: 'Stops the bot',
    execute(config, client, msg, args) {
        if(msg.author.id === config.owner) {
            msg.channel.send('Stopping...');
            client.destroy();
        } else {
            msg.channel.send('Unauthorized!');
        }
    }
};