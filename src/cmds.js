
// requires
const config = require("../config.json");
const logger = require("./logging.js").logger;


/** the players bot commands */
const commands = {

    help: {
        name: 'help',
        usage: config.prefix + 'help [command]',
        help: 'displays the command list with command summaries',

        // args should be string[], message should be the discord Message as given in the message event
        func: function (args, message) {


            logCommand(this.name, args); // logging


            let msg = "Commands:";


            // help only takes at most one argument
            if (args.length > 1) {
                msg = `usage: ${this.usage}`;


                // help with one argument
            } else if (args.length === 1) {

                // argument must be a valid command
                if (commands[args[0]] === undefined) {

                    switch (args[0]) {

                        case "me": // a nice little response?
                            msg = `Anything you need, I'm always here ${message.member.displayName}.`;
                            break;

                        default: // people need to enter a command that we know
                            msg = `I don't know ${args[0]}.`;
                            break;

                    }

                    // display the command usage
                } else
                    msg = `Usage of ${args[0]} ((required) [optional]): ${commands[args[0]].usage}`; // todo


                // help with no argument
            } else {

                // build help message
                for (let key in commands)
                    msg += "\n" + commands[key].name + " - " + commands[key].help;
            }


            message.channel.send(msg);
        }
    },

    ttmtg: {
        name: "ttmtg",
        usage: config.prefix + 'ttmtg',
        help: 'displays the time until the next RIT Players meeting',
        func: function (args, message) {

            logCommand(this.name, args); // logging

            let d = new Date(); // 'now'
            let m = new Date(); // to be set to next meeting time

            m.setDate(m.getDate() + ((7 - m.getDay()) % 7 + 2) % 7); // get date of next Tuesday (m will stay a Tuesday if it is already one)
            m.setHours(20, 0, 0, 0); // meetings are at 8p

            // if the time is after 8p on Tuesday, we need to move to the actual next Tuesday
            if (d > m) m.setDate(m.getDate() + (7 - m.getDay()) % 7 + 2);

            // get the difference in the dates
            let ms = m - d;

            // convert ms to days, hours, minutes, and seconds
            let s = parseInt(Math.floor(ms / 1000)); // seconds
            let min = parseInt(Math.floor(s / 60)); // minutes
            let h = parseInt(Math.floor(min / 60)); // hours
            let day = parseInt(Math.floor(h / 24)); // days
            s %= 60;
            min %= 60;
            h %= 24;

            message.channel.send(`${day} days, ${h} hours, ${min} minutes, and ${s} seconds until the next Players meeting.`);
        }
    },

    reminders: {

        name: "reminders",
        usage: config.prefix + 'reminders',
        help: 'lists the current reminders for this server',
        func: function (args, message) {

            logCommand(this.name, args); // logging

            // todo

        }

    },

    remind: {

        name: "remind",
        usage: config.prefix + 'remind ()', // todo
        help: 'add a reminder to this server',
        func: function (args, message) {

            logCommand(this.name, args); // logging

            // todo

        }
    }

};


/**
 * Log the usage of a command.
 * @param {string} cmd      the command
 * @param {string[]} args   the command arguments
 */
function logCommand(cmd, args) {
    logger.info(`"${cmd}" command with args:`);
    logger.info(args);
}


/**
 * Run a command that was send to a channel.
 * @param {string} cmd      the command
 * @param {string[]} args   the command arguments
 * @param {Message} message the message that the command was sent in
 */
exports.run = function (cmd, args, message) {

    // run the command if it is known
    if (commands[cmd]) commands[cmd].func(args, message);

    else { // todo
        logger.info("woah that was unexpected");
    }

};
