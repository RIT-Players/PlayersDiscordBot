//
// Handles post timing system for timed messages.
//


// strings to indicate post frequency type
const DAILY_STRING = 'daily';
const WEEKLY_STRING = 'weekly';
const BIWEEKLY_STRING = 'biweekly';
const MONTHLY_STRING = 'monthly';
const YEARLY_STRING = 'yearly';


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

    // extract needed information
    let time_string = new String(time.time);
    let type_string = '-1';
    switch (time.type) {
        case 0:
        case 100:
            type_string = new String(time.type + time.value);
            break;
        case 10000:
            type_string = new String(time.type + time.value * 100 + time.value2);
            break;
    }

    // create objects as needed
    if (!ttable[time_string]) ttable[time_string] = {};
    if (!ttable[time_string][type_string]) ttable[time_string][type_string] = {};

    // add post
    if (time.type_reference)
        ttable[time_string][type_string][new String(id)] = {
            reference: time.type_reference,
            start: time.value2
        };
    else ttable[time_string][type_string][new String(id)] = 1;
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
 * @param {Array<string>} args the post create command arguments
 * @returns {Object|undefined} the parsed time information or undefined if there was a problem
 */
exports.parse = function (args) {

    // TODO: logging

    // object to return
    let ret = {};

    // parse post time type
    switch (args.shift().toLowerCase()) {
        case DAILY_STRING: // remind every day at a given time
            ret.type = -1;
            ret.type_string = DAILY_STRING;
            ret.value = 0;

            // daily posts require no additional information
            break;
        case WEEKLY_STRING: // remind every week on a given day
            ret.type = 0;
            ret.type_string = WEEKLY_STRING;

            // weekly posts require the day of the week to post
            if (args.length < 1) return;
            ret.value = parseDay(args.shift());

            break;
        case BIWEEKLY_STRING: // remind every other week on a given day
            ret.type = 0;
            ret.type_reference = Date.now();
            ret.type_string = BIWEEKLY_STRING;

            // biweekly posts require the day of the week to post and whether or not this week starts the posting
            if (args.length < 2) return;
            ret.value = parseDay(args.shift());
            ret.value2 = parseBoolean(args.shift());
            if (ret.value2 === undefined) return;

            break;
        case MONTHLY_STRING: // remind every month on a given date
            ret.type = 100;
            ret.type_string = MONTHLY_STRING;

            // monthly posts require the date of the month to post
            if (args.length < 1) return;
            ret.value = parseDate(args.shift());

            break;
        case YEARLY_STRING: // remind every year on a given date
            ret.type = 10000;
            ret.type_string = YEARLY_STRING;

            // yearly posts require the month and date to post
            if (args.length < 1) return;
            ret.value = parseMonth(args.shift());
            ret.value2 = parseDate(args.shift());
            if (isNaN(ret.value2)) return;

            break;
        default: return;
    }

    // check time value
    if (isNaN(ret.value)) return;

    // if given a custom time to post, attempt to parse it
    if (args[0].toLowerCase().startsWith('-t=')) {
        ret.time = parseTime(args.shift());
        if (isNaN(ret.time)) return;
    } else ret.time = 1000;
    ret.hour = Math.floor(ret.time / 100);
    ret.minute = ret.time % 100;

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
    if (tobject['-1'])
        for (let [k] of Object.entries(tobject['-1']))
            posts.post(new Number(k), client);

    // day/date information
    let day = new String(d.getDay());
    let date = new String(100 + d.getDate());
    let full_date = new String(10000 + d.getMonth() * 100 + d.getDate());

    // weekly/biweekly posts
    if (tobject[day])
        for (let [k, v] of Object.entries(tobject[day])) {

            // weekly
            if (!Number.isNaN(v)) {
                posts.post(new Number(k), client);
                continue;
            }

            // biweekly
            if (Math.floor((Date.now() - v.reference) / (1000 * 60 * 60 * 24 * 7) % 2) ? !v.start : v.start)
                posts.post(new Number(k), client);

        }

    // monthly posts
    if (tobject[date])
        for (let [k] of Object.entries(tobject[date]))
            posts.post(new Number(k), client);

    // annual posts
    if (tobject[full_date])
        for (let [k] of Object.entries(tobject[full_date]))
            posts.post(new Number(k), client);
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

/**
 * Attempt to parse a string representation of a boolean into an actual boolean.
 * 
 * @param {string} s            the string
 * @returns {boolean|undefined} the corresponding boolean value or undefined if parsing failed
 */
function parseBoolean(s) {

    // lowercase of s
    let sl = s.toLowerCase().trim();

    // s is true
    if (sl === 'true' || sl === 't' || sl === '1')
        return true;

    // s is false
    if (sl === 'false' || sl === 'f' || sl === '0')
        return false;

    // s is neither
    return undefined;
}

/**
 * Attempt to parse a string representation of the day of the week into a number 0 - 6 (Sun. - Sat.).
 * 
 * @param {string} s            the string
 * @returns {number|undefined}  the number or undefined if parsing failed
 */
function parseDay(s) {

    // day given as a number
    let ret = Number.parseInt(s);
    if (Number.isInteger(ret) && ret >= 0 && ret < 7) return ret;

    // day given as string
    switch (s.toLowerCase()) {
        case 'sun':
        case 'sunday':
            return 0;
        case 'm':
        case 'mon':
        case 'monday':
            return 1;
        case 'tue':
        case 'tues':
        case 'tuesday':
            return 2;
        case 'w':
        case 'wed':
        case 'wednesday':
            return 3;
        case 'thu':
        case 'thur':
        case 'thursday':
            return 4;
        case 'f':
        case 'fri':
        case 'friday':
            return 5;
        case 'sat':
        case 'saturday':
            return 6;
    }

    return undefined;
}

/**
 * Attempt to parse a string representation of a date of the month into a number 1 - 31.
 * 
 * @param {string} s            the string
 * @returns {number|undefined}  the number or undefined if parsing failed
 */
function parseDate(s) {

    let ret = Number.parseInt(s);

    // bounds checking
    if (!Number.isInteger(ret) || ret < 1 || ret > 31) return;

    return ret;
}

/**
 * Attempt to parse a string representation of a month into a number 0 - 11 (Jan. - Dec.).
 * 
 * @param {string} s            the string
 * @returns {number|undefined}  the number or undefined if parsing failed
 */
function parseMonth(s) {

    // month given as a number
    let ret = Number.parseInt(s);
    if (Number.isInteger(ret) && ret >= 1 && ret < 12) return ret - 1;

    // month given as string
    switch (s.toLowerCase()) {
        case 'jan':
        case 'january':
            return 0;
        case 'f':
        case 'feb':
        case 'february':
            return 1;
        case 'mar':
        case 'march':
            return 2;
        case 'apr':
        case 'april':
            return 3;
        case 'may':
            return 4;
        case 'jun':
        case 'june':
            return 5;
        case 'jul':
        case 'july':
            return 6;
        case 'aug':
        case 'august':
            return 7;
        case 's':
        case 'sep':
        case 'sept':
        case 'september':
            return 8;
        case 'o':
        case 'oct':
        case 'october':
            return 9;
        case 'n':
        case 'nov':
        case 'november':
            return 10;
        case 'd':
        case 'dec':
        case 'december':
            return 11;
    }

    return undefined;
}

/**
 * Attempt to parse a string representation of a time of the day (in military time) into a number 0 - 2359.
 * 
 * @param {string} s            the string
 * @returns {number|undefined}  the number or undefined if parsing failed
 */
function parseTime(s) {

    let ret = Number.parseInt(s.substring(3));

    // bounds checking
    if (!Number.isInteger(ret) || ret < 0 || ret > 2359) return;

    return ret;
}