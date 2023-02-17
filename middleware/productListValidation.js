// Import third-party module
const { body, check } = require('express-validator')
const pool = require('../config/db')

// isIn with callback
const isInCustom = (callback) => {
    return async (value, { req }) => {
        const allowedValues = await callback(req);
        if (!allowedValues.includes(value)) {
            throw new Error('Invalid selected value');
        }
    }
}

// Insert product form validation
function insertProduct() {
    return [
        // Form validation consist of product name, type, stock, unit, price
        // Name
        body('name').trim().notEmpty().withMessage('Enter product name').isString().withMessage('Enter a valid name'),
        // Type
        body('type').trim().notEmpty().withMessage('Enter product type').custom(isInCustom((req) => getTypes(req))).withMessage('Invalid type selected value'),
        // Stock
        body('stock').trim().notEmpty().withMessage('Enter product stock').isInt({ allow_leading_zeroes: false }).withMessage('Number must be more than 0').isInt({ lt: 10000000 }).withMessage('Number must be less than 10.000.000'),
        // Unit
        body('unit').trim().notEmpty().withMessage('Enter product unit').custom(isInCustom((req) => getUnits(req))).withMessage('Invalid unit selected value'),
        // Price
        body('price').trim().notEmpty().withMessage('Enter product price').isCurrency({
            symbol: 'Rp',
            thousands_separator: '',
            require_symbol: true,
            require_decimal: true,
            allow_negatives: false,
        }).withMessage('Price must be a valid currency value in format Rp1000.00'),
        // File image
        check('image').custom((image, { req }) => {
            if (!req.file) throw new Error("Image is required");
            if (!req.file.mimetype.startsWith("image/")) throw new Error("File must be of image type");
            if (req.file.size > (5 * 1024 * 1024)) throw new Error('Image size must not exceed 5MB');
            return true;
        })
    ]
}
// Update product form validation
function updateProductSuperadmin() {
    return [
        // Form validation consist of product name, type, stock, unit, price
        // Name
        body('name').trim().notEmpty().withMessage('Enter product name').isString().withMessage('Enter a valid name'),
        // Type
        body('type').trim().notEmpty().withMessage('Enter product type').custom(isInCustom((req) => getTypes(req))).withMessage('Invalid type selected value'),
    ]
}
// Update product form validation
function updateProductAdmin() {
    return [
        // Form validation consist of product name, type, stock, unit, price
        // Stock
        body('stock').trim().notEmpty().withMessage('Enter product stock').isInt({ allow_leading_zeroes: false }).withMessage('Number must be more than 0').isInt({ lt: 10000000 }).withMessage('Number must be less than 10.000.000'),
        // Unit
        body('unit').trim().notEmpty().withMessage('Enter product unit').custom(isInCustom((req) => getUnits(req))).withMessage('Invalid unit selected value'),
        // Price
        body('price').trim().notEmpty().withMessage('Enter product price').isCurrency({
            symbol: 'Rp',
            thousands_separator: '',
            require_symbol: true,
            require_decimal: true,
            allow_negatives: false,
        }).withMessage('Price must be a valid currency value in format Rp1000.00')
    ]
}
// Update image form validation
function updateImage() {
    return [
        // Form validation consist of product name, type, stock, unit, price
        // File image
        check('image').custom((image, { req }) => {
            if (!req.file) throw new Error("Image is required");
            if (!req.file.mimetype.startsWith("image/")) throw new Error("File must be of image type");
            if (req.file.size > (5 * 1024 * 1024)) throw new Error('Image size must not exceed 5MB');
            return true;
        })
    ]
}

// Product_type display in validation
const getUnits = async (req) => {
    try {
        const units = await pool.query(`SELECT unit FROM product_unit WHERE unit = '${req.body.unit}'`)
        .then(result => result.rows.map(row => row.unit));
        return units;
    } catch (error) {
        console.error(error);
    }
}
// Product_unit display in validation
const getTypes = async (req) => {
    try {
        const types = await pool.query(`SELECT type FROM product_type WHERE type = '${req.body.type}'`)
        .then(result => result.rows.map(row => row.type));
        return types;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    insertProduct,
    updateImage,
    updateProductAdmin,
    updateProductSuperadmin
}