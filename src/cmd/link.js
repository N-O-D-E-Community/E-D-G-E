module.exports = {
    name: 'link',
    description: 'Checks and adds link to the database',
    execute(refs, msg, args) {
        let collectionRef = refs.database.collection('links');
        let query = collectionRef.where('link', '==', args[0]).get().then(snapshot => {
            let doesExist = false;
            snapshot.forEach(doc => {
                if(doc.exists) doesExist = true;
            })
            if(doesExist) {
                msg.reply('Duplicate link, not adding.');
            } else {
                msg.reply('Adding link!');
                collectionRef.add({
                    'link': args[0],
                    'timestamp': Date.now(),
                    'seen': false
                })
            }
        });
    }

};