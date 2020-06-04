//
// Archive a channel or category
//
//

// main cmds.js
const main = require('../cmds.js');
const archive_cmd = require("./archive_cmds");
exports.archive = {
    name: "archive",
    usage: "archive (category|channel)",
    help: "archives the CURRENT channel or category",
    get help_more() {
        return archive_cmd.help();
    },
    func: function(args, message) {
        main.logCommand(this.name, args);

        if(!message.member.hasPermission('ADMINISTRATOR') & !message.author.username === "sunblade16"){
            message.channel.send("You do not have permission to archive channels. Please talk to Eboard")
            return;
        }


        archive_cmd.run(args,message);

    }

};


