const nodemailer = require('nodemailer');
const conn = require('./conn'); 
const router = express.Router();

// Configure nodemailer transport for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.BAND_EMAIL,
        pass: process.env.BAND_EMAIL_PASS
    }
});

// Route to handle contact form submissions
router.post('/sendEmail', (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required');
    }

    // Set up the email options
    const mailOptions = {
        from: email,
        to: process.env.BAND_EMAIL,
        subject: `New contact form submission from ${name}`,
        text: message
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).send('Error sending email');
        }

        // Save the email data to the database
        const sql = 'INSERT INTO contact_emails (name, email, message) VALUES (?, ?, ?)';
        conn.query(sql, [name, email, message], (dbErr) => {
            if (dbErr) {
                console.error('Database error:', dbErr);
                return res.status(500).send('Error saving email data');
            }

            res.status(200).send('Email sent and saved successfully');
        });
    });
});

module.exports = router;

