
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {

    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({
            msg: "No token, authorization denied"
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured");

        return res.status(500).json({
            msg: "Authentication configuration error"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded.user || !decoded.user.id) {
            return res.status(401).json({
                msg: "Invalid authentication token"
            });
        }

        req.user = decoded.user;

        return next();

    } catch (err) {
        console.error("JWT verification failed:", err.name);

        return res.status(401).json({
            msg: "Token is not valid"
        });
    }
};
