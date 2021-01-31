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
    help: 'does schedule stuff (see "help role")', // todo
    get help_more() {
        return post_cmd.help();
    },
    func: function (args, message) {

        console.log(message.member);
        console.log(message.author);
        console.log(message.guild.member(message.author));
        console.log(message.guild.members.size);
        console.log(message.guild.memberCount);
        message.guild.fetchMembers()
            .then(console.log)
            .catch(console.error);
        console.log("hello there");
        console.log(message.guild.members.size);

        main.logCommand(this.name, args); // logging

        //post_cmd.run(args, message);

    }

};