/*Author: D3add3d */

const validUrl = require('valid-url');
const urlExists = require('url-exists-deep');

module.exports = {
    name: 'link',
    description: 'Checks and adds link to the database',
    type: 0,
    execute(refs, msg, args) {
        global.winston.debug('Link command executed', args[0]);
        if (validUrl.isUri(args[0])) {
            global.winston.debug('Link is a valid URI');

            let url = new URL(args[0]);
            if(refs.config.email.hostnameBlacklist.includes(url.hostname)) {
                msg.reply('that hostname is blacklisted!');
                global.winston.info('User ' + msg.author.username + ' tried to add blacklisted link!');
                return;
            }

            // noinspection JSUnresolvedFunction
            urlExists(args[0]).then(function (response) {
                global.winston.debug('HTTP/S response returned for link');
                if (response) {
                    global.winston.debug('200 code response for link');
                    let collectionRef = refs.database.collection('links');
                    global.winston.debug('Querying database for existing link...');
                    collectionRef.where('link', '==', args[0]).get().then(snapshot => {
                        let doesExist = false;
                        snapshot.forEach(doc => {
                            if (doc.exists) doesExist = true;
                        });
                        if (doesExist) {
                            global.winston.debug('Link already exists');
                            msg.reply('duplicate link, not adding.');
                        } else {
                            global.winston.debug('Link does not exist, adding to database');
                            msg.reply('adding link!');
                            collectionRef.add({
                                'link': args[0],
                                'timestamp': Date.now(),
                                'seen': false,
                                'user': msg.author.username
                            });
                        }
                    });
                } else {
                    global.winston.debug('Server responded but link is not reachable, ignoring');
                    msg.reply('given URL does not exist on that server!');
                }
            }).catch(error => {
                global.winston.debug('Server not found, ignoring link');
                msg.reply('given URI is pointing to a server that does not exist!');
            });


        } else {
            global.winston.debug("Not an URI, ignoring");
            msg.reply('that link is not a valid URI!');
        }
    }

};