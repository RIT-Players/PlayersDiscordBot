//
// Used for post validation, creation and storage.
//

const fs = require('fs');

const time = require('./time.js');

const file = __dirname + '/data.json';

let data = {
    index: {}
};
let last_id = 0;


/**
 * 
 * @param {Array<string>} args
 * @param {Message} message
 */
exports.create = function (args, message) {

    // isolate and parse the time-based command arguments
    let post = time.parse(args);

    // failed to parse arguments
    if (post === undefined) {
        message.channel.send('Unable to parse time details...');
        return;
    }

    // post metadata
    post.id = last_id + 1;
    last_id++;
    post.text = args.join(' ');
    post.channel = message.channel.id;

    // add post to time table
    time.add(post.id, post);

    // setup objects in data
    let guild = message.guild.id;
    if (!data[guild]) data[guild] = {};
    if (!data[guild][post.channel]) data[guild][post.channel] = {};

    // store post information
    data[guild][post.channel][new String(post.id)] = post;
    data.index[new String(post.id)] = [guild, post.channel];
    // todo: SAVE

    console.log(data);
    
};

/**
 * 
 * @param {Array<string>} args
 * @param {Message} message
 */
exports.edit = function (args, message) {
    console.log('post edit was called');
};

/**
 * 
 * @param {Array<string>} args
 * @param {Message} message
 */
exports.delete = function (args, message) {
    console.log('post delete was called');
};

/**
 * 
 * @param {Array<string>} args
 * @param {Message} message
 */
exports.skip = function (args, message) {
    console.log('post skip was called');
};

/**
 * 
 * @param {Message} message
 */
exports.list = function (message) {
    console.log('post list was called');
};


/**
 * Post the given message.
 * 
 * @param {number} post    the recurring post ID
 * @param {Client} client  the Discord client
 */
exports.post = function (post, client) {

    // get post
    let p = get(post);

    // send message
    client.channels.get(p.channel).send(p.text);
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

/**
 * 
 * @param {number} id
 */
function get(id) {
    let a = data.index[new String(id)];
    if (!a) return;
    return data[a[0]][a[1]][new String(id)];
}