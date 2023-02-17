// Middleware
const pool = require('../config/db')
const cart = require('../middleware/modelSystem');

// CRUD Functions
const displayOrder = async (req, res) => {
    // With user session
    if (req.session.user) {
        const product = cart.showModel(req.session.user.account_id)
        const productString = cart.getModel(req.session.user.account_id)
        res.render('root/cart', {
            user: req.session.user,
            product,
            productString,
            errModal: [],
            title: 'Order List',
            layout: 'layout/landing-page',
        });
    // With no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}
const insertOrder = async (req, res) => {
    // With user session
    if (req.session.user) {
        const { rows: [checkout] } = await pool.query(`INSERT INTO sales (user_id, method, products, cost) VALUES ('${req.body.user_id}', '${req.body.method}', '${req.body.product}', '${req.body.total}') RETURNING *`);
        cart.deleteModel(req.session.user.account_id);
        // Session for success payment in cart
        req.session.checkout = checkout;
        res.redirect('/checkout');
    // With no session
    } else {
        res.status(401).render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only',
        });
    }
}

module.exports = {
    displayOrder,
    insertOrder
}