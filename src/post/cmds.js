//
// Interface with the main command system. Delegates responsibility to post_cmd.
//


// main cmds.js
const main = require('../cmds.js');


exports.post = {


    name: "post",
    usage: 'post (cmd) [opts]',
    help: 'does schedule stuff', // todo
    func: function (args, message) {

        main.logCommand(this.name, args); // logging

        // todo

    }

};