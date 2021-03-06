//
// Handles subcommands of the role command.
//
//

const roles = require('./roles.js');
const config = require('../../config.json');

/**
 * 'role' command subcommands.
 *
 * Organized in the form:
 * sub_cmd: {
 *      help: {string}                      help message for command
 *      usage: {string}                     usage info for command
 *      func: {function(string, Message)}   function that handles command call
 * }
 */
const commands = {

    create: {

        name: 'create',
        help: 'create an assignable role',
        usage: 'create (role) [opts]',
        func: function (args, message) {

            if (args.length < 1) {
                exports.sendUsage(this.name, message);
                return;
            }

            if (!message.member.hasPermission('MANAGE_ROLES')) {
                message.channel.send('You do not have permission to change the roles in this server.');
                return;
            }

            let p = roles.create(message.guild, args[0]).catch(e => {

                // confirmation/error message
                if (typeof e === "string")
                    message.channel.send(e);
                else
                    console.error(e);

            });

            if (args.length > 1) {

                let r = args.shift();

                p.then(() => roles.edit(message.guild, r, args.join(' ')).catch(e => {

                    // confirmation/error message
                    if (typeof e === "string")
                        message.channel.send(e);
                    else
                        console.error(e);

                }));

            }

        }
    },
    add: { cmd_nick: 'create' },

    edit: {

        name: 'edit',
        help: 'edit an assignable role',
        usage: 'edit (role) (new opts)',
        func: function (args, message) {

            if (args.length < 2) {
                exports.sendUsage(this.name, message);
                return;
            }

            if (!message.member.hasPermission('MANAGE_ROLES')) {
                message.channel.send('You do not have permission to change the roles in this server.');
                return;
            }

            let r = args.shift();

            roles.edit(message.guild, r, args.join(' ')).catch(e => {

                // confirmation/error message
                if (typeof e === "string")
                    message.channel.send(e);
                else
                    console.error(e);

            });
        }

    },
    set: { cmd_nick: 'edit' },

    delete: {

        name: 'delete',
        help: 'delete an assignable role',
        usage: 'delete (role)',
        func: function (args, message) {

            if (args.length < 1) {
                exports.sendUsage(this.name, message);
                return;
            }

            if (!message.member.hasPermission('MANAGE_ROLES')) {
                message.channel.send('You do not have permission to change the roles in this server.');
                return;
            }

            roles.delete(message.guild, args[0]).catch(e => {

                // confirmation/error message
                if (typeof e === "string")
                    message.channel.send(e);
                else
                    console.error(e);

            });
                
            
        }

    },
    del: { cmd_nick: 'delete' },
    remove: { cmd_nick: 'delete' },
    rm: { cmd_nick: 'delete' },

    rename: {

        name: 'rename',
        help: 'rename an assignable role',
        usage: 'rename (old role) (new role)',
        func: function (args, message) {

            if (args.length < 2) {
                exports.sendUsage(this.name, message);
                return;
            }

            if (!message.member.hasPermission('MANAGE_ROLES')) {
                message.channel.send('You do not have permission to change the roles in this server.');
                return;
            }

            roles.rename(message.guild, args[0], args[1]).catch(e => {

                // confirmation/error message
                if (typeof e === "string")
                    message.channel.send(e);
                else
                    console.error(e);

            });

        }

    },
    rnm: { cmd_nick: 'rename' },

    list: {

        help: 'display assignable roles',
        usage: 'list [role]',
        func: function (args, message) {
            roles.list(message.channel, args[0]);
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

/**
 * Respond to a message with the usage of a command.
 * @param {string} cmd      the command
 * @param {Message} message the message to respond to
 */
exports.sendUsage = (cmd, message) => {

    message.channel.send(`Usage of ${cmd} ((required) [optional]): ${config.prefix}${commands[cmd].usage}`); // todo

};