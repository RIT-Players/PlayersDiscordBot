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

exports.add = function (role, opts) {

    data[role] = opts ? opts : {};
    save();

};

exports.delete = function (role) {

    if (data[role]) delete data[role];
    save();

};

exports.get = function (role) {

    return data[role];

};

exports.output = function (channel) {

    let msg = '';

    for (let role in data) {
        msg += `\nRole: '${role}'`;
        for (let opt in data[role]) {
            msg += `\n     ${opt}: ${data[role][opt]}`;
        }
    }

    channel.send(msg);

};