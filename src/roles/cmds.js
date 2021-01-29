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
            main.sendUsage(this.name, message);
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

        if (args.length < 1) {
            main.sendUsage(this.name, message);
            return;
        }

        roles.unassign(message.member, args[0]).catch(e => {

            // confirmation/error message
            if (typeof e === "string")
                message.channel.send(e);
            else
                console.error(e);

        });

    }

};

exports.theyare = {

    name: 'theyare',
    usage: 'theyare (role) (users)',
    help: 'assigns a role to multiple people',
    func: function (args, message) {

        // logging
        main.logCommand(this.name, args);

        // check arguments
        if (args.length < 2) {
            main.sendUsage(this.name, message);
            return;
        }

        // check permissinos
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            message.channel.send('You do not have permission to change the roles in this server.');
            return;
        }

        // resolve users
        let gm = roles.members(args.splice(1), message);
        if (gm.length < 1) return;

        // assign roles
        gm.forEach(u =>
            roles.assign(u, args[0]).catch(e => {

                // confirmation/error message
                if (typeof e === "string")
                    message.channel.send(e);
                else
                    console.error(e);

            })
        );

    }

};

exports.theyarenot = {

    name: 'theyarenot',
    usage: 'theyarenot (role) (users)',
    help: 'unassigns a role from multiple people',
    func: function (args, message) {

        // logging
        main.logCommand(this.name, args);

        // check arguments
        if (args.length < 2) {
            main.sendUsage(this.name, message);
            return;
        }

        // check permissinos
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            message.channel.send('You do not have permission to change the roles in this server.');
            return;
        }

        // resolve users
        let gm = roles.members(args.splice(1), message);
        if (gm.length < 1) return;

        // assign roles
        gm.forEach(u =>
            roles.unassign(u, args[0]).catch(e => {

                // confirmation/error message
                if (typeof e === "string")
                    message.channel.send(e);
                else
                    console.error(e);

            })
        );

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