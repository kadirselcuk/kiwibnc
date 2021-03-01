const strftime = require('strftime').timezone('+0');

module.exports.isoTime = isoTime;
function isoTime(date) {
    return date ?
        strftime('%Y-%m-%dT%H:%M:%S.%LZ', date) :
        strftime('%Y-%m-%dT%H:%M:%S.%LZ');
}

module.exports.now = now;
function now() {
    return Math.floor(Date.now() / 1000);
}

// Get a message param or return a default
module.exports.mParam = mParam;
function mParam(msg, idx, def) {
    return msg.params[idx] || def;
}

// Get a message param or a default, and return it in uppercase
module.exports.mParamU = mParamU;
function mParamU(msg, idx, def) {
    return (mParam(msg, idx, def) || '').toUpperCase();
}

// Validate a username
module.exports.validUsername = validUsername;
function validUsername(username) {
    return (/^[^0-9\-][0-9a-z[\]^_`{|}\-]+$/i).test(username);
}

// Parse a string such as tcp://hostname:1234/path into:
// {proto:'tcp', hostname:'hostname', port:1234, path:'path'}
module.exports.parseBindString = parseBindString;
function parseBindString(inp) {
    let m = inp.match(/^(?:(?<proto>[^:]+)?:\/\/)?(?<hostname>[^:]+)(?::(?<port>[0-9]*))?(?<path>.*)$/);
    if (!m) {
        return;
    }

    return m.groups;
}

// Clone an IRC message
module.exports.cloneIrcMessage = cloneIrcMessage;
function cloneIrcMessage(srcMsg) {
    let msg = new srcMsg.constructor(srcMsg.command);
    msg.tags = srcMsg.tags;
    msg.prefix = srcMsg.prefix;
    msg.nick = srcMsg.nick;
    msg.ident = srcMsg.ident;
    msg.hostname = srcMsg.hostname;
    msg.command = srcMsg.command;
    msg.params = srcMsg.params;
    return msg;
}

// Parse a user mask into its user/ident/host parts
module.exports.parseMask = parseMask;
function parseMask(mask) {
    var nick = '';
    var user = '';
    var host = '';

    var sep1 = mask.indexOf('!');
    var sep2 = mask.indexOf('@');

    if (sep1 === -1 && sep2 === -1) {
        // something
        if (mask.indexOf('.') > -1) {
            host = mask;
        } else {
            nick = mask;
        }
    } else if (sep1 === -1 && sep2 !== -1) {
        // something@something
        nick = mask.substring(0, sep2);
        host = mask.substring(sep2 + 1);
    } else if (sep1 !== -1 && sep2 === -1) {
        // something!something
        nick = mask.substring(0, sep1);
        user = mask.substring(sep1 + 1);
    } else {
        // something!something@something
        nick = mask.substring(0, sep1);
        user = mask.substring(sep1 + 1, sep2);
        host = mask.substring(sep2 + 1);
    }

    return {
        nick: nick,
        user: user,
        host: host,
    };
}
