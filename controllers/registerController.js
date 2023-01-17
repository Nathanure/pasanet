// Local modules
const pool = require('../middleware/db')
const { validationResult } = require('express-validator')

// CRUD Functions
const displayRegister = (req, res) => {
    if (req.session.user || req.session.admin || req.session.superadmin || req.session.adduser) {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    } else {
        res.render('root/register', {
            title: 'Register',
            layout: 'layout/content-only',
            err: []
        });
    }
}

const insertAccount = async (req, res) => {
    try {
        let errors = validationResult(req).array({onlyFirstError: true});
        if (errors < 1) {
            const { rows : [add] } = await pool.query(`INSERT INTO accounts (email, username, password, created_at) VALUES ('${req.body.email}', '${req.body.username}', crypt('${req.body.password}', gen_salt('bf', 10)), '${moment().local()}') RETURNING *`);
            // Session for success message in login
            req.session.adduser = add
            res.redirect('/login')
        } else {
            res.render('root/register', {
                title: 'Register',
                layout: 'layout/content-only',
                err: errors
            })
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    displayRegister,
    insertAccount
}