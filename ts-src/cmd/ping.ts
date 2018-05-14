module.exports = {
    name: "ping",
    description: "Ping-Pong command",
    type: 0,
    execute(refs, msg) {
        refs.winston.debug("Ping command executed by:", msg.author.username);
        msg.channel.send("Pong");
    }
};