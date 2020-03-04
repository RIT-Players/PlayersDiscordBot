/**
 * This file can be renamed at some point.
 * Used for json handlings of the roles system.
 */

const fs = require('fs');

const file = __dirname + '/data.json';

let data = {};

function save() {

    fs.writeFileSync(file, JSON.stringify(data));

}

function load() {

    if (!fs.existsSync(file)) return;

    fs.readFile(file, (err, d) => {
        if (err) throw err;
        data = JSON.parse(d);
    });

}


load();

exports.add = function (guild, role, opts) {

    if (!data[guild]) data[guild] = {};
    data[guild][role] = opts ? opts : {};
    save();

};

exports.delete = function (guild, role) {

    if (exports.get(guild, role)) delete data[guild][role];
    save();

};

exports.edit = function (guild, role, opts) {

    if (!exports.get(guild, role)) return;

    data[guild][role] = { ...data[guild][role], ...opts };

    save();

};

exports.get = function (guild, role) {

    // guild should have roles
    if (!data[guild]) return undefined;

    return data[guild][role];

};

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