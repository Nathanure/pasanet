// Middleware
const pool = require('../config/db')
const { validationResult } = require('express-validator')
const fs = require('fs')
const moment = require('moment')

// CRUD Functions
const displayAll = async (req, res) => {
    delete req.session.errsession
    const { rows: product } = await pool.query(`SELECT products.product_id, name, stock, to_char(price::numeric, 'RpFM999999999') AS price, to_char(created_at, 'FMDay, DD Month YYYY') as created_at, last_updated, updated_by, product_type.type, product_unit.unit 
    FROM products
    JOIN product_type ON products.type_id = product_type.type_id
    JOIN product_unit ON products.unit_id = product_unit.unit_id`)
    const { rows: type } = await pool.query(`SELECT * FROM product_type`)
    const { rows: unit } = await pool.query(`SELECT * FROM product_unit`)
    // With superadmin session
    if (req.session.superadmin) {
        res.render('product/productList', {
            superadmin: req.session.superadmin,
            admin: [],
            errModal: [],
            product,
            type,
            unit,
            title: 'Product List',
            layout: 'layout/dashboard',
        });
        // With admin session
    } else if (req.session.admin) {
        res.render('product/productList', {
            superadmin: [],
            admin: req.session.admin,
            errModal: [],
            product,
            type: [],
            unit: [],
            title: 'Product List',
            layout: 'layout/dashboard',
        });
        // With other or no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

const insertProduct = async (req, res) => {
    // With superadmin session
    if (req.session.superadmin) {
        try {
            let errors = validationResult(req).array({ onlyFirstError: true });
            if (errors < 1) {
                // Move the file from the temporary location to a permanent location
                fs.rename(req.file.path, './public/img/products/' + req.file.filename, function (err) {
                    if (err) throw err;
                });
                await pool.query(`INSERT INTO products (name, type_id, stock, unit_id, price, created_at, image_path, image_name) VALUES ('${req.body.name}', '${await typeSwitch(req.body.type)}', '${req.body.stock}', '${await unitSwitch(req.body.unit)}', '${req.body.price.substring(2)}'::numeric, '${moment().local().format('YYYY-MM-DD')}', '${req.file.filename}', '${req.file.originalname}') RETURNING *`);
                res.redirect('/product')
            } else {
                const { rows: product } = await pool.query(`SELECT products.product_id, name, stock, to_char(price::numeric, 'RpFM999999999') AS price, to_char(created_at, 'FMDay, DD Month YYYY') as created_at, last_updated, updated_by, product_type.type, product_unit.unit 
                FROM products
                JOIN product_type ON products.type_id = product_type.type_id
                JOIN product_unit ON products.unit_id = product_unit.unit_id`)
                const { rows: type } = await pool.query(`SELECT * FROM product_type`)
                const { rows: unit } = await pool.query(`SELECT * FROM product_unit`)
                res.render('product/productList', {
                    superadmin: req.session.superadmin,
                    admin: [],
                    errModal: errors,
                    modal: '#addProduct',
                    product,
                    type,
                    unit,
                    title: 'Product List',
                    layout: 'layout/dashboard',
                })
            }
        } catch (error) {
            console.error(error);
        }
        // With other or no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

const displayDetail = async (req, res) => {
    const { rows: type } = await pool.query(`SELECT type FROM product_type`);
    const { rows: unit } = await pool.query(`SELECT unit FROM product_unit`);
    const { rows: [product] } = await pool.query(`SELECT products.product_id, name, stock, to_char(price::numeric, 'RpFM999999999') AS price, to_char(created_at, 'FMDay, DD Month YYYY') as created_at, last_updated, updated_by, image_path, image_name, product_type.type, product_unit.unit 
    FROM products
    JOIN product_type ON products.type_id = product_type.type_id
    JOIN product_unit ON products.unit_id = product_unit.unit_id
    WHERE products.product_id = '${req.params.id}'`)
    // With superadmin session
    if (req.session.superadmin) {
        if (req.session.errsession) {
            res.render('product/productListDetail', {
                superadmin: req.session.superadmin,
                admin: [],
                errModal: req.session.errsession,
                modal: '#editProductSuperadmin',
                type,
                unit,
                product,
                title: 'Product List',
                layout: 'layout/dashboard',
            });
        } else {
            delete req.session.errsession
            res.render('product/productListDetail', {
                superadmin: req.session.superadmin,
                admin: [],
                errModal: [],
                type,
                unit,
                product,
                title: 'Product List',
                layout: 'layout/dashboard',
            });
        }
        // With admin session
    } else if (req.session.admin) {
        if (req.session.errsession) {
            res.render('product/productListDetail', {
                superadmin: [],
                admin: req.session.admin,
                errModal: req.session.errsession,
                modal: '#editProductAdmin',
                type,
                unit,
                product,
                title: 'Product List',
                layout: 'layout/dashboard',
            });
        } else {
            delete req.session.errsession
            res.render('product/productListDetail', {
                superadmin: [],
                admin: req.session.admin,
                errModal: [],
                type,
                unit,
                product,
                title: 'Product List',
                layout: 'layout/dashboard',
            });
        }
        // With other or no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

const editImage = async (req, res) => {
    // With superadmin session
    if (req.session.superadmin) {
        try {
            let errors = validationResult(req).array({ onlyFirstError: true });
            if (errors < 1) {
                // Move the file from the temporary location to a permanent location
                fs.rename(req.file.path, './public/img/products/' + req.file.filename, function (err) {
                    if (err) throw err;
                });
                await pool.query(`UPDATE products SET image_path = '${req.file.filename}', image_name = '${req.file.originalname}', last_updated = '${new Date().toISOString()}', updated_by = '${req.session.superadmin.username}' WHERE product_id = '${req.params.id}'`);
                res.redirect(`/product/${req.params.id}`)
            } else {
                const { rows: product } = await pool.query(`SELECT products.product_id, name, stock, to_char(price::numeric, 'RpFM999999999') AS price, to_char(created_at, 'FMDay, DD Month YYYY') as created_at, last_updated, updated_by, product_type.type, product_unit.unit 
                FROM products
                JOIN product_type ON products.type_id = product_type.type_id
                JOIN product_unit ON products.unit_id = product_unit.unit_id`)
                const { rows: type } = await pool.query(`SELECT * FROM product_type`)
                const { rows: unit } = await pool.query(`SELECT * FROM product_unit`)
                res.render('product/productList', {
                    superadmin: req.session.superadmin,
                    admin: [],
                    errModal: errors,
                    modal: '#editImageSuperadmin',
                    product,
                    type,
                    unit,
                    title: 'Product List',
                    layout: 'layout/dashboard',
                })
            }
        } catch (error) {
            console.error(error);
        }
    // With other or no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

const editProduct = async (req, res) => {
    // With superadmin session
    if (req.session.superadmin) {
        try {
            let errors = validationResult(req).array({ onlyFirstError: true });
            if (errors < 1) {
                await pool.query(`UPDATE products SET name = '${req.body.name}', type_id = '${await typeSwitch(req.body.type)}', last_updated = '${new Date().toISOString()}', updated_by = '${req.session.superadmin.username}' WHERE product_id = '${req.params.id}'`);
                res.redirect(`/product/${req.params.id}`)
            } else {
                // Store error
                req.session.errsession = errors
                res.redirect(`/product/${req.params.id}`)
            }
        } catch (error) {
            console.error(error);
        }
        // With admin session
    } else if (req.session.admin) {
        try {
            let errors = validationResult(req).array({ onlyFirstError: true });
            if (errors < 1) {
                await pool.query(`UPDATE products SET stock = stock + ${req.body.stock}, unit_id = '${await unitSwitch(req.body.unit)}', price = '${req.body.price.substring(2)}'::numeric, last_updated = '${new Date().toISOString()}', updated_by = '${req.session.admin.username}' WHERE product_id = '${req.params.id}'`);
                res.redirect(`/product/${req.params.id}`)
            } else {
                // Store error
                req.session.errsession = errors
                res.redirect(`/product/${req.params.id}`)
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        // With other or no session
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

const deleteProduct = async (req, res) => {
    // With superadmin session
    if (req.session.superadmin) {
        await pool.query(`DELETE FROM products WHERE product_id = '${req.params.id}'`)
        res.redirect('/product')
        // With other or no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

// Function to switch the value of unit to primary key in unit
async function typeSwitch(types) {
    switch (types) {
        case 'Grocery products':
            return "GRCRY";
        case 'Household items':
            return "HSHLD";
        case 'Frozen foods':
            return "FROZE";
        case 'Beverage products':
            return "BVRGE";
        case 'Toiletries items':
            return "TOILT";
        case 'Health and wellness products':
            return "HELTH";
        default:
            throw new Error('Please update this function, or make it better');
    }
}
// Function to switch the value of type to primary key in type
async function unitSwitch(units) {
    switch (units) {
        case 'Kilograms':
            return "KGRAM";
        case 'Kilometers':
            return "KMETR";
        case 'Grams':
            return "GRAMS";
        case 'Meters':
            return "METER";
        case 'Pieces':
            return "PIECE";
        case 'Couples':
            return "COUPL";
        case 'Packs':
            return "PACKS";
        case 'Reams':
            return "REAMS";
        default:
            throw new Error('Please update this function, or make it better');
    }
}

module.exports = {
    displayAll,
    insertProduct,
    displayDetail,
    deleteProduct,
    editProduct,
    editImage
}