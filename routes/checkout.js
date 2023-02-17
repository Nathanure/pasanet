// Import third-party module
const express = require('express');
const router = express.Router();
// Import local module
const checkouts = require('../controllers/checkoutController')

// Router to render and switch directories in URL
// Login route
router.route('/')
    .get(checkouts)

module.exports = router
