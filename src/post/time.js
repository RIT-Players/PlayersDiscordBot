//
// Handles post timing system for timed messages.
//

// used to send posts when the time table indicates they should be posted
const posts = require('./posts.js');

// discord client for sending (unprompted) messages
let client;

// time table for quickly looking up what to post at a given time
// does NOT validate guild
const ttable = {};

/**
 * Temporary initialization function to start the timing system.
 * @param {Client} _client the Discord client for the bot
 */
exports.init = function (_client) {
    client = _client;
    client.setTimeout(timeout, (60 - new Date().getSeconds()) * 1000);
};

/**
 * Adds a post to the time table.
 * 
 * @param {number} id   the id of the post to add
 * @param {Object} time the time information associated with the post
 */
exports.add = function (id, time) {

};

/**
 * Removes a post from the time table. Incredibly slow if there are a lot of posts.
 * 
 * @param {number} id   the id of the post to remove
 */
exports.remove = function (id) {

    // recursively search an object for a numerical value
    function search(num, obj) {
        for (const [k, v] of Object.entries(obj)) {
            if (v === num) return Array.of(k);
            if (v instanceof Object) {
                let s = search(num, v);
                if (s) {
                    s.unshift(k);
                    return s;
                }
            }
        }
    }

    // search returns an array used to navigate to object
    // it is ASSUMED the post number has been checked so search should return a valid array
    let array = search(id, ttable);

    // used to resolve what to delete
    let objects = [ttable];
    let k = array[0];

    // resolve internal objects
    for (let i = 1; i < array.length; i++) {
        objects.unshift(objects[0][k]);
        k = array[i];
    }

    // find largest deletable part
    while (objects.length > 1) {
        if (Object.keys(objects[0]).length > 1) break;
        objects.shift();
        array.pop();
        k = array[array.length - 1];
    }

    // actually delete post and extraneous time table information
    delete objects[0][k];

    // this method is so complicated in order to delete as much information as possible from the time table as to
    // avoid clutter from repetitive creating and deleting

};

/**
 * Produces an object representing the time information for a given post.
 * 
 * @param {string} type
 * @param {Array<string>} vals
 * 
 * @returns {Object|undefined} the parsed time information or undefined if there was a problem
 */
exports.parse = function (type, vals) {

    // object to return
    let ret = {};

    // parse post time type
    switch (type.toLowerCase()) {
        case 'daily': // remind every day at a given time
            ret.type = -1;
            ret.type_string = 'daily';
            break;
        case 'weekly': // remind every week on a given day
            ret.type = 0;
            ret.type_string = 'weekly';
            break;
        case 'biweekly': // remind every other week on a given day
            ret.type = 0;
            ret.type_reference = Date.now();
            ret.type_string = 'biweekly';
            break;
        case 'monthly': // remind every month on a given date
            ret.type = 100;
            ret.type_string = 'monthly';
            break;
        case 'annually': // remind every year on a given date
            ret.type = 10000;
            ret.type_string = 'annual';
            break;
        default: return;
    }

    

    return ret;

};

/**
 * Called at the start of every minute.
 */
function inter() {
    //client.channels.get('648688174620606524').send('the minute changed');

    // current date
    let d = new Date();

    // current time
    let t = d.getHours() * 100 + d.getMinutes();

    // time object with posts scheduled for the current time
    let tobject = ttable[new String(t)];
    if (!tobject) return;

    // daily posts
    if (tobject['0'])
        for (let [k] of Object.entries(tobject['0']))
            posts.post(new Number(k));

    // day/date information
    let day = new String(d.getDay());
    let date = new String(100 + d.getDate());
    let full_date = new String(10000 + d.getMonth() * 100 + d.getDate());

    // weekly/biweekly posts
    if (tobject[day])
        for (let [k, v] of Object.entries(tobject[day])) {

            // weekly
            if (v instanceof Number) {
                posts.post(new Number(k));
                continue;
            }

            // biweekly
            if (Math.floor((Date.now() - v.reference) / (1000 * 60 * 60 * 24 * 7) % 2) ? start : !start)
                posts.post(new Number(k));

        }

    // monthly posts
    if (tobject[date])
        for (let [k] of Object.entries(tobject[date]))
            posts.post(new Number(k));

    // annual posts
    if (tobject[full_date])
        for (let [k] of Object.entries(tobject[full_date]))
            posts.post(new Number(k));
}

/**
 * Run when the bot starts up to get the time system on rythym (i.e. the start of every minute).
 */
function timeout() {

    // call interval function like normal
    inter();

    // call interval function again every minute
    client.setInterval(inter, 60000);

}