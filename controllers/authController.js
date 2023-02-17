// Third-party module
const { validationResult } = require('express-validator')
const pool = require('../config/db')

// CRUD Functions
const displayLogin = (req, res) => {
    if (req.session.user || req.session.admin || req.session.superadmin) {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    } else {
        if (req.session.adduser) {
            res.render('root/login', {
                title: 'Login',
                layout: 'layout/content-only',
                newuser: req.session.adduser,
                err: []
            });
        } else {
            res.render('root/login', {
                title: 'Login',
                layout: 'layout/content-only',
                err: [],
                newuser: []
            });
        }
    }
}

const setNewSession = async (req, res) => {
    try {
        let errors = validationResult(req).array({ onlyFirstError: true });
        if (errors < 1) {
            const { rows: [foundAccount] } = await pool.query(`SELECT * FROM accounts WHERE username = '${req.body.username}'`)
            // Authenticated user that's going to get a session
            if (foundAccount.role === 'user') {
                req.session.user = foundAccount
                delete req.session.adduser
                res.redirect('/')
            }
            // Authenticated admin that's going to get a session
            if (foundAccount.role === 'admin') {
                req.session.admin = foundAccount
                // model.deleteModel(foundAccount.id_user)
                delete req.session.adduser
                res.redirect('/')
            }
            // Authenticated superadmin that's going to get a session
            if (foundAccount.role === 'superadmin') {
                req.session.superadmin = foundAccount
                // model.deleteModel(foundAccount.id_user)
                delete req.session.adduser
                res.redirect('/')
            }
        } else {
            res.render('root/login', {
                title: 'Login',
                layout: 'layout/content-only',
                err: errors,
                newuser: []
            })
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteSession = (req, res) => {
    // Delete superadmin session
    if(req.session.superadmin) {
        delete req.session.superadmin
        delete req.session.errsession
        res.redirect('/')
    // Delete admin session
    } else if(req.session.admin) {
        delete req.session.admin
        delete req.session.errsession
        res.redirect('/')    
    // Delete user session
    } else if(req.session.user) {
        delete req.session.user
        delete req.session.checkout
        res.redirect('/')
    // Delete nothing
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

module.exports = {
    displayLogin,
    setNewSession,
    deleteSession
}