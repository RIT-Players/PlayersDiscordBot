const archiveFuncs = require('./archive_channel.js');
const main = require('../cmds.js');
fs = require('fs');

const commands = {
    category: {
        name: "category",
        usage: "category",
        help: "archives the category of the current channel, and all child channels",
        func: function(args, message) {
            main.logCommand(this.name, args);

            const allChannels = message.channel.parent.children.array();

            allChannels.forEach(chan=>{
                if(chan.type === "text"){ //only handle text channels
                    archiveFuncs.archiveChannel(chan, message).then(r =>{
                        archiveFuncs.sendArchive(message, chan.name, chan.parent.name)
                        message.channel.send("Channel \'"+  chan.name + "\' Archived.")
                    });
                }
            })

        }

    },
    channel: {
        name: "channel",
        usage: "channel",
        help: "archives the current channel",
        func: function (args, message) {
            main.logCommand(this.name, args);
            archiveFuncs.archiveChannel(message.channel, message).then(r => {
                archiveFuncs.sendArchive(message, message.channel.name, message.channel.parent.name);
                message.channel.send("Channel \'"+ message.channel.name + "\' Archived.");
            });
        }
    }

};

/**
 * Handle a archive subcommand.
 * @param {string[]} args   the arguments to the role command
 * @param {Message} message the message the command was sent in
 */
exports.run = function (args, message) {

    if (args.length < 1) {
        // todo
        return;
    }

    if (commands[args[0]]) {
        let s_cmd = args.shift();
        if (commands[s_cmd].cmd_nick) commands[commands[s_cmd].cmd_nick].func(args, message);
        else commands[s_cmd].func(args, message);
    }

};


/**
 * Extra help information for the role command (i.e. its subcommands).
 * @return {string} extra help message
 */
exports.help = function () {
    let msg = 'Archive Commands:';
    for (let key in commands) {
        msg += commands[key].cmd_nick ? '' : `\n${commands[key].usage} - ${commands[key].help}`;
    }

    return msg;

};