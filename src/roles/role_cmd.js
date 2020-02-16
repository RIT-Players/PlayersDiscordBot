/**
 * Handles subcommands of the role command.
 */

const data = require('./json.js');


const commands = {

    create: {
        func: function (args, message) {

            if (args.length < 1) {
                // todo
                return;
            }

            // todo
            data.add(args[0]);

        }
    },
    add: { cmd_nick: 'create' },

    edit: {

    },
    set: { cmd_nick: 'edit' },

    delete: {

        func: function (args, message) {

            if (args.length < 1) {

                // todo
                return;

            }

            data.delete(args[0]);

        }

    },
    del: { cmd_nick: 'delete' },
    remove: { cmd_nick: 'delete' },
    rm: { cmd_nick: 'delete' },

    rename: {

        func: function (args, message) {

            if (args.length < 2) {

                // todo
                return;

            }

            let temp = data.get(args[0]);

            data.delete(args[0]);

            data.add(args[1], temp);

        }

    },
    rnm: { cmd_nick: 'rename' },

    list: {
        func: function (args, message) {
            data.output(message.channel);
        }
    }

};

/**
 * Handle a role subcommand.
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
 * */
exports.help = function () {

};