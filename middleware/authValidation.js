// Import third-party module
const { body } = require('express-validator')
const pool = require('../config/db')

// Login form validation
function login() {
    return [
        // Form validation consist of username and password
        // Username
        body('username').trim().notEmpty().withMessage('Enter username').isString().withMessage('Invalid username format')
            .custom(async username => {
                // Query to check
                const { rows: [existName] } = await pool.query(`SELECT username FROM accounts WHERE username = '${username}'`)
                // Username is false
                if (existName === undefined) throw new Error('Invalid Username');
                // Username is true
                return true
            }),
        // Password
        body('password').trim().notEmpty().withMessage('Enter password').isStrongPassword().withMessage('Invalid password format')
            .custom(async password => {
                // Query to check
                const { rows: [check] } = await pool.query(`SELECT password FROM accounts WHERE password = crypt('${password}', password)`)
                // Password is false
                if (!check) throw new Error('Invalid Password');
                // Password is true
                return true
            })
    ]
}

// Register form validation
function register() {
    return [
        // Form validation consist of username, email, and password
        // Username
        body('username').trim().notEmpty().withMessage('Enter username').isString().withMessage('Invalid username format')
            .custom(async (username) => {
                // Query to check
                const { rows: [existName] } = await pool.query(`SELECT username FROM accounts WHERE username = '${username}'`)
                if (existName) {
                    // Not Available
                    if (username === existName.username) throw new Error('Username is not available');
                    // Available
                    if (username !== existName.username) return true
                }
            }),
        // Email
        body('email').trim().notEmpty().withMessage('Enter email').isEmail().withMessage('Invalid email format')
            .custom(async (email) => {
                // Query to check
                const { rows: [existEmail] } = await pool.query(`SELECT email FROM accounts WHERE email = '${email}'`)
                if (existEmail) {
                    // Not Available
                    if (email === existEmail.email) throw new Error('Email is not available');
                    // Available
                    if (email !== existEmail.email) return true
                }
            }),
        // Password
        body('password').trim().notEmpty().withMessage('Enter password').isStrongPassword().withMessage('Invalid password format'),
        body('confirmpassword').trim().notEmpty().withMessage('Enter confirm password')
        .custom(async (confpass, {req}) => {
            // Variable to check
            const password = req.body.password
            // Not the same
            if (password !== confpass) throw new Error(`Password and confirm password is not match`);
            // Not Available
            return true
        })
    ]
}

module.exports = {
    login,
    register
}