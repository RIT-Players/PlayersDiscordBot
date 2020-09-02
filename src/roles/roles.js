//
// Handles operations with roles on a Discord server.
//
//

// FEATURE ADDITION LIST?
// - sync roles in case things happen
// - sync role assignments in case of purges or something

const data = require('./json.js');
const opts_handling = require("./opts.js");
const logger = require("../logging.js").logger;

/**
 * Add a new self-assignable role to a Discord server.
 * @param {Guild} guild         the Discord server
 * @param {string} name         the name of the role
 * @returns {Promise<never>}    a Promise that throws the success message
 */
exports.create = function (guild, name) {

    return guild.createRole({ name: name }, 'bot-created self-assignable role').then(role => {

        // update data
        data.add(guild.id, name);

        // confirmation message
        throw `Created role '${role.name}' in server '${guild.name}'`;

    });
};

/**
 * Delete a self-assignable role from a Discord server.
 * @param {Guild} guild         the Discord server
 * @param {string} name         the name of the role
 * @returns {Promise<never>}    a Promise that throws the success message
 */
exports.delete = function (guild, name) {

    // ensure this is an assignable role
    if (data.get(guild.id, name)) {

        // get role with name
        let r = guild.roles.find(role => role.name === name);

        // role doesn't exist
        if (!r) {

            // correct data
            data.delete(guild.id, name);

            // error message
            return Promise.reject(`'${name}' was deleted and does not exist!`);
        }

        // role exists so delete it
        return r.delete().then(role => {

            // update data
            data.delete(guild.id, name);

            // confirmation message
            throw `Deleted role '${role.name}' from server '${guild.name}'`;

        });

    } else return Promise.reject(`'${name}' does not exist or is not an assignable role!`);
};

/**
 * Edit the options of a self-assignable role in a Discord server.
 * @param {Guild} guild         the Discord server
 * @param {string} name         the name of the role
 * @param {string} opts         the role options to change
 * @returns {Promise<never>}    a Promise that throws the success message
 */
exports.edit = function (guild, name, opts) {

    // ensure this is an assignable role
    if (data.get(guild.id, name)) {

        // get role with name
        let r = guild.roles.find(role => role.name === name);

        // role doesn't exist
        if (!r) {

            // correct data
            data.delete(guild.id, name);

            // error message
            return Promise.reject(`'${name}' was deleted and does not exist!`);
        }

        let o = opts_handling.parse(opts);

        // there was a parsing error
        if (typeof o === 'string')
            return Promise.reject(o);

        logger.info('role edit with opts: %o', o);

        return opts_handling.assign(r, o).catch(e => {

            // check for actual error
            if (typeof e !== "string") throw e;

            // update the data
            data.edit(guild.id, name, o);

            // pass message
            throw e;

        });

    } else return Promise.reject(`'${name}' does not exist or is not an assignable role!`);

};

/**
 * Rename a self-assignable role in a Discord server.
 * @param {Guild} guild         the Discord server
 * @param {string} old_name     the name of the role
 * @param {string} new_name     the new name of the role
 * @returns {Promise<never>}    a Promise that throws the success message
 */
exports.rename = function (guild, old_name, new_name) {

    // ensure this is an assignable role
    if (data.get(guild.id, old_name)) {

        // get role with name
        let r = guild.roles.find(role => role.name === old_name);

        // role doesn't exist
        if (!r) {

            // correct data
            data.delete(guild.id, old_name);

            // error message
            return Promise.reject(`'${old_name}' was deleted and does not exist!`);
        }

        return r.setName(new_name, 'bot-created self-assignable role rename').then(role => {

            // update data
            let temp = data.get(guild.id, new_name);
            data.delete(guild.id, old_name);
            data.add(guild.id, new_name, temp);

            // confirmation message
            throw `Renamed role '${old_name}' to '${role.name}' in server '${guild.name}'`;

        });

    } else return Promise.reject(`'${old_name}' does not exist or is not an assignable role!`);

};

/**
 * Assign a self-assignable role to a member in a Discord server.
 * @param {GuildMember} member  the guild member to assign the role to
 * @param {string} name         the name of the role
 * @returns {Promise<never>}    a Promise that throws the success message
 */
exports.assign = function (member, name) {

    if (data.get(member.guild.id, name)) {

        // get role with name
        let r = member.guild.roles.find(role => role.name === name);

        // role doesn't exist
        if (!r) {

            // correct data
            data.delete(member.guild.id, name);

            // error message
            return Promise.reject(`'${name}' was deleted and does not exist!`);
        }

        return member.addRole(r, 'bot-created self-assignable role assign').then(member => {

            // confirmation message
            throw `Assigned ${member.displayName} the role '${r.name}' in server '${member.guild.name}'`;
        });

    } else return Promise.reject(`'${name}' does not exist or is not an assignable role!`);

};

/**
 * Unassign a self-assignable role in a Discord server.
 * @param {GuildMember} member  the guild member to assign the role to
 * @param {string} name         the name of the role
 * @returns {Promise<never>}    a Promise that throws the success message
 */
exports.unassign = function (member, name) {

    if (data.get(member.guild.id, name)) {

        // get role with name
        let r = member.guild.roles.find(role => role.name === name);

        // role doesn't exist
        if (!r) {

            // correct data
            data.delete(member.guild.id, name);

            // error message
            return Promise.reject(`'${name}' was deleted and does not exist!`);
        }

        // check if member actually has the role
        if (!member.roles.get(r.id))
            return Promise.reject(`${member.displayName} does not have the role '${r.name}'`);

        return member.removeRole(r, 'bot-created self-assignable role unassign').then(member => {

            // confirmation message
            throw `Unassigned the role '${r.name}' from ${member.displayName} in server '${member.guild.name}'`;
        });

    } else return Promise.reject(`'${name}' does not exist or is not an assignable role!`);

};

/**
 * Parse an array of strings in a message to an array of GuildMembers.
 * @param {Array<string>} a         the array of strings to parse
 * @param {Message} message         the message originally containing the strings
 * @returns {Array<GuildMember>}    the array of GuildMembers (empty if incomplete)
 */
exports.members = function (a, message) {

    let ret = []; // guild member array

    for (let u of a) {

        // regex check for mentions (take priority over string matching)
        let rm = u.match(message.mentions.constructor.USERS_PATTERN);
        if (rm) {
            ret.push(message.channel.guild.member(rm[0].match(/[0-9]+/g)[0]));
            continue;
        }

        // case-insesitive matching
        let r = new RegExp(u, 'i');
        rm = message.channel.guild.members.filter(mem => r.test(mem.displayName) || r.test(mem.user.username));

        if (rm.size != 1) {
            message.channel.send(`Could not find one user given '${u}'. Be more specific or try something else.`);
            return [];
        } else ret.push(rm.first());

    }

    return ret;

}

/**
 * List the self-assignable roles and their options in a Discord channel.
 * @param {Channel} channel the Discord channel
 * @param {string} name     [optional] the name of the role whose options to list
 */
exports.list = function (channel, name) {

    data.output(channel, name);

};