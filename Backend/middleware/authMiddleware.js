const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');
            return next();
        } catch (error) {
            console.error(`Auth Middleware Token Verification Error: ${error.message}`);
            // Don't error out, just fall through to guest mode
        }
    }

    // Guest Mode: Assign a persistent dummy user for guest activities
    // In a real app, you might want to create a 'Guest' user in the DB
    req.user = {
        _id: '000000000000000000000000', // Dummy ObjectId
        id: '000000000000000000000000',
        username: 'Guest',
        email: 'guest@example.com'
    };
    next();
};

module.exports = { protect };
