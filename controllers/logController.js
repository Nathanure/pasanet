// Third-party module
const pool = require('../middleware/db')

// CRUD Functions
const displayLog = async (req, res) => {
    delete req.session.errsession
    const { rows: log } = await pool.query(`SELECT * FROM log ORDER BY time DESC LIMIT 1000`);
    // With superadmin session
    if (req.session.superadmin) {
        res.render('root/log', {
            superadmin: req.session.superadmin,
            admin: [],
            log,
            title: 'Log Dashboard',
            layout: 'layout/dashboard',
        });
        // With other or no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

module.exports = displayLog