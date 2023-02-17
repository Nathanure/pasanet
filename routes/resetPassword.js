// Import third-party module
const express = require('express');
const router = express.Router();
// Import local module
const reset = require('../controllers/resetPasswordController')
const valid = require('../middleware/resetPasswordValidation')

// Router to render and switch directories in URL
// Login route
router.route('/')
    .get(reset.displayEmail)
    .post(valid.checkEmail(), reset.insertEmail)

// router.route('/:token')
router.route('/success')
    .get(reset.displayPassword)
    .post(valid.checkPassword(), reset.editPassword)

module.exports = router
