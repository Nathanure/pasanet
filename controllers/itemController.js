// Middleware
const pool = require('../config/db')

const displayAll = async (req, res) => {
    const { rows: product } = await pool.query(`SELECT products.product_id, name, stock, price, to_char(created_at, 'FMDay, DD Month YYYY') as created_at, last_updated, updated_by, image_path, image_name, product_type.type, product_unit.unit 
    FROM products
    JOIN product_type ON products.type_id = product_type.type_id
    JOIN product_unit ON products.unit_id = product_unit.unit_id`)
    // With superadmin or admin session
    if (req.session.superadmin || req.session.admin) {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    // With user session
    } else if (req.session.user) {
        res.render('item/items', {
            user: req.session.user,
            product,
            title: 'Item List',
            layout: 'layout/landing-page',
        });
    // With no session
    } else {
        res.render('item/items', {
            user: [],
            product,
            title: 'Item List',
            layout: 'layout/landing-page',
        });
    }
}
const displayDetail = async (req, res) => {
    const { rows: [product] } = await pool.query(`SELECT products.product_id, name, stock, price, to_char(created_at, 'FMDay, DD Month YYYY') as created_at, last_updated, updated_by, image_path, image_name, product_type.type, product_unit.unit 
    FROM products
    JOIN product_type ON products.type_id = product_type.type_id
    JOIN product_unit ON products.unit_id = product_unit.unit_id
    WHERE products.product_id = ${req.params.id}`)
    // With superadmin or admin session
    if (req.session.superadmin || req.session.admin) {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    // With user session
    } else if (req.session.user) {
        res.render('item/itemDetail', {
            user: req.session.user,
            product,
            title: 'Item List',
            layout: 'layout/landing-page',
        });
    // With no session
    } else {
        res.render('item/itemDetail', {
            user: [],
            product,
            title: 'Item List',
            layout: 'layout/landing-page',
        });
    }
}

module.exports = {
    displayAll,
    displayDetail,
}