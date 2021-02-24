//
// Interface with the main command system. Delegates responsibility to post_cmd.
//


// main cmds.js
const main = require('../cmds.js');

// post subcommand handler
const post_cmd = require('./post_cmd.js');


exports.post = {

    name: "post",
    usage: 'post (cmd) [opts]',
    help: 'does schedule stuff (see "help post")',
    get help_more() {
        return post_cmd.help();
    },
    func: function (args, message) {

        main.logCommand(this.name, args); // logging

        post_cmd.run(args, message);

    }

};