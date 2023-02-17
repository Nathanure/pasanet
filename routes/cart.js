// Import third-party module
const express = require('express');
const router = express.Router();
// Local module
const cart = require('../controllers/cartController')

// Router to render and switch directories in URL
// Cart route
router.route('/')
    .get(cart.displayOrder)
    .post(cart.insertOrder)

module.exports = router
