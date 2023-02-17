// Middleware
const pool = require('../config/db')

// CRUD Functions
const checkouts = async (req, res) => {
    // Only with checkout session
    if (req.session.checkout) {
        const { rows: [sale] } = await pool.query(`SELECT sales.*, accounts.* FROM sales 
        JOIN accounts ON sales.user_id = accounts.account_id
        WHERE accounts.account_id = '${req.session.user.account_id}' ORDER BY sales.sales_id DESC`)
        const productBuy = JSON.parse(sale.products);
        res.render('root/checkout', {
            user: req.session.user,
            sale,
            productBuy,
            title: 'Checkout',
            layout: 'layout/content-only',
        });
    // With no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

module.exports = checkouts