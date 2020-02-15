/**
 * Handles subcommands of the role command.
 */

const data = require('./json.js');


const commands = {

    create: {

    },
    add: { cmd_nick: this.create },

    edit: {

    },
    set: { cmd_nick: this.edit },

    delete: {

    },
    del: { cmd_nick: this.del },
    remove: { cmd_nick: this.del },
    rm: { cmd_nick: this.del },

    rename: {

    },
    rnm: { cmd_nick: this.rename },

    list: {

    }

};

/**
 * Handle a role subcommand.
 * @param {string[]} args   the arguments to the role command
 * @param {Message} message the message the command was sent in
 */
exports.run = function (args, message) {

    message.channel.send("did a thing");

    data.test();

};

/**
 * Extra help information for the role command (i.e. its subcommands).
 * */
exports.help = function () {

};