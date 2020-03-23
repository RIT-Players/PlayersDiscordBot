/**
 * Manages command calling for the whole bot.
 */

// requires
const config = require("../config.json");
const logger = require("./logging.js").logger;

const cmds_util = require('./util/cmds.js');
const cmds_schedule = require('./schedule/cmds.js');
const cmds_players = require('./players/cmds.js');
const cmds_roles = require('./roles/cmds.js');

/** the players bot commands */
const commands = {
    
    help: cmds_util.help,
    
    ttmtg: cmds_players.ttmtg,
    
    schedule: cmds_schedule.schedule,
    
    iam: cmds_roles.iam,

    iamnot: cmds_roles.iamnot,

    role: cmds_roles.role

    // MORE COMMANDS GET ADDED HERE

};


/**
 * Log the usage of a command.
 * @param {string} cmd      the command
 * @param {string[]} args   the command arguments
 */
exports.logCommand = (cmd, args) => {
    logger.info(`"${cmd}" command with args:`);
    logger.info(args);
};


/**
 * To be run when an unknown command sent in a message.
 * @param {string} cmd      the command
 * @param {string[]} args   the command arguments
 * @param {Message} message the message that the command was sent in
 */
exports.unknownCommand = (cmd, args, message) => {

    // logging
    logger.info(`Unknown command "${cmd}" with args:`);
    logger.info(args);

    // unknown command message (todo?)
    message.channel.send(`I don't know '${cmd}'. Try running '${config.prefix}help'`);

};


/**
 * Respond to a message with the usage of a command.
 * @param {string} cmd      the command
 * @param {Message} message the message to respond to
 */
exports.sendUsage = (cmd, message) => {

    message.channel.send(`Usage of ${cmd} ((required) [optional]): ${config.prefix}${commands[cmd].usage}`); // todo

};


/**
 * Get all the bot commands as an object.
 * @return {Object} the object
 */
exports.getCommands = () => {

    // so that commands implemented not here can see other commands info without importing them
    return commands;

};


/**
 * Run a command that was send to a channel.
 * @param {string} cmd      the command
 * @param {string[]} args   the command arguments
 * @param {Message} message the message that the command was sent in
 */
exports.run = (cmd, args, message) => {

    // run the command if it is known
    if (commands[cmd]) commands[cmd].func(args, message);

    else exports.unknownCommand(cmd, args, message);

};
