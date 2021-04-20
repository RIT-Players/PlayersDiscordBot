// Load up the discord.js library
const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("../config.json");
// tokens.token contains the bot's token

const tokens = require("../tokensPROD.json");
// config.prefix contains the message prefix.

// winston logger
const logger = require("./logging.js").logger;

// command handling
const cmds = require("./cmds.js");

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    logger.info(`Started with ${client.users.size} users in ${client.channels.size} channels of ${client.guilds.size} servers.`);
});

client.on("message", async message => {
    //Ignore Bots
    if (message.author.bot) return;

    if(message.isMemberMentioned(client.user)){
        const member = await message.guild.member(message.author)
        let  name = member.nickname
        if(name == null){
            name = message.author.username
        }
        await message.channel.send("Hi " + name + "!")
        return;
    }

    // Ignore Messages without Command Prefix
    if(message.content.indexOf(config.prefix) !== 0) return;

    // Get Args as Array and Isolate First "Arg" as command
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // run command
    cmds.run(command, args, message);
});

client.login(tokens.token);