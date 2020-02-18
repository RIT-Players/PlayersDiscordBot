/**
 * Handles subcommands of the role command.
 */

const data = require('./json.js');


const commands = {

    create: {

        help: 'create an assignable role',
        usage: 'create (role) [opts]',
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

        help: 'edit an assignable role',
        usage: 'edit (role) (new opts)'

    },
    set: { cmd_nick: 'edit' },

    delete: {

        help: 'delete an assignable role',
        usage: 'delete (role)',
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

        help: 'rename an assignable role',
        usage: 'rename (old role) (new role)',
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

        help: 'display assignable roles',
        usage: 'list [role]',
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
 * @return {string} extra help message
 */
exports.help = function () {

    let msg = 'Role commands:';

    for (let key in commands) {
        msg += commands[key].cmd_nick ? '' : `\n${commands[key].usage} - ${commands[key].help}`;
    }

    return msg;

};