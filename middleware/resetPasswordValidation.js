// Import third-party module
const { body } = require('express-validator')
const pool = require('../config/db')

// Reset password form validation
function checkEmail() {
    return [
        // Form validation consist of username, email, and password
        // Email
        body('email').trim().notEmpty().withMessage('Enter email').isEmail().withMessage('Invalid email format')
        .custom(async (email) => {
            // Query to check
            const { rows: [existEmail] } = await pool.query(`SELECT email FROM accounts WHERE email = '${email}'`)
            if (existEmail !== undefined) {
                // Available
                if (email === existEmail.email) return true
            } else {
                // Not Available
                throw new Error('Invalid registered email account');
            }
        })
    ]
}

function checkPassword() {
    return [
        // Form validation consist of username, email, and password
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
    checkEmail,
    checkPassword
}