
// main cmds.js
const main = require('../cmds.js');

// emojis have different ids per server
const emoji = {

    // build-a-bot emoji id
    '648687731047661568': '676498288416915471',

    // players emoji id
    '468982381899022337': '486585575290175508'

};

exports.ttmtg = {

    name: "ttmtg",
    usage: 'ttmtg',
    help: 'displays the time until the next RIT Players meeting',
    func: function (args, message) {

        main.logCommand(this.name, args); // logging

        let d = new Date(); // 'now'
        let m = new Date(); // to be set to next meeting time

        m.setDate(m.getDate() + ((7 - m.getDay()) % 7 + 2) % 7); // get date of next Tuesday (m will stay a Tuesday if it is already one)
        m.setHours(20, 0, 0, 0); // meetings are at 8p

        // if the time is after 8p on Tuesday, we need to move to the actual next Tuesday
        if (d > m) m.setDate(m.getDate() + (7 - m.getDay()) % 7 + 2);

        // get the difference in the dates
        let ms = m - d;

        // convert ms to days, hours, minutes, and seconds
        let s = parseInt(Math.floor(ms / 1000)); // seconds
        let min = parseInt(Math.floor(s / 60)); // minutes
        let h = parseInt(Math.floor(min / 60)); // hours
        let day = parseInt(Math.floor(h / 24)); // days
        s %= 60;
        min %= 60;
        h %= 24;

        message.channel.send(`${day} days, ${h} hours, ${min} minutes, and ${s} seconds until the next Players meeting.`)
            .then(message => message.react(emoji[message.guild.id]))
            .catch(console.error);

    }

};