const jwt = require("jsonwebtoken");
const connection = require("../conn");

// Middleware to protect routes and check for admin access
const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Add user data to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
    const { role } = req.user; // The role is added in the JWT payload in the login function
    
    if (role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();  // User is admin, proceed to the route
};

module.exports = { protect, admin };
