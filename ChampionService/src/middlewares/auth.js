const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Authentication required",
            message: "You must be logged in to access this feature"
        });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: "Invalid authentication format",
            message: "Invalid authentication token format"
        });
    }

    try {
        const token = authHeader.slice('Bearer '.length);
        
        if (!token) {
            return res.status(401).json({
                error: "No token provided",
                message: "Authentication token is missing"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the decoded user info to the request object for potential future use
        req.user = decoded;
        
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: "Token expired",
                message: "Your session has expired. Please log in again"
            });
        }
        
        return res.status(401).json({
            error: "Invalid token",
            message: "Invalid or malformed authentication token"
        });
    }
};

module.exports = { authenticate };
