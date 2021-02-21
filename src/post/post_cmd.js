//
// Handles subcommands of the post command.
//

const posts = require('./posts.js');
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
        help: 'create a recurring message',
        usage: 'create (type) (value) (message)',
        func: function (args, message) {

            // check arguments
            if (args.length < 3) {
                exports.sendUsage(this.name, message);
                return;
            }

            // check user permissions (using 'MANAGE_CHANNELS' as a basis for being able to set messages)
            if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                message.channel.send('You do not have permission to add recurring posts in this server.');
                return;
            }

            // run command
            posts.create(args, message);

        }
    },
    add: { cmd_nick: 'create' },
    new: { cmd_nick: 'create' },
    
    edit: {

        name: 'edit',
        help: 'edit a recurring message',
        usage: 'edit (message number) (new opts)',
        func: function (args, message) {

            // check arguments
            if (args.length < 2) {
                exports.sendUsage(this.name, message);
                return;
            }

            // check user permissions (using 'MANAGE_CHANNELS' as a basis for being able to set messages)
            if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                message.channel.send('You do not have permission to edit recurring posts in this server.');
                return;
            }

            // run command
            posts.edit(args, message);

        }

    },
    set: { cmd_nick: 'edit' },
    
    delete: {

        name: 'delete',
        help: 'delete a recurring message',
        usage: 'delete (message number)',
        func: function (args, message) {

            // check arguments
            if (args.length < 1) {
                exports.sendUsage(this.name, message);
                return;
            }

            // check user permissions (using 'MANAGE_CHANNELS' as a basis for being able to set messages)
            if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                message.channel.send('You do not have permission to delete recurring posts in this server.');
                return;
            }

            // run command
            posts.delete(args, message);

        }

    },
    del: { cmd_nick: 'delete' },
    remove: { cmd_nick: 'delete' },
    rm: { cmd_nick: 'delete' },
    
    skip: {

        name: 'skip',
        help: 'skip sending a recurring message some number of times',
        usage: 'skip (message number) (number of times to skip)',
        func: function (args, message) {

            // check arguments
            if (args.length < 2) {
                exports.sendUsage(this.name, message);
                return;
            }

            // check user permissions (using 'MANAGE_CHANNELS' as a basis for being able to set messages)
            if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                message.channel.send('You do not have permission to skip recurring posts in this server.');
                return;
            }

            // run command
            posts.skip(args, message);

        }

    },

    list: {

        name: 'skip',
        help: 'display all recurring messages',
        usage: 'list',
        func: function (args, message) {

            // run command
            posts.list(message);

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

    let msg = 'Post commands:';

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

    message.channel.send(`Usage of post ${cmd} ((required) [optional]): ${config.prefix}post ${commands[cmd].usage}`); // todo

};