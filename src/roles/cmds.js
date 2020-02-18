
// main cmds.js
const main = require('../cmds.js');

// roles command handler
const role_cmd = require('./role_cmd.js');


exports.iam = {

    name: "iam",
    usage: 'iam (role)',
    help: 'assigns you as role (if role can be assigned)',
    func: function (args, message) {

        main.logCommand(this.name, args); // logging

        role_cmd.run(args, message);

    }

};

exports.iamnot = {

    name: "iamnot",
    usage: 'iamnot (role)',
    help: 'removes the given role (if role can be assigned and you have it)',
    func: function (args, message) {

        main.logCommand(this.name, args); // logging



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