module.exports = {
	name: 'ping',
	description: 'Ping-Pong command',
	execute(config, client, msg, args) {
		msg.channel.send('Pong? xD');
	}
};
