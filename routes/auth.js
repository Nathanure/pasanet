// Import third-party module
const express = require('express');
const router = express.Router();
// Import local module
const login = require('../controllers/authController')
const valid = require('../controllers/authValidation')

// Router to render and switch directories in URL
// Login route
router.route('/')
    .get(login.displayLogin)
    .post(valid.login(), login.setNewSession)

module.exports = router
