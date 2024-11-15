const db = require('../conn');
const { validationResult } = require('express-validator');

exports.updateAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, street, city, zip, country } = req.body;

  try {
    const result = await db.execute('SELECT * FROM addresses WHERE userId = ?', [userId]);

    const [rows] = result; 
    if (rows.length > 0) {
      await db.execute(
        `UPDATE addresses SET street = ?, city = ?, zip = ?, country = ? WHERE userId = ?`,
        [street, city, zip, country, userId]
      );
    } else {
      await db.execute(
        `INSERT INTO addresses (userId, street, city, zip, country) VALUES (?, ?, ?, ?, ?)`,
        [userId, street, city, zip, country]
      );
    }

    res.status(200).json({ message: 'Address updated successfully' });
  } catch (err) {
    console.error('Error updating address:', err); // Detailed error log
    res.status(500).json({ error: 'Server error, please try again' });
  }
};
