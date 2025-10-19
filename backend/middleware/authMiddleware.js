// verifies the JWT for protected routes

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // get token from header
    const token = req.header('Authorization');
    let actualToken;
    if (token && token.startsWith('Bearer ')) {
        actualToken = token.slice(7, token.length);
    } else {
        return res.status(401).json({ msg: 'No token or invalid format, authorization denied' });
    }

    // verify token
    try {
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded.user; // attach user payload to the request obj
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};