// Imported modules of core module
const fs = require('fs')

// Create checkout JSON file if it hasn't been made yet
if (!fs.existsSync('./model/checkout.json')) fs.writeFileSync('./model/checkout.json', '[]', 'utf-8');

// Read checkout JSON file
var readModel = fs.readFileSync('./model/checkout.json', 'utf-8')
// Parse string to JSON
var checkoutData = JSON.parse(readModel);

// Show checkout JSON data
function showModel (user_id) {
    // Return the data based off user_id
    return checkoutData.filter((product) => product.user_id === user_id);
}

function getModel (user_id) {
    // Return the data based off user_id
    const filter = checkoutData.filter((product) => product.user_id === user_id).map(({user_id, ...product}) => product);
    // Branch to delete a contact from a specific name
    if (filter) {
        // Rewrite the file in JSON with what has been filtered
        return JSON.stringify(filter);
    }
}

// Add an object to JSON
function addModel (item) {
    if (checkoutData.find((product) => product.product_id === item.product_id)) {
        // Add the quantities
        checkoutData[0].quantity += item.quantity;
        // Write the file in JSON
        fs.writeFileSync('./model/checkout.json', JSON.stringify(checkoutData));
    } else {
        // Push the array to JSON
        checkoutData.push(item);
        // Write the file in JSON
        fs.writeFileSync('./model/checkout.json', JSON.stringify(checkoutData));
    }
}

function subModel (user_id, item) {
    // Branch to delete a contact from a specific name
    if (checkoutData.filter((product) => product.user_id === user_id)) {
        // Rewrite the file in JSON with what has been filtered
        if (checkoutData.find((product) => product.product_id === item.product_id)) {
            // Add the quantities
            checkoutData[0].quantity -= item.quantity;
            // Write the file in JSON
            fs.writeFileSync('./model/checkout.json', JSON.stringify(checkoutData));
        } else {
            
        }
    } else {

    }
}

// Delete model when a user become admin &&
// Delete model when a user buy everything
function deleteModel (user_id) {
    // Variable for branch and checking JSON file if a certain string to delete
    const del = checkoutData.filter((product) => product.user_id !== user_id);
    // Branch to delete a contact from a specific name
    if (del) {
        // Rewrite the file in JSON with what has been filtered
        fs.writeFileSync('./model/checkout.json', JSON.stringify(del));
    }
}

// Update an array from a specific name
// const updateJSON = (oName, name, email, telp) => {
//     // First validation to check the old name if empty
//     if (oName == '') console.log('Please insert a name to change...');
//     else {
//         // Variable select to find an object that will be updated
//         const select = arrayJSON.find((data) => data.name === oName);
//         if (select) {
//             // Write the data in JSON of branches
//             // Name empty
//             if (name === '') pushUpJSON(select.name, email, telp)
//             // Email empty
//             else if (email === '') pushUpJSON(name, select.email, telp)
//             // Mobile phone empty
//             else if (telp === '') pushUpJSON(name, email, select.telp)
//             // Email & Mobile phone empty
//             else if (email === '' && telp === '') pushUpJSON(name, select.email, select.telp)
//             // Name & Mobile phone empty
//             else if (name === '' && telp === '') pushUpJSON(select.name, email, select.telp)
//             // Name & Email empty
//             else if (name === '' && email === '') pushUpJSON(select.name, select.email, telp)
//             // All empty
//             else if (name === '' && email === '' && telp === '') pushUpJSON(select.name, select.email, select.telp)
//             // All full
//             else pushUpJSON(name, email, telp)
//             console.log('Data updated');
//         } else console.log('Old name is not in the data');
//     }
//     // Old Name validation 
//     if (!valid.isAlpha(oName) && oName === '') console.log('Format old name is wrong');
//     // Name validation
//     if (!valid.isAlpha(name, 'en-US') && oName === '') console.log('Format name is wrong');
//     // Email validation
//     if (!valid.isEmail(email) && oName === '') console.log('Format email is wrong');
//     // Mobile phone number validation
//     if (!valid.isMobilePhone(telp, 'id-ID') && oName === '') console.log('Format mobile number is wrong');
// }

module.exports = {
    showModel,
    getModel,
    addModel,
    deleteModel
}