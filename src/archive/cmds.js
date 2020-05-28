//
// Archive a channel or category
//
//

// main cmds.js
const main = require('../cmds.js');
const archive_cmd = require("./archive_cmds");
exports.archive = {
    name: "archive",
    usage: "archive (category|channel) [opts]",
    help: "archives a category or channel",
    get help_more() {
        return archive_cmd.help();
    },
    func: function(args, message) {
        main.logCommand(this.name, args);

        archive_cmd.run(args,message);
    }

};


