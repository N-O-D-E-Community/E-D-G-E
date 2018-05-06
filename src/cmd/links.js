/* Author: D3ad3dd */

const nodemailer = require('nodemailer');

module.exports = {
    name: "links",
    description: "`send`s or `list`s links that have not yet been sent",
    type: 1,
    execute(refs, msg, args) {
        global.winston.info('links executed by ', msg.author.username);
        global.winston.debug(global.edgemods);
        if(global.edgemods.find(elem => {
            winston.silly(elem);
            return elem.snowflake === msg.author.id;
        })) {
            global.winston.debug('snowflake match');

            let content = "";

            if(args[0] === 'send') {

                refs.database.collection('links').where('seen', '==', false).get().then(snapshot => {
                    winston.debug('Snapshot size :' + snapshot.size);
                    winston.debug('Snapshot empty:' + snapshot.empty);
                    if (!snapshot.empty) {
                        snapshot.forEach(doc => {
                            let data = doc.data();
                            let tmp = data.user + ',' + data.link + '\n';
                            content = content + tmp;
                            refs.database.collection('links').doc(doc.id).update({"seen": true});
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
                            text: 'Hello,\nI am E-D-G-E, a bot on the N-O-D-E community unofficial Discord server.\nThe attachment contains a list of links submitted by the members of N-O-D-E community unofficial Discord server.\nIf the list contains any hostnames that slipped my filter(e.g. NSFW content) please contact an administrator(' + refs.config.email.ownerEmail + ') listing the hostnames you want filtered in the e-mail and the bot administrator will add them to the blacklist, thanks!\n\n - Beep-boop-boop, E-D-G-E\n\n\n(This e-mail was sent because command "sendlinks" was executed by \' + msg.author.username +\' on Discord, the user was authorized by snowflake ID: \' + msg.author.id +\')\'', // plain text body
                            html: 'Hello,<br>I am E-D-G-E, a bot on the N-O-D-E community unofficial Discord server.<br>The attachment contains a list of links submitted by the members of N-O-D-E community unofficial Discord server.<br>If the list contains any hostnames that slipped my filter(e.g. NSFW content) please contact an administrator(' + refs.config.email.ownerEmail + ') listing the hostnames you want filtered in the e-mail and the bot administrator will add them to the blacklist, thanks!<br><br> - Beep-boop-boop, E-D-G-E<br><br><br><i>(This e-mail was sent because command "sendlinks" was executed by ' + msg.author.username + ' on Discord, the user was authorized by snowflake ID: ' + msg.author.id + ')</i>', // html body
                            attachments: [
                                {
                                    filename: 'links-' + new Date().toDateString() + '.csv',
                                    content: content,
                                    contentType: 'text/plain'
                                }
                            ]
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                winston.error('Unable to send e-mail');
                                msg.reply('I was unable to send the e-mail, please contact my developers and include the log.');
                                return winston.error(error);
                            }

                            winston.info('Sendlinks executed successfully!')
                            msg.reply('links sent!');
                        });
                        /* NODEMAILER END */

                    } else {
                        winston.info('Snapshot empty, not sending.')
                        msg.reply('there is nothing to send.')
                    }
                });
            } else if(args[0] === 'list') {
                refs.database.collection('links').where('seen', '==', false).get().then(snapshot => {
                    winston.debug('Snapshot size :' + snapshot.size);
                    winston.debug('Snapshot empty:' + snapshot.empty);
                    if (!snapshot.empty) {
                        snapshot.forEach(doc => {
                            let data = doc.data();
                            let tmp = data.user + ': ' + data.link + '\n';
                            content = content + tmp;
                        });

                        content = 'Links:\n' + content;
                        msg.channel.send(content);
                    }
                });
            } else {
                msg.reply('invalid or missing argument!');
            }

        } else {
            global.winston.debug('snowflake not found');
            msg.reply('you are not authorized to run this command!');
        }
    }

};