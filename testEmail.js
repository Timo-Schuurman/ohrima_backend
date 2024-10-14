const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.BAND_EMAIL,         // Your email
        pass: process.env.BAND_EMAIL_PASS,     // Your email password or App Password
    },
});

const mailOptions = {
    from: process.env.BAND_EMAIL,             // Your email
    to: process.env.BAND_EMAIL,               // Send to yourself for testing
    subject: 'Test Email',
    text: 'This is a test email sent from Node.js!',
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.error('Error sending email:', err);
    } else {
        console.log('Email sent:', info.response);
    }
});
