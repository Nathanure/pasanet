// Middleware
const { validationResult } = require('express-validator')
const moment = require('moment')
const pool = require('../config/db')
const cart = require('../middleware/modelSystem')

// CRUD Functions
const root = async (req, res) => {
    // Global
    const { rows: product } = await pool.query(`SELECT products.product_id, name, stock, price, to_char(created_at, 'FMDay, DD Month YYYY') as created_at, last_updated, updated_by, image_path, image_name, product_type.type, product_unit.unit 
    FROM products
    JOIN product_type ON products.type_id = product_type.type_id
    JOIN product_unit ON products.unit_id = product_unit.unit_id`)
    // Superadmin
    const { rows: admin } = await pool.query(`SELECT * FROM accounts WHERE role = 'admin'`)
    // Superadmin & Admin
    if (req.session.errsession !== undefined) delete req.session.errsession
    const { rows: user } = await pool.query(`SELECT * FROM accounts WHERE role = 'user'`)
    const { rows: type } = await pool.query(`SELECT * FROM product_type`)
    const { rows: unit } = await pool.query(`SELECT * FROM product_unit`)
    // Admin
    // User
    // With superadmin session
    if(req.session.superadmin) {
        res.render('root/dashboard', {
            superadmin: req.session.superadmin,
            admin: [],
            adminAcc: admin,
            user,
            product,
            type,
            unit,
            errModal: [],
            title: 'Dashboard',
            layout: 'layout/dashboard',
        });
    // With admin session
    } else if(req.session.admin) {
        res.render('root/dashboard', {
            superadmin: [],
            admin: req.session.admin,
            user,
            product,
            type: [],
            unit: [],
            errModal: [],
            title: 'Dashboard',
            layout: 'layout/dashboard',
        });
    // With user session
    } else if(req.session.user) {
        if (req.session.checkout !== undefined) delete req.session.checkout
        res.render('root/home', {
            user: req.session.user,
            product,
            title: 'Home',
            layout: 'layout/landing-page',
        });
    // With no session
    } else {
        if (req.session.checkout !== undefined) delete req.session.checkout
        res.render('root/home', {
            user: [],
            product,
            title: 'Home',
            layout: 'layout/landing-page',
        });
    }
}

const rootPost = async (req, res) => {
    // With superadmin session
    if (req.session.superadmin) {
        try {
            let errors = validationResult(req).array({ onlyFirstError: true });
            if (errors < 1) {
                // Make a directory and JSON file if it hasn't been made yet
                if (!fs.existsSync('./public/img/products/')) fs.mkdirSync('./public/img/products/');
                // Move the file from the temporary location to a permanent location
                fs.rename(req.file.path, './public/img/products/' + req.file.filename, function(err) {
                    if (err) throw err;
                });
                await pool.query(`INSERT INTO products (name, type_id, stock, unit_id, price, created_at, image_path, image_name) VALUES ('${req.body.name}', '${req.body.type}', '${req.body.stock}', '${req.body.unit}', '${req.body.price.substring(2).replace(',', '')}'::numeric, '${moment().local().format('YYYY-MM-DD')}', '${req.file.filename}', '${req.file.originalname}') RETURNING *`);
                res.redirect('/')
            } else {
                const { rows: product } = await pool.query(`SELECT products.product_id, name, stock, price, to_char(created_at, 'FMDay, DD Month YYYY') as created_at, last_updated, updated_by, product_type.type, product_unit.unit 
                FROM products
                JOIN product_type ON products.type_id = product_type.type_id
                JOIN product_unit ON products.unit_id = product_unit.unit_id`)
                const { rows: type } = await pool.query(`SELECT * FROM product_type`)
                const { rows: unit } = await pool.query(`SELECT * FROM product_unit`)
                res.render('product/productList', {
                    superadmin: req.session.superadmin,
                    admin: [],
                    errModal: errors,
                    product,
                    type,
                    unit,
                    title: 'Dashboard',
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

const rootPut = async (req, res) => {
    // With user session
    if (req.session.user) {
        try {
            // Insert data to a json file and store the data
            cart.addModel(req.body);
            res.status(200);
        } catch (error) {
            console.error(error);
        }
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

module.exports = {
    root,
    rootPost,
    rootPut
} 