// Import third-party module
const express = require('express');
const router = express.Router();
// Local module
const sale = require('../controllers/sellingListController')

// Router to render and switch directories in URL
// Account route
router.route('/')
    .get()

module.exports = router
