// Import built-in middleware
const fs = require('fs');

const createFile = () => {
    // Make a directory and JSON file if it hasn't been made yet
    if (!fs.existsSync('./model')) fs.mkdirSync('./model');
    if (!fs.existsSync('./model/checkout.json')) fs.writeFileSync('./model/checkout.json', '', 'utf-8');
    // Picture directory
    if (!fs.existsSync('./public/img/products/')) fs.mkdirSync('./public/img/products/');
}

module.exports = createFile;