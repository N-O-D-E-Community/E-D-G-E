module.exports = {
    name: "ping",
    description: "Ping-Pong command",
    type: 0,
    execute(refs, msg, args) {
        refs.winston.debug("Ping command executed");
        msg.channel.send("Pong");
    }
};