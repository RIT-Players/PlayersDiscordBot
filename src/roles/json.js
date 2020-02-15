/**
 * This file can be renamed at some point.
 * Used for json handlings of the roles system.
 */

const fs = require('fs');
const path = require('path');

const file = __dirname + '/data.json';

let data = {};

function save() {

    fs.writeFileSync(file, JSON.stringify(data));

}

function load() {

    fs.readFile(file, (err, d) => {
        if (err) throw err;
        data = JSON.parse(d);
    });

}

exports.test = function () {

    data.test = "hi";
    save();

}