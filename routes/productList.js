// Import third-party module
const express = require('express');
const multer = require('multer')
// Variables of module
const router = express.Router();
const upload = multer({dest: './public/img/uploads/'})
// Local module
const valid = require('../controllers/productListValidation')
const product = require('../controllers/productListController')

// Router to render and switch directories in URL
// Product route
router.route('/')
    .get(product.displayAll)
    // Add Product
    .post(upload.single('image'), valid.insertProduct(), product.insertProduct)
// Detail Product route
router.route('/:id')
    .get(product.displayDetail)
    // Edit Image
    .post(upload.single('image'), valid.updateImage(), product.editImage)
// Update detail product with superadmin role route
router.route('/:id/admin')
    // Edit Product, return to displayDetail
    .post(valid.updateProductAdmin(), product.editProduct)
// Update detail product with Admin role route
router.route('/:id/superadmin')
    // Edit Product, return to displayDetail
    .post(valid.updateProductSuperadmin(), product.editProduct)
// Delete Product route
router.route('/:id/delete')
    .get(product.deleteProduct)

module.exports = router
