/* Author: D3add3d */

module.exports = {
    name: 'mod',
    description: 'Adds and removes moderators',
    type: 1,
    execute(refs, msg, args) {
        global.winston.debug('Mod command executed by: ', msg.author.username);
        global.winston.debug(global.edgemods);
        if(global.edgemods.find(elem => {
            winston.silly(elem);
            return elem.snowflake === msg.author.id;
        }) || msg.author.id === refs.config.discord.owner) {
            global.winston.debug('snowflake match or owner');

            if(args.length < 2) {
                msg.reply('incorrect usage, correct usage is: `mod add/remove @username`');
                return;
            }

            if(args[0] === 'add' && msg.mentions.users.array().length > 0) {
                let mentions = msg.mentions.users.array();
                mentions.forEach(mention => {
                    refs.database.collection('moderators').where('snowflake', '==', mention.id).get().then(snapshot => {
                        if(snapshot.empty) {
                            refs.database.collection('moderators').add({
                                'snowflake': mention.id
                            }).then(docRef => {
                                msg.reply('added user ' + mention + ' to moderators.');
                            }).catch(e => {
                                global.winston.error('Error adding to collection moderators: ' + e);
                                msg.reply('an error occurred adding user ' + mention + ' to moderators.');
                            });
                        } else {
                            msg.reply('user ' + mention + ' is already a moderator.');
                        }
                    });
                });
            } else if(args[0] === 'remove' && msg.mentions.users.array().length > 0) {
                let mentions = msg.mentions.users.array();
                mentions.forEach(mention => {
                    refs.database.collection('moderators').where('snowflake', '==', mention.id).get().then(snapshot => {
                        if(!snapshot.empty) {
                            snapshot.forEach(doc => {
                                refs.database.collection('moderators').doc(doc.id).delete().then(docRef => {
                                    msg.reply('removed user ' + mention + ' from moderators.');
                                }).catch(e => {
                                    global.winston.error('Error deleting from collection moderators: ' + e);
                                    msg.reply('an error occurred removing user ' + mention + ' from moderators.');
                                });
                            });
                        } else {
                            msg.reply('user ' + mention + ' is not a moderator.');
                        }
                    });
                });
            }

        } else {
            global.winston.info('User ' + msg.author.username + ' tried to execute command mod without permissions.');
            msg.reply('you are not authorized to run this command!');
        }
    }
};