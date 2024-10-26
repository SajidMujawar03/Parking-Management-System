import jwt from "jsonwebtoken"

// Middleware to verify token
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Authorization' header

    if (!token) {
        return res.status(403).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Attach user info to request
        next(); // Continue to next middleware/route handler
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token." });
    }
};

// Middleware to restrict access based on roles
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Access denied. You do not have the right permissions." });
        }
        next(); // Continue to next middleware/route handler
    };
};