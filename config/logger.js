// Import local module
const pool = require('./db')
const chalk = require('chalk')

// Morgan Config
function morganConfig (tokens, req, res) {
    // Variables for logger
    const date = tokens.date(req, res)
    const method = tokens.method(req, res)
    const url = tokens.url(req, res)
    const status = tokens.status(req, res)
    const length = tokens.res(req, res, 'content-length')
    const rstime = tokens['response-time'](req, res) + ' ms'
    const origin = tokens.referrer(req, res)
    const address = tokens['remote-addr'](req, res)
    // With superadmin session
    if(req.session.superadmin) {
        const name = req.session.superadmin.username
        const role = req.session.superadmin.role
        // If 304
        if (length === undefined) {
            logdb(name, role, date, method, url, status, 0, rstime, origin, address)
            return [chalk.whiteBright(name), chalk.magenta(role), chalk.hex('#f78fb3').bold(date), chalk.hex('#34ace0').bold(method), chalk.hex('#ff5252').bold(url), chalk.hex('#ffb142').bold(status), chalk.cyanBright('0'), chalk.hex('#2ed573').bold(rstime), chalk.hex('#fffa65').bold(origin), chalk.yellow(address)].join(' ')
        // If !304
        } else {
            logdb(name, role, date, method, url, status, length, rstime, origin, address)
            return [chalk.whiteBright(name), chalk.magenta(role), chalk.hex('#f78fb3').bold(date), chalk.hex('#34ace0').bold(method), chalk.hex('#ff5252').bold(url), chalk.hex('#ffb142').bold(status), chalk.cyanBright(length), chalk.hex('#2ed573').bold(rstime), chalk.hex('#fffa65').bold(origin), chalk.yellow(address)].join(' ')
        }
    // With admin session
    } else if(req.session.admin) {
        const name = req.session.admin.username
        const role = req.session.admin.role
        // If 304
        if (length === undefined) {
            logdb(name, role, date, method, url, status, 0, rstime, origin, address)
            return [chalk.whiteBright(name), chalk.magenta(role), chalk.hex('#f78fb3').bold(date), chalk.hex('#34ace0').bold(method), chalk.hex('#ff5252').bold(url), chalk.hex('#ffb142').bold(status), chalk.cyanBright('0'), chalk.hex('#2ed573').bold(rstime), chalk.hex('#fffa65').bold(origin), chalk.yellow(address)].join(' ')
        // If !304
        } else {
            logdb(name, role, date, method, url, status, length, rstime, origin, address)
            return [chalk.whiteBright(name), chalk.magenta(role), chalk.hex('#f78fb3').bold(date), chalk.hex('#34ace0').bold(method), chalk.hex('#ff5252').bold(url), chalk.hex('#ffb142').bold(status), chalk.cyanBright(length), chalk.hex('#2ed573').bold(rstime), chalk.hex('#fffa65').bold(origin), chalk.yellow(address)].join(' ')
        }
    // With user session
    } else if(req.session.user) {
        const name = req.session.user.username
        const role = req.session.user.role
        // If 304
        if (length === undefined) {
            logdb(name, role, date, method, url, status, 0, rstime, origin, address)
            return [chalk.whiteBright(name), chalk.magenta(role), chalk.hex('#f78fb3').bold(date), chalk.hex('#34ace0').bold(method), chalk.hex('#ff5252').bold(url), chalk.hex('#ffb142').bold(status), chalk.cyanBright('0'), chalk.hex('#2ed573').bold(rstime), chalk.hex('#fffa65').bold(origin), chalk.yellow(address)].join(' ')
        // If !304
        } else {
            logdb(name, role, date, method, url, status, length, rstime, origin, address)
            return [chalk.whiteBright(name), chalk.magenta(role), chalk.hex('#f78fb3').bold(date), chalk.hex('#34ace0').bold(method), chalk.hex('#ff5252').bold(url), chalk.hex('#ffb142').bold(status), chalk.cyanBright(length), chalk.hex('#2ed573').bold(rstime), chalk.hex('#fffa65').bold(origin), chalk.yellow(address)].join(' ')
        }    
    // With no session
    } else {
        if (length === undefined) {
            logdb('Guest', 'viewer', date, method, url, status, 0, rstime, origin, address)
            return [chalk.whiteBright('Guest'), chalk.magenta('viewer'), chalk.hex('#f78fb3').bold(date), chalk.hex('#34ace0').bold(method), chalk.hex('#ff5252').bold(url), chalk.hex('#ffb142').bold(status), chalk.cyanBright('0'), chalk.hex('#2ed573').bold(rstime), chalk.hex('#fffa65').bold(origin), chalk.yellow(address)].join(' ')
        // If !304
        } else {
            logdb('Guest', 'viewer', date, method, url, status, length, rstime, origin, address)
            return [chalk.whiteBright('Guest'), chalk.magenta('viewer'), chalk.hex('#f78fb3').bold(date), chalk.hex('#34ace0').bold(method), chalk.hex('#ff5252').bold(url), chalk.hex('#ffb142').bold(status), chalk.cyanBright(length), chalk.hex('#2ed573').bold(rstime), chalk.hex('#fffa65').bold(origin), chalk.yellow(address)].join(' ')
        }
    }
}

// Push log to database
const logdb = async (name, role, date, method, url, status, length, rstime, origin, address) => {
    try {
        await pool.query(`INSERT INTO log VALUES (gen_random_uuid(), '${name}', '${role}', '${date}', '${method}', '${url}', '${status}', ${length}, '${rstime}', '${origin}', '${address}') RETURNING *`);
    } catch (error) {
        console.error(error);
    }
}

module.exports = morganConfig