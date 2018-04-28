const validUrl = require('valid-url');
const urlExists = require('url-exists-deep');

module.exports = {
    name: 'link',
    description: 'Checks and adds link to the database',
    execute(refs, msg, args) {
        if(validUrl.isUri(args[0])) {
            urlExists(args[0]).then(function(response) {
                if(response) {
                    let collectionRef = refs.database.collection('links');
                    collectionRef.where('link', '==', args[0]).get().then(snapshot => {
                        let doesExist = false;
                        snapshot.forEach(doc => {
                            if (doc.exists) doesExist = true;
                        });
                        if (doesExist) {
                            msg.reply('duplicate link, not adding.');
                        } else {
                            msg.reply('adding link!');
                            collectionRef.add({
                                'link': args[0],
                                'timestamp': Date.now(),
                                'seen': false
                            });
                        }
                    });
                } else {
                    msg.reply('link is not reachable!');
                }
            }).catch(error => {
                msg.reply('link is not reachable!');
            });
        } else {
            msg.reply("link is in invalid format!");
        }
    }

};