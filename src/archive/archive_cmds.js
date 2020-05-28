const commands = {
    category: {

        name: "category",
        usage: "category (\"category name\") [delete|keep]",
        help: "archives a category",
        func: function(args, message) {
            main.logCommand(this.name, args);

        }

    },
    channel: {

        name: "channel",
        usage: "channel (\"Category Name\") (\"Channel Name\") [delete|keep]",
        help: "archives a channel",
        func: function(args, message) {
            main.logCommand(this.name, args);

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