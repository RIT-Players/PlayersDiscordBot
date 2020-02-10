
// util/cmds.js
// contains the functions for 'util' commands

// main cmds.js
const main = require('../cmds.js');


exports.help = {

    name: 'help',
    usage: 'help [command]',
    help: 'displays the command list with command summaries',

    // args should be string[], message should be the discord Message as given in the message event
    func: function (args, message) {

        main.logCommand(this.name, args); // logging

        let commands = main.getCommands();

        // help only takes at most one argument
        if (args.length > 1) {
            main.sendUsage(this.name, message);
            return;
        }


        // help with one argument
        if (args.length === 1) {

            // argument must be a valid command
            if (commands[args[0]] === undefined) {

                switch (args[0]) {

                    case "me": // a nice little response?
                        message.channel.send(`Anything you need, I'm always here ${message.member.displayName}.`);
                        break;

                    default: // people need to enter a command that we know

                        main.unknownCommand(`help ${args[0]}`, [], message);
                        break;

                }

                // display the command usage
            } else main.sendUsage(args[0], message);


            // help with no argument
        } else {

            let msg = "Commands:"

            // build help message
            for (let key in commands)
                msg += "\n" + commands[key].name + " - " + commands[key].help;

            message.channel.send(msg);
        }

    }



}

