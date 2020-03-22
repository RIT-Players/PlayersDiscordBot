//
// Handles roles options parsing.
// Options can be given in two different ways:
// - pure js: {color:"red",mentionable:true}
// - name-value pairs: color = red, mentionable = true
//
//


// these functions are the way in which parsing validates user-inputed values
// they are gathered here for easy changing
const checkColor = function (color) {
    let colors = {
        DEFAULT: 0x000000, WHITE: 0xffffff, AQUA: 0x1abc9c, GREEN: 0x2ecc71, BLUE: 0x3498db,
        YELLOW: 0xffff00, PURPLE: 0x9b59b6, LUMINOUS_VIVID_PINK: 0xe91e63, GOLD: 0xf1c40f,
        ORANGE: 0xe67e22, RED: 0xe74c3c, GREY: 0x95a5a6, NAVY: 0x34495e, DARK_AQUA: 0x11806a,
        DARK_GREEN: 0x1f8b4c, DARK_BLUE: 0x206694, DARK_PURPLE: 0x71368a, DARK_VIVID_PINK: 0xad1457,
        DARK_GOLD: 0xc27c0e, DARK_ORANGE: 0xa84300, DARK_RED: 0x992d22, DARK_GREY: 0x979c9f,
        DARKER_GREY: 0x7f8c8d, LIGHT_GREY: 0xbcc0c0, DARK_NAVY: 0x2c3e50, BLURPLE: 0x7289da,
        GREYPLE: 0x99aab5, DARK_BUT_NOT_BLACK: 0x2c2f33, NOT_QUITE_BLACK: 0x23272a,
    };
    if (typeof color === 'string') {
        color = color.toUpperCase();
        if (color === 'RANDOM') return Math.floor(Math.random() * (0xFFFFFF + 1));
        if (color === 'DEFAULT') return 0;
        color = colors[color] || parseInt(color.replace('#', ''), 16);
    } else if (color instanceof Array) {
        color = (color[0] << 16) + (color[1] << 8) + color[2];
    }

    if (color < 0 || color > 0xFFFFFF) {
        //throw new RangeError('Color must be within the range 0 - 16777215 (0xFFFFFF).');
        return undefined;
    } else if (!color || isNaN(color)) {
        //throw new TypeError('Unable to convert color to a number.');
        return undefined;
    }
    return color;
};//require("discord.js").ClientDataResolver.resolveColor;
const checkBoolean = function (s) {

    // s is not a string
    if (typeof s !== 'string') return undefined;

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
};
const checkNumber = Number;
const checkPermissions = require('discord.js').Permissions;

// the options a role can have
const role_opts = {

    name: { // role name

        // actually assigns checked value
        assign: function (role, v) {

            let old_name = role.name;

            return role.setName(v, 'bot-created self-assignable role rename')
                .then(role => { throw `Renamed role '${old_name}' to '${role.name}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: function (s) { return s; }

    },
    color: { // role color

        // actually assigns checked value
        assign: function (role, v) {

            return role.setColor(v, 'bot-created self-assignable role color set')
                .then(role => { throw `Changed color of role '${role.name}' to '${v}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: checkColor

    },
    hoist: { // display role in its own section in the member list

        // actually assigns checked value
        assign: function (role, v) {

            return role.setHoist(v, 'bot-created self-assignable role hoist set')
                .then(role => { throw `Changed hoist of role '${role.name}' to '${v}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: checkBoolean
    },
    position: { // role position?

        // actually assigns checked value
        assign: function (role, v) {

            return role.setPosition(v, 'bot-created self-assignable role position set')
                .then(role => { throw `Changed position of role '${role.name}' to '${v}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: function (s) {

            let v = checkNumber(s);

            if (v) return v;

            return undefined;

        }
    },
    permissions: { // role permissions

        // actually assigns checked value
        assign: function (role, v) {

            return role.setPermissions(v, 'bot-created self-assignable role permissions set')
                .then(role => { throw `Changed permissions of role '${role.name}' to '${v}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: function (s) {

            try {

                if (parseInt(s))
                    s = parseInt(s);

                // attempt to parse
                return new checkPermissions(s);
            } catch (e) {

                // there was an error
                return undefined;
            }

        }
    },
    mentionable: { // allow role to be mentioned by everyone

        // actually assigns checked value
        assign: function (role, v) {

            return role.setMentionable(v, 'bot-created self-assignable role mentionable set')
                .then(role => { throw `Changed mentionable of role '${role.name}' to '${v}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: checkBoolean
    }

};

/**
 * Parse a string to an options object.
 * @param {string} s        the options to parse
 * @returns {object|string} the parsed object or a failure message
 */
exports.parse = function (s) {

    let o = {};

    // try parse json
    if (s.charAt() === '{') {

        let t;

        try {

            t = JSON.parse(s);

        } catch (e) {

            return `json fail`; // todo

        }

        // verify we know all of the things
        for (let k in t)
            if (role_opts[k] === undefined) return `${k} json fail`; // todo

        o = t;

    } else {

        let t = parseAssignmentList(s);

        for (let i = 0; i < t.length; i++) {

            // check for parsing error
            if (t[i].name === undefined || t[i].value === undefined)
                return `empty fail`; // todo

            // verify we know all of the things
            if (role_opts[(t[i].name = t[i].name.trim())] === undefined)
                return `${t[i].name} list fail`; // todo

            o[t[i].name] = t[i].value.trim();
        }

    }

    // verify each assignment
    for (let k in o) {

        o[k] = role_opts[k].check(o[k]);

        if (o[k] === undefined)
            return `${k} check fail`; // todo

    }

    return o;

};

/**
 * Assign options to a role.
 * @param {Role} role           the Discord role
 * @param {object} opts         the parsed role options
 * @returns {Promise<never>}    a Promise that throws the success message
 */
exports.assign = function (role, opts) {

    let p = [];

    for (let k in opts) {
        p.push(role_opts[k].assign(role, opts[k]).catch(e => {

            if (typeof e !== "string")
                throw `${k} fail`; // todo

            return `${k} success`;

        }));
    }

    return Promise.all(p).then(m => { throw `overall success`; });

};

/**
 * Parse an assignment list (that, for example, would be passed in a command)
 * into a list of corresponding objects.
 *
 * @param {string} s    the string to parse
 * @returns {object}    a list of objects with name and value properties
 */
function parseAssignmentList (s) {

    let a = [{}];
    let q = false; // quotation
    let b = false; // backslash

    for (let i = 0; i < s.length; i++) {

        // quick reference
        let o = a[a.length - 1];

        // a comma separates assignment
        if (s.charAt(i) === ',' && !q && !b) {
            a.push({});
            continue;
        }

        // an equals sign separates name and value
        if (s.charAt(i) === '=' && o.value === undefined && !q && !b) {
            o.value = "";
            continue;
        }

        // quotation marks are special
        if (s.charAt(i) === '"' && !b) {
            q = !q;
            continue;
        }

        // backslashes work as escape characters
        if (s.charAt(i) === '\\' && !b) {
            b = true;
            continue;
        } else if (b) b = false;

        // build o.name and o.value
        if (o.value === undefined) {
            if (o.name === undefined) o.name = "";
            o.name += s.charAt(i);
        } else
            o.value += s.charAt(i);

    }

    return a;

}

