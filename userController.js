const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("./conn");

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please add all fields" });
        }

        // Check if user exists in MySQL
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            } else {
                // Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Insert the new user into MySQL with role_id = 1 (default role as 'user')
                const user = { name, email, password: hashedPassword, role_id: 1 }; // Default role_id = 1
                connection.query('INSERT INTO users SET ?', user, (err, result) => {
                    if (err) throw err;

                    // Generate token with the user's role (role_id = 1)
                    const token = generateToken(result.insertId, 1); // Role ID 1 corresponds to 'user'

                    res.status(201).json({
                        id: result.insertId, // MySQL returns inserted ID
                        name: user.name,
                        email: user.email,
                        role: 'user', // Automatically set to 'user'
                        token: token, // JWT token returned in the response
                    });
                });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { registerUser };

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const connection = require("./conn"); // Import your connection

// // Generate JWT
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// // Register user
// const registerUser = async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         if (!name || !email || !password) {
//             return res.status(400).json({ message: "Please add all fields" });
//         }

//         // Check if user exists in MySQL
//         connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//             if (err) throw err;

//             if (results.length > 0) {
//                 return res.status(400).json({ message: "User already exists" });
//             } else {
//                 // Hash the password
//                 const salt = await bcrypt.genSalt(10);
//                 const hashedPassword = await bcrypt.hash(password, salt);

//                 // Insert the new user into MySQL
//                 const user = { name, email, password: hashedPassword };
//                 connection.query('INSERT INTO users SET ?', user, (err, result) => {
//                     if (err) throw err;

//                     // Generate token
//                     const token = generateToken(result.insertId);

//                     res.status(201).json({
//                         id: result.insertId, // MySQL returns inserted ID
//                         name: user.name,
//                         email: user.email,
//                         token: token, // JWT token returned in the response
//                     });
//                 });
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// module.exports = { registerUser };

