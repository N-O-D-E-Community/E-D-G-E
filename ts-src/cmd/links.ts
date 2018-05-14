/* Author: D3ad3dd */

import * as nodemailer from "nodemailer";

module.exports = {
    name: "links",
    description: "`send`s or `list`s links that have not yet been sent",
    type: 1,
    execute(refs, msg, args) {
        refs.winston.info("links executed by",msg.author.username);
        let content = "";

        if(args[0].equals("send")) {

            refs.database.collection("links").where("seen", "==", false).get().then(snapshot => {
                refs.winston.debug("Snapshot size :" + snapshot.size);
                refs.winston.debug("Snapshot empty:" + snapshot.empty);
                if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                        let data = doc.data();
                        let tmp = data.user + "," + data.link + "\n";
                        content = content + tmp;
                        refs.database.collection("links").doc(doc.id).update({"seen": true});
                    });

                    /* NODEMAILER START */
                    let transporter = nodemailer.createTransport({
                        host: refs.config.email.smtp.host,
                        port: refs.config.email.smtp.port,
                        secure: refs.config.email.smtp.secure,
                        auth: {
                            user: refs.config.email.smtp.auth.user,
                            pass: refs.config.email.smtp.auth.pass
                        }
                    });

                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: refs.config.email.from, // sender address
                        to: refs.config.email.to, // list of receivers //links@n-o-d-e.net
                        subject: '[E-D-G-E] <' + new Date().toDateString() + '> Collection of links from the N-O-D-E community Discord server', // Subject line
                        text: "Hello,\nI am E-D-G-E, a bot on the N-O-D-E community unofficial Discord server.\nThe attachment contains a list of links submitted by the members of N-O-D-E community unofficial Discord server.\nIf the list contains any hostnames that slipped my filter(e.g. NSFW content) please contact an administrator(" + refs.config.email.ownerEmail + ") listing the hostnames you want filtered in the e-mail and the bot administrator will add them to the blacklist, thanks!\n\n - Beep-boop-boop, E-D-G-E\n\n\n(This e-mail was sent because command \"sendlinks\" was executed by " + msg.author.username + " on Discord, the user was authorized by snowflake ID: " + msg.author.id + ")", // plain text body
                        html: "Hello,<br>I am E-D-G-E, a bot on the N-O-D-E community unofficial Discord server.<br>The attachment contains a list of links submitted by the members of N-O-D-E community unofficial Discord server.<br>If the list contains any hostnames that slipped my filter(e.g. NSFW content) please contact an administrator(" + refs.config.email.ownerEmail + ") listing the hostnames you want filtered in the e-mail and the bot administrator will add them to the blacklist, thanks!<br><br> - Beep-boop-boop, E-D-G-E<br><br><br><i>(This e-mail was sent because command \"sendlinks\" was executed by " + msg.author.username + " on Discord, the user was authorized by snowflake ID: " + msg.author.id + ")</i>", // html body
                        attachments: [
                            {
                                filename: "links-" + new Date().toDateString() + ".csv",
                                content: content,
                                contentType: "text/plain"
                            }
                        ]
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            refs.winston.error("Unable to send e-mail");
                            msg.reply("I was unable to send the e-mail, please contact my developers and administrator.").catch(() => { refs.winston.error("Unable to send reply!") });
                            refs.winston.error(error);
                            refs.winston.error(info);
                            return;
                        }

                        refs.winston.info("Sendlinks executed successfully!");
                        msg.reply("links sent!").catch(() => { refs.winston.error("Unable to send reply!") });
                    });
                    /* NODEMAILER END */

                } else {
                    refs.winston.info("Snapshot empty, not sending.");
                    msg.reply("there is nothing to send.").catch(() => { refs.winston.error("Unable to send reply!") });
                }
            });
        } else if(args[0].equals("list")) {
            refs.database.collection('links').where("seen", "==", false).get().then(snapshot => {
                refs.winston.debug("Snapshot size :" + snapshot.size);
                refs.winston.debug("Snapshot empty:" + snapshot.empty);
                if (!snapshot.empty) {
                    snapshot.forEach(doc => {
                        let data = doc.data();
                        let tmp = data.user + ": " + data.link + '\n';
                        content = content + tmp;
                    });

                    content = "Links:\n" + content;
                    msg.channel.send(content);
                } else {
                    msg.channel.send("There are no links in the database waiting to be sent.");
                }
            });
        } else {
            msg.reply("invalid or missing argument!").catch(() => { refs.winston.error("Unable to send reply!") });
        }
    }

};