//
// Used for post validation, creation and storage.
//

const fs = require('fs');

const file = __dirname + '/data.json';

let data = {};


exports.create = function (args, message) {

};

exports.edit = function (args, message) {

};

exports.delete = function (args, message) {

};

exports.skip = function (args, message) {

};

exports.list = function (message) {

};


/**
 * Post the given message.
 * 
 * @param {number} msg     the recurring message ID
 * @param {Client} client  the Discord client
 */
exports.post = function (msg, client) {

};


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

// automatically loads post information on startup
load();