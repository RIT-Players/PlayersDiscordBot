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

        let gm = []; // guild member array

        for (let u of args.splice(1)) {

            // regex check for mentions (take priority over string matching)
            let rm = u.match(message.mentions.constructor.USERS_PATTERN);
            if (rm) {
                gm.push(message.channel.guild.member(rm[0].match(/[0-9]+/g)[0]));
                continue;
            }

            // case-insesitive matching
            let r = new RegExp(u, 'i');
            rm = message.channel.guild.members.filter(mem => r.test(mem.displayName) || r.test(mem.user.username));

            if (rm.size != 1) {
                message.channel.send(`Could not find one user given '${u}'. Be more specific or try something else.`);
                return;
            } else gm.push(rm.first());

        }

        gm.forEach(u =>
            roles.assign(message.member, args[0]).catch(e => {

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