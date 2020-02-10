
// main cmds.js
const main = require('../cmds.js');


exports.schedule = {


    name: "schedule",
    usage: 'schedule',
    help: 'does schedule stuff', // todo
    func: function (args, message) {

        main.logCommand(this.name, args); // logging

        // todo

    }

};