const nodemailer = require('nodemailer');

module.exports = {
    name: "sendlinks",
    description: "Sends saved links to N-O-D-E",
    execute(refs, msg, args) {
        global.winston.debug('Sendlinks executed by ', msg.author.username);
        global.winston.debug(global.edgemods);
        if(global.edgemods.find(elem => {
            winston.silly(elem);
            return elem.snowflake === msg.author.id;
        })) {
            global.winston.debug('snowflake match');

            let content = "";

            refs.database.collection('links').where('seen', '==', false).get().then(snapshot => {
                snapshot.forEach(doc => {
                    let data = doc.data();
                    let tmp = data.user + ',' + data.link + '\n';
                    content = content + tmp;
                    refs.database.collection('links').doc(doc.id).update({"seen": true});
                })
            });


            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            nodemailer.createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: account.user, // generated ethereal user
                        pass: account.pass // generated ethereal password
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: '"E-D-G-E" <e-d-g-e@d3add3d.net>', // sender address
                    to: 'links@n-o-d-e.net', // list of receivers
                    subject: '[E-D-G-E] <' + new Date().toDateString() + '> Collection of links from the N-O-D-E community Discord server', // Subject line
                    text: 'The attachment contains a list of links submitted by the members of N-O-D-E community Discord server.\n - Beep-boop-boop, E-D-G-E', // plain text body
                    html: 'The attachment contains a list of links submitted by the members of N-O-D-E community Discord server.<br> - Beep-boop-boop, E-D-G-E', // html body
                    attachments: [
                        {
                            filename: 'links.csv',
                            content: content,
                            contentType: 'text/plain'
                        }
                    ]
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    msg.reply('links sent!');
                });
            });

        } else {
            global.winston.debug('snowflake not found');
            msg.reply('you are not authorized to run this command!');
        }
    }

};