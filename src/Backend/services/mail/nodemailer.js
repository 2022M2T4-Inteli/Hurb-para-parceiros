// Importing all required libraries.
const nodemailer = require("nodemailer");

// Setting up the nodemailer transporter.
const transporter = nodemailer.createTransport({
    host: process.env._MAIL_HOST,
    port: process.env._MAIL_PORT,
    secure: process.env._MAIL_SECURE == 'TRUE' ? true : false,
    auth: {
        user: process.env._MAIL_USER,
        pass: process.env._MAIL_PASS,
    },
});

module.exports = transporter;