//
// Interface with main bot command system.
//
//

// main cmds.js
const main = require('../cmds.js');

// roles command handler
const role_cmd = require('./role_cmd.js');
const roles = require('./roles.js');

exports.iam = {

    name: "iam",
    usage: 'iam (role)',
    help: 'assigns you as role (if role can be assigned)',
    func: function (args, message) {

        main.logCommand(this.name, args); // logging

        if (args.length < 1) {

            // todo

            return;

        }

        roles.assign(message.member, args[0]).catch(e => {

            // confirmation/error message
            if (typeof e === "string")
                message.channel.send(e);
            else
                console.error(e);

        });

    }

};

exports.iamnot = {

    name: "iamnot",
    usage: 'iamnot (role)',
    help: 'removes the given role (if role can be assigned and you have it)',
    func: function (args, message) {

        main.logCommand(this.name, args); // logging

        roles.unassign(message.member, args[0]).catch(e => {

            // confirmation/error message
            if (typeof e === "string")
                message.channel.send(e);
            else
                console.error(e);

        });

    }

};

exports.role = {

    name: "role",
    usage: 'role (cmd) [opts]',
    help: 'do role stuff (see help role)',
    get help_more() {
        return role_cmd.help();
    },
    func: function (args, message) {

        main.logCommand(this.name, args); // logging

        role_cmd.run(args, message);

    }

};