// Middleware
const pool = require('../config/db')

// CRUD Functions
const displayAll = async (req, res) => {
    const { rows: sales } = await pool.query(`SELECT accounts.username, sales.* FROM sales 
    JOIN accounts ON sales.user_id = accounts.account_id ORDER BY date DESC LIMIT 1000`)
    console.log(sales);
    // With superadmin session
    if (req.session.superadmin) {
        res.render('sale/saleList', {
            superadmin: req.session.superadmin,
            admin: [],
            sales,
            title: 'Selling List',
            layout: 'layout/dashboard',
        });
        // With admin session
    } else if (req.session.admin) {
        res.render('sale/saleList', {
            superadmin: [],
            admin: req.session.admin,
            sales,
            title: 'Selling List',
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
const displayDetail = async (req, res) => {
    const { rows: [sale] } = await pool.query(`SELECT * FROM sales 
    JOIN accounts ON sales.user_id = accounts.account_id
    WHERE sales.sales_id = '${req.params.id}'`)
    // With superadmin session
    if (req.session.superadmin) {
        res.render('sale/saleListDetail', {
            superadmin: req.session.superadmin,
            admin: [],
            sale,
            title: 'Selling List',
            layout: 'layout/dashboard',
        });
        // With admin session
    } else if (req.session.admin) {
        res.render('sale/saleListDetail', {
            superadmin: [],
            admin: req.session.admin,
            sale,
            title: 'Selling List',
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

module.exports = {
    displayAll,
    displayDetail
}