
const config = require("../config.json");

const logger = require("./logging.js").logger;

const commands = {

    help: {
        name: 'help',
        usage: config.prefix + 'help [command]',
        help: 'displays the command list with command summaries',

        // args should be string[], message should be the discord Message as given in the message event
        func: function (args, message) {

            logCommand(this.name, args); // logging
            
            let msg = "Commands:"; // TODO this is wrong
            
            // help only takes at most one argument
            if (args.length > 1) {
                msg = `usage: ${this.usage}`;

                // help with one argument
            } else if (args.length == 1) {

                // argument must be a valid command
                if (commands[args[0]] === undefined)
                    logger.info("help command was not found"); // todo

                // display the command usage
                else
                    msg = `Usage of ${args[0]} ((required) [optional]): ${commands[args[0]].usage}`; // todo

                // help with no argument
            } else {

                // build help message
                for (let key in commands)
                    msg += "\n" + commands[key].name + " - " + commands[key].help;
            }

            message.channel.sendMessage(msg);
        }
    },
    ttmtg: {
        name: "ttmtg",
        usage: config.prefix + 'ttmtg',
        help: 'displays the time until the next RIT Players meeting',
        func: function (args, message) {
            logCommand(this.name, args); // logging
        }
    }

}

function logCommand(cmd, args) {
    logger.info(`"${cmd}" command with args:`);
    logger.info(args);
}

exports.run = function (cmd, args, message) {

    if (commands[cmd]) {
        commands[cmd].func(args, message);
    } else {
        logger.info("woah that was unexpected");
    }

}