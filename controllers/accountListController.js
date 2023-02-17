// Middleware
const pool = require('../config/db')

// CRUD Functions
const displayAll = async (req, res) => {
    delete req.session.errsession
    const { rows: admin } = await pool.query(`SELECT * FROM accounts WHERE role = 'admin'`)
    const { rows: user } = await pool.query(`SELECT * FROM accounts WHERE role = 'user'`)
    // With superadmin session
    if(req.session.superadmin) {
        res.render('account/accountList', {
            superadmin: req.session.superadmin,
            admin: [],
            adminAcc: admin,
            user,
            title: 'Account List',
            layout: 'layout/dashboard',
        });
    // With admin session
    } else if(req.session.admin) {
        res.render('account/accountList', {
            superadmin: [],
            admin: req.session.admin,
            user,
            title: 'User List',
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

const displayDetail = async (req, res) => {
    // Clear any error session in detail
    delete req.session.error
    delete req.session.errsession
    const { rows: [account] } = await pool.query(`SELECT * FROM accounts WHERE username = '${req.params.name}'`)
    // With superadmin session
    if(req.session.superadmin) {
        res.render('account/accountListDetail', {
            superadmin: req.session.superadmin,
            admin: [],
            account,
            error: [],
            title: 'Account List',
            layout: 'layout/dashboard',
        });
    // With admin session
    } else if(req.session.admin) {
        res.render('account/accountListDetail', {
            superadmin: [],
            admin: req.session.admin,
            account,
            error: [],
            title: 'User List',
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

const deleteAdmin = async (req, res) => {
    // With superadmin session
    if(req.session.superadmin) {
        await pool.query(`DELETE FROM accounts WHERE username = '${req.params.name}'`)
        res.redirect('/account')
    // With other or no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

const updateRole = async (req, res) => {
    // With superadmin session
    if(req.session.superadmin) {
        const { rows: [account] } = await pool.query(`SELECT * FROM accounts WHERE username = '${req.params.name}'`)
        req.session.error = account.role
        if (account.role === req.body.role) {
            res.render('account/accountListDetail', {
                superadmin: req.session.superadmin,
                admin: [],
                account,
                error: req.session.error,
                title: 'Account List',
                layout: 'layout/dashboard',
            });
        } else {
            delete req.session.error
            await pool.query(`UPDATE accounts SET role = '${req.body.role}' WHERE username = '${req.params.name}'`)
            res.redirect('/account')
        }
    // With other or no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

module.exports = {
    displayAll,
    displayDetail,
    deleteAdmin,
    updateRole
}