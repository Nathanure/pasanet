// Import third-party module
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const cors = require('cors')
const session = require('express-session') 
const logger = require('morgan')
const cookieParser = require('cookie-parser')
// Import local module
const morganConfig = require('./config/logger')
const corsOptions = require('./config/cors')
const sessionMain = require('./config/session')
const createFile = require('./config/createFs')

// Variable for express
const app = express()
// Variable for port
const port = 3000

// Basic setup using EJS with Express JS
app.set('view engine', 'ejs')

// Basic setup using Express-ejs-layouts with Express JS
app.use(expressLayouts)
createFile()

// Cross Origin Resource Sharing
app.use(logger(morganConfig)) // Middleware HTTP logger
app.use(cors(corsOptions)) // CORS whitelist
app.use(session(sessionMain)) // Session
app.use(express.json()) // Built-in middleware for JSON
app.use(cookieParser()) // Cookie Parser 
app.use(express.urlencoded({ extended: true })); // Built-in middleware to handle urlencoded form data

// Allow middleware to execute these assets to public or web browser
app.use('/', express.static('public'))
app.use('/account', express.static('public'))
app.use('/product', express.static('public'))
app.use('/item', express.static('public'))

// Middleware to render routes and switch directories in URL
// Global Routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/auth'))
// Superadmin Routes
app.use('/log', require('./routes/log'))
// Admin & Superadmin Routes
app.use('/product', require('./routes/productList'))
app.use('/account', require('./routes/accountList'))
app.use('/sale', require('./routes/sellingList'))
// Admin Routes
// User Routes
app.use('/item', require('./routes/item'))
// app.use('/order', require('./routes/order'))
// app.use('/checkout', require('./routes/checkout'))

// 404 Not Found if page is not found
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.render('root/404', {
            title: '404 Not Found',
            layout: 'layout/content-only'
        });
    } else if (req.accepts('json')) {
        res.json({error: "404 Not Found"})
    } else {
        res.type('txt').send('404 Not Found')
    }
})
app.all('*', (req, res) => {
    res.status(401);
    if (req.accepts('html')) {
        res.render('root/401', {
            title: '401 Unauthorized',
            layout: 'layout/content-only'
        });
    } else if (req.accepts('json')) {
        res.json({error: "401 Unauthorized"})
    } else {
        res.type('txt').send('401 Unauthorized')
    }
})
app.all('*', (req, res) => {
    res.status(500);
    if (req.accepts('html')) {
        res.render('root/500', {
            title: '500 Internal Server Error',
            layout: 'layout/content-only'
        });
    } else if (req.accepts('json')) {
        res.json({error: "500 Internal Server Error"})
    } else {
        res.type('txt').send('500 Internal Server Error')
    }
})

// Port server listen to
app.listen(port, () => {
    console.log(`Server currently running on port ${port}`)
})