/**
 * Handles operations with roles on a Discord server.
 */

const data = require('./json.js');
const opts_handling = require("./opts.js");
const logger = require("../logging.js").logger;

exports.create = function (guild, name, opts) {
    if (opts) {
        // todo
    } else {

        return guild.createRole({ name: name }, 'bot-created self-assignable role').then(role => {

            // update data
            data.add(name);

            // confirmation message
            throw `Created role '${role.name}' in server '${guild.name}'`;

        });

    }
};

exports.delete = function (guild, name) {

    // ensure this is an assignable role
    if (data.get(name)) {

        // get role with name
        let r = guild.roles.find(role => role.name === name);

        // role doesn't exist
        if (!r) {

            // correct data
            data.delete(name);

            // error message
            return Promise.reject(`'${name}' was deleted and does not exist!`);
        }

        // role exists so delete it
        return r.delete().then(role => {

            // update data
            data.delete(name, 'bot-created self-assignable role delete');

            // confirmation message
            throw `Deleted role '${role.name}' from server '${guild.name}'`;

        });

    } else return Promise.reject(`'${name}' does not exist or is not an assignable role!`);
};

exports.edit = function (guild, name, opts) {

    // ensure this is an assignable role
    if (data.get(name)) {

        // get role with name
        let r = guild.roles.find(role => role.name === name);

        // role doesn't exist
        if (!r) {

            // correct data
            data.delete(name);

            // error message
            return Promise.reject(`'${name}' was deleted and does not exist!`);
        }

        let o = opts_handling.parse(opts);

        if (typeof o === 'string')
            return Promise.reject(o);

        logger.info('role edit with opts: %o', o);

        return opts_handling.assign(r, o);

    } else return Promise.reject(`'${name}' does not exist or is not an assignable role!`);

}

exports.rename = function (guild, old_name, new_name) {

    // ensure this is an assignable role
    if (data.get(old_name)) {

        // get role with name
        let r = guild.roles.find(role => role.name === old_name);

        // role doesn't exist
        if (!r) {

            // correct data
            data.delete(old_name);

            // error message
            return Promise.reject(`'${old_name}' was deleted and does not exist!`);
        }

        return r.setName(new_name, 'bot-created self-assignable role rename').then(role => {

            // update data
            let temp = data.get(new_name);
            data.delete(old_name);
            data.add(new_name, temp);

            // confirmation message
            throw `Renamed role '${old_name}' to '${role.name}' in server '${guild.name}'`;

        });

    } else return Promise.reject(`'${old_name}' does not exist or is not an assignable role!`);

};

exports.assign = function (member, name) {

    if (data.get(name)) {

        // get role with name
        let r = member.guild.roles.find(role => role.name === name);

        // role doesn't exist
        if (!r) {

            // correct data
            data.delete(name);

            // error message
            return Promise.reject(`'${name}' was deleted and does not exist!`);
        }

        return member.addRole(r, 'bot-created self-assignable role assign').then(member => {

            // confirmation message
            throw `Assigned ${member.displayName} the role '${r.name}' in server '${member.guild.name}'`;
        });

    } else return Promise.reject(`'${name}' does not exist or is not an assignable role!`);

};

exports.unassign = function (member, name) {

    if (data.get(name)) {

        // get role with name
        let r = member.guild.roles.find(role => role.name === name);

        // role doesn't exist
        if (!r) {

            // correct data
            data.delete(name);

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

exports.list = function (channel, name) {

    if (name) {

        // todo

    } else data.output(channel);

};