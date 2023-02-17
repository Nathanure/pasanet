// Import third-party module
const express = require('express');
const multer = require('multer')
// Variables of module
const router = express.Router();
const upload = multer({dest: './public/img/uploads/'})
// Local module
const root = require('../controllers/rootController')
const auth = require('../controllers/authController')
const valid = require('../middleware/productListValidation')

// Router to render and switch directories in URL
// Index/home route
router.route('/')
    // All role can see
    .get(root.root)
    // Only superadmin can post from root
    .post(upload.single('image'), valid.insertProduct(), root.rootPost)
    // Only user can put from root
    .put(root.rootPut)

// Logout route
router.route('/logout')
    .get(auth.deleteSession)
    
module.exports = router