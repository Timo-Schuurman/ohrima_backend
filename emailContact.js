require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const router = express.Router();

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

// POST endpoint to send email
router.post('/sendEmail', async (req, res) => {
    
    const { email, name, description } = req.body;

    try {
  
        const accessToken = await oauth2Client.getAccessToken();
        console.log('Access Token:', accessToken.token);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,  
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD, 
              }
        });
        
        console.error(transporter);

        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.BAND_EMAIL,
            subject: 'Contact from Ohrima website',
            text: `You have received a new message from ${name} (${email}):\n\n${description}`,
            replyTo: email
        };    

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send({ message: 'Failed to send email', error });

            } else {
                console.log('Email sent:', info);
                res.status(200).send({ message: 'Email sent successfully!', info });
            }
        });

     } catch (error) {
         console.error('Error sending email:', error);
         res.status(500).send({ message: 'Failed to send email', error });
    }
});



module.exports = router;
