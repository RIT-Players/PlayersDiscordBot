/**
 * Handles roles options parsing.
 */

// opts can be given in the format name=value or in js format

const checkColor = require("discord.js").ClientDataResolver.resolveColor;
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
const checkPermissions = require('discord.js').Permissions.resolve;


const role_opts = {

    name: {

        // actually assigns checked value
        assign: function (role, v) {

            let old_name = role.name;

            return role.setName(v, 'bot-created self-assignable role rename')
                .then(role => { throw `Renamed role '${old_name}' to '${role.name}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: function (s) { return s; }

    },
    color: {

        // actually assigns checked value
        assign: function (role, v) {

            return role.setColor(v, 'bot-created self-assignable role color set')
                .then(role => { throw `Changed color of role '${role.name}' to '${v}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: function (s) {

            try {

                // attempt to parse
                return checkColor(s);
            } catch (e) {

                // there was an error
                return undefined;
            }

        }

    },
    hoist: {

        // actually assigns checked value
        assign: function (role, v) {

            return role.setHoist(v, 'bot-created self-assignable role hoist set')
                .then(role => { throw `Changed hoist of role '${role.name}' to '${v}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: checkBoolean
    },
    position: {

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
    permissions: {

        // actually assigns checked value
        assign: function (role, v) {

            return role.setPermissions(v, 'bot-created self-assignable role permissions set')
                .then(role => { throw `Changed permissions of role '${role.name}' to '${v}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: function (s) {

            try {

                // attempt to parse
                return checkPermissions(s);
            } catch (e) {

                // there was an error
                return undefined;
            }

        }
    },
    mentionable: {

        // actually assigns checked value
        assign: function (role, v) {

            return role.setMentionable(v, 'bot-created self-assignable role mentionable set')
                .then(role => { throw `Changed mentionable of role '${role.name}' to '${v}' in server '${role.guild.name}'`; });

        },

        // validate string for option (returns checked value or undefined if invalid)
        check: checkBoolean
    }

};


exports.parse = function (s) {

    let a = [{}];
    let q = false; // quotation
    let b = false; // backslash

    for (let c in s) {

        let o = a[a.length - 1];

        if (o.value === undefined) {



        } else {

        }

    }

};

