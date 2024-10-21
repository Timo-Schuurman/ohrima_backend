const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("./conn"); // MySQL connection

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Login user without asyncHandler
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "Please add all fields" });
    }

    try {
        // Check if user exists in MySQL
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (results.length > 0) {
                const user = results[0];

                // Compare entered password with hashed password
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    // If passwords match, generate a JWT and return user info
                    return res.json({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        token: generateToken(user.id), // Generate JWT token
                    });
                } else {
                    return res.status(400).json({ message: "Invalid credentials" });
                }
            } else {
                return res.status(400).json({ message: "Invalid credentials" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { loginUser };