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

    if (args.length < 1) {
        message.channel.send('No message to post was given.');
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
    message.channel.send(`Created ${post.type_string} post (#${post.id})` +
        ` to send ${timeString(post)} with the text '${post.text}'.`);
    
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

    if (!data.index[args[0]]) {
        message.channel.send(`Could not find post with id #${args[0]}.`);
        return;
    }

    time.remove(Number.parseInt(args[0]));
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

    if (!data[message.guild.id] ||
        !data[message.guild.id][message.channel.id] ||
        Object.keys(data[message.guild.id][message.channel.id]).length < 1) {
        message.channel.send(`There are no posts for the ${message.channel.name} channel in ${message.guild.name}.`);
        return;
    }

    let msg = `Posts for the ${message.channel.name} channel in ${message.guild.name}:`;

    for (let [k, v] of Object.entries(data[message.guild.id][message.channel.id]))
        msg += `\n${k}: "${v.text}" (${timeString(v)})`;

    message.channel.send(msg);
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

/**
 * 
 * @param {Object} post
 */
function timeString(post) {

    let ret;
    let a = [];

    switch (post.type) {
        case -1:
            ret = 'every day';
            break;
        case 0:
            a = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            if (!post.type_reference) {
                ret = `every ${a[post.value]}`;
                break;
            }
            let b = Math.floor((Date.now() - post.type_reference) / (1000 * 60 * 60 * 24 * 7) % 2) ?
                !post.value2 : post.value2;
            ret = `every other ${a[post.value]} ${b ? '' : 'not '}starting this week`;
            break;
        case 100:
            ret = `every month on the ${ordinal(post.value)}`;
            break;
        case 10000:
            a = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];
            ret = `every year on the ${ordinal(post.value2)} of ${a[post.value]}`;
            break;
    }

    let t;
    if (post.hour > 12) t = `${post.hour - 12}:`;
    else if (post.hour === 0) t = '12:';
    else t = `${post.hour}:`;
    if (post.hour > 11) t += `${new String(post.minute).padStart(2, '0')}pm`;
    else t += `${new String(post.minute).padStart(2, '0')}am`;
    
    ret += ` at ${t}`;
    return ret;
}

function ordinal(i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}