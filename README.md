# E-D-G-E
A Discord bot for the N-O-D-E community

## Contributing

### Setting up

 - Request to be added to the N-O-D-E Community organization on GitHub by @D3add3d on the [N-O-D-E community Discord server](https://discord.gg/g9uvEAP)
 - Clone the repository
 - Run `npm install`
 - Obtain a bot token from [here](https://discordapp.com/developers/applications/me) by creating a new app, then creating a bot user and clicking on "Token" in the bot user section
 - (You can invite your bot user to a server by clicking on "Generate OAuth2 URL", choosing at least view channels, send messages and read message history permissions and navigating to the generated URL in your browser) 
 - Obtain a `serviceAccountKey.json` file from Firebase by logging in to the Firebase console, creating a project, enabling Cloud Firestore under "Database" and going to "Project settings > SERVICE ACCOUNTS" and clicking on "GENERATE NEW PRIVATE KEY"
 - Put the obtained file into `run` directory in the root directoy of the project
 - Obtain your snowflake ID by going to "User Settings > APP SETTINGS > Appearance", enabling "Developer Mode", right-clicking on your name in any server and choosing "Copy ID"
 - Run `npm start`(in the root project directory) once and edit `./run/config.json` with your values
 - Run `npm start` to run the bot
 
 Note: You will also need an SMTP service to send e-mails, you can use SendGrid, Mailgun or other similar services.
 
### Rules
 
 - Make new branches when making changes
 - Pull requests should stay open until someone reviews them
 - Merging into `master` can only be completed after all new features and changes have been tested and reviewed
