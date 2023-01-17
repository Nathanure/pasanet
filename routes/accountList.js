// Import third-party module
const express = require('express');
const router = express.Router();
// Local module
const account = require('../controllers/accountListController')

// Router to render and switch directories in URL
// Account route
router.route('/')
    .get(account.displayAll)

// Detail account route
router.route('/:name')
    .get(account.displayDetail)
    .post(account.updateRole)

// Delete admin account route
router.route('/:name/delete')
    .get(account.deleteAdmin)

module.exports = router
