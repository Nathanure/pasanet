// Import third-party module
const express = require('express');
const multer = require('multer')
// Variables of module
const router = express.Router();
const upload = multer({dest: './public/img/uploads/'})
// Local module
const root = require('../controllers/rootController')
const logout = require('../controllers/authController')

// Router to render and switch directories in URL
// Index/home route
router.route('/')
    // All role can see
    .get(root.root)
    .post(root.rootPost)
    // Only user can put from root
    .put(root.rootPut)

router.route('/logout')
    .get(logout.deleteSession)
    
module.exports = router