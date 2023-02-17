// Import third-party module to use Nodemailer
const nodemailer = require('nodemailer');

// Nodemailer Config
function sendEmail (to, subject, message, cb) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'noneunother@gmail.com',
            pass: 'zibhgvlpsavsrzgw'
        }
    });

    const mailOptions = {
        from: 'noneunother@gmail.com',
        to: to,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return cb(error);
        }

        return cb(null);
    });
}

module.exports = sendEmail;