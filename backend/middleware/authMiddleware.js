// verifies the JWT for protected routes

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // get token from header
    const token = req.header('x-auth-token');

    // check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // attach user payload to the request obj
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};