/* Author: D3add3d */

module.exports = {
    name: "stop",
    description: "Stops the bot",
    type: 2,
    execute(refs, msg) {
        refs.winston.debug("Stop command executed by:", msg.author.username);
        msg.channel.send("Stopping.");
        refs.winston.info("Stopping.");
        setTimeout(() => {
            refs.client.destroy();
            process.exit(0)
        }, 1000);
    }
};