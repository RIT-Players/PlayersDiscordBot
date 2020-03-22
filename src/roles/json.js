//
// This file can be renamed at some point.
// Used for json handlings of the roles system.
//
//

const fs = require('fs');

const file = __dirname + '/data.json';

let data = {};

/**
 * Write data to JSON file.
 */
function save() {

    fs.writeFileSync(file, JSON.stringify(data));

}

/**
 * Read data from JSON file.
 */
function load() {

    if (!fs.existsSync(file)) return;

    fs.readFile(file, (err, d) => {
        if (err) throw err;
        data = JSON.parse(d);
    });

}

// start by loading any initial data
load();

/**
 * Add a role to save to the data file.
 * @param {string} guild    the id of guild the role is in
 * @param {string} role     the name of the role
 * @param {object} opts     the non-default options of the role
 */
exports.add = function (guild, role, opts) {

    if (!data[guild]) data[guild] = {};
    data[guild][role] = opts ? opts : {};
    save();

};

/**
 * Delete a role from the data file.
 * @param {string} guild    the id of guild the role is in
 * @param {string} role     the name of the role
 */
exports.delete = function (guild, role) {

    if (exports.get(guild, role)) delete data[guild][role];
    save();

};

/**
 * Change a role's options in the data file.
 * @param {string} guild    the id of guild the role is in
 * @param {string} role     the name of the role
 * @param {object} opts     the options to change and their values
 */
exports.edit = function (guild, role, opts) {

    if (!exports.get(guild, role)) return;

    data[guild][role] = { ...data[guild][role], ...opts };

    save();

};

/**
 * Get the options for a role.
 * @param {string} guild    the id of the guild the role is in
 * @param {string} role     the name of the role
 * @returns {object}        the options of the role or undefined if role does not exist
 */
exports.get = function (guild, role) {

    // guild should have roles
    if (!data[guild]) return undefined;

    return data[guild][role];

};

/**
 * Output saved role data to a Discord channel.
 * @param {Channel} channel the Discord channel
 * @param {string} role     [optional] the name of the role whose options to list
 */
exports.output = function (channel, role) {

    let msg = '';
    let roles = data[channel.guild.id];

    if (!roles || Object.keys(roles).length < 1)
        msg = 'There are no self-assignable roles in this server.';

    else {

        if (role) {

            let opt = roles[role];
            if (!opt) msg = `'${role}' does not exist or is not an assignable role!`;
            else {

                msg += `\nRole: '${role}'`;
                for (let o in opt) {
                    msg += `\n     ${o}: ${opt[o]}`;
                }

            }

        } else {

            for (let r in roles) {
                msg += `\nRole: '${r}'`;
                for (let opt in roles[r]) {
                    msg += `\n     ${opt}: ${roles[r][opt]}`;
                }
            }
        }
    }

    channel.send(msg);

};