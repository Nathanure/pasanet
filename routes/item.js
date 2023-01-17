// Import third-party module
const express = require('express');
// const multer = require('multer')
// Variables of module
const router = express.Router();
// const upload = multer({dest: './public/img/uploads/'})
// Local module
const item = require('../controllers/itemController')

// Router to render and switch directories in URL
// Item route
router.route('/')
    .get(item.displayAll)
    // .post(upload.single('image'), root.rootPost)
    
// Detail item route
router.route('/:id')
    .get(item.displayDetail)

module.exports = router