// Import third-party module
const express = require('express');
const router = express.Router();
// Local module
const sale = require('../controllers/saleController')

// Router to render and switch directories in URL
// Sale route
router.route('/')
    .get(sale.displayAll)
router.route('/:id')
    .get(sale.displayDetail)

module.exports = router
