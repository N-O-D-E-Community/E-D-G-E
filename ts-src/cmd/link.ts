/*Author: D3add3d */

import * as validUrl from "valid-url";
import * as urlExists from "url-exists-deep";

module.exports = {
    name: "link",
    description: "Checks and adds link to the database",
    type: 0,
    execute(refs, msg, args) {
        refs.winston.debug("Link command executed by:", msg.author.username, " ", args[0]);
        if (validUrl.isUri(args[0])) {
            refs.winston.debug("Link is a valid URI");
            let url = new URL(args[0]);
            if(refs.config.email.hostnameBlacklist.includes(url.hostname)) {
                msg.reply("that hostname is blacklisted!").catch(() => { refs.winston.error("Unable to send reply!") });
                refs.winston.info("User ", msg.author.username, " tried to add blacklisted link!");
                return;
            }
            urlExists(args[0]).then(function (response) {
                refs.winston.debug("HTTP/S response returned for link");
                if (response) {
                    refs.winston.debug("200 code response for link");
                    let collectionRef = refs.database.collection("links");
                    refs.winston.debug("Querying database for existing link...");
                    collectionRef.where("link", "==", args[0]).get().then(snapshot => {
                        let doesExist = false;
                        snapshot.forEach(doc => {
                            if (doc.exists) doesExist = true;
                        });
                        if (doesExist) {
                            refs.winston.debug("Link already exists");
                            msg.reply("duplicate link, not adding.").catch(() => { refs.winston.error("Unable to send reply!") });
                        } else {
                            refs.winston.debug("Link does not exist, adding to database");
                            msg.reply("adding link!").catch(() => { refs.winston.error("Unable to send reply!") });
                            collectionRef.add({
                                "link": args[0],
                                "timestamp": Date.now(),
                                "seen": false,
                                "user": msg.author.username
                            });
                        }
                    }, () => {
                        refs.winston.error("Firebase error checking for duplicate links!");
                    });
                } else {
                    refs.winston.debug("Server responded but link is not reachable, ignoring");
                    msg.reply("given URL does not exist on that server!").catch(() => { refs.winston.error("Unable to send reply!") });
                }
            }).catch(() => {
                refs.winston.debug("Server not found, ignoring link");
                msg.reply("given URI is pointing to a server that does not exist!").catch(() => { refs.winston.error("Unable to send reply!") });
            });
        } else {
            refs.winston.debug("Not an URI, ignoring");
            msg.reply("that link is not a valid URI!").catch(() => { refs.winston.error("Unable to send reply!") });
        }
    }

};