// Third-party module
const crypto = require('crypto');
const { validationResult } = require('express-validator')
const sendEmail = require('../config/nodeMailer')
const pool = require('../config/db')

// Forgot password
const displayEmail = (req, res) => {
    if (req.session.user || req.session.admin || req.session.superadmin) {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    } else {
        res.render('resetPassword/checkEmail', {
            title: 'Forgot Password',
            layout: 'layout/content-only',
            err: [],
            successMessage: [],
            errorMessage: []
        });
    }
}
const displayPassword = (req, res) => {
    if (req.session.email) {
        res.render('resetPassword/resetPassword', {
            title: 'Reset Password',
            layout: 'layout/content-only',
            err: [],
        });
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

const insertEmail = (req, res) => {
    if (req.session.user || req.session.admin || req.session.superadmin) {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    } else {
        try {
            let error = validationResult(req).array({ onlyFirstError: true });
            if (error < 1) {
                const email = req.body.email;
                // Session for success message in login
                req.session.email = email
                console.log(req.session.email);
                res.redirect('/reset-password/success')

                // // Generate a token for resetting the password.
                // const token = crypto.randomBytes(20).toString('hex');
                
                // // Send an email with the reset link.
                // const resetLink = `http://${req.headers.host}/reset-password/${token}`;
                // const message = `Please follow the link to reset your password: ${resetLink}`;
                // sendEmail(email, 'Pasanet - Password Reset', message, (err) => {
                //     if (err) {
                //         return res.status(500).render('resetPassword/checkEmail', {
                //             title: 'Forgot Password',
                //             layout: 'layout/content-only',
                //             errorMessage: 'Error sending email',
                //             successMessage: [],
                //             err: [],
                //         });
                //     }
                //     res.render('resetPassword/checkEmail', {
                //         title: 'Forgot Password',
                //         layout: 'layout/content-only',
                //         successMessage: 'Email sent!',
                //         errorMessage: [],
                //         err: [],
                //     });
                // });
            } else {
                res.render('resetPassword/checkEmail', {
                    title: 'Forgot Password',
                    layout: 'layout/content-only',
                    err: error,
                    successMessage: [],
                    errorMessage: []
                });
            }
        } catch (error) {
            res.send(error)
            console.error(error);
        }
    }
}
const editPassword = async (req, res) => {
    if (req.session.email) {
        try {
            let error = validationResult(req).array({ onlyFirstError: true });
            if (error < 1) {
                await pool.query(`UPDATE accounts SET password = crypt('${req.body.password}', gen_salt('bf', 10)) WHERE email = '${req.session.email}'`);
                // Return back to login
                res.redirect('/login')
            } else {
                res.render('resetPassword/resetPassword', {
                    title: 'Forgot Password',
                    layout: 'layout/content-only',
                    err: error,
                });
            }
        } catch (error) {
            res.send(error)
            console.error(error);
        }
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

module.exports = {
    displayEmail,
    displayPassword,
    insertEmail,
    editPassword
}