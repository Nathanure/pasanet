// Import built-in middleware
const fs = require('fs');

// Initialized in server.js
// Make a directory if it hasn't been made yet
const checkDir = () => {
    if (!fs.existsSync('./model/')) fs.mkdirSync('./model/');
    if (!fs.existsSync('./model/checkout.json')) fs.writeFileSync('./model/checkout.json', '[]', 'utf-8');
    if (!fs.existsSync('./public/img/products/')) fs.mkdirSync('./public/img/products/');
} 

module.exports = checkDir;