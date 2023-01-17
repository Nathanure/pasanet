// Import third-party module
const express = require('express');
const router = express.Router();
// Import local module
const register = require('../controllers/registerController')
const valid = require('../controllers/authValidation')

// Router to render and switch directories in URL
// Register route
router.route('/')
    .get(register.displayRegister)
    .post(valid.register(), register.insertAccount)

module.exports = router
