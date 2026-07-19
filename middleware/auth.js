const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {

    const token = req.header("x-auth-token");

    console.log("========== AUTH ==========");
    console.log("Received Token:", token);
    console.log("JWT Secret:", process.env.JWT_SECRET);

    if (!token) {
        return res.status(401).json({
            msg: "No token, authorization denied"
        });
    }

    try {

        console.log("VERIFY SECRET:", process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded Token:", decoded);

        req.user = decoded.user;

        console.log("Received Token:", token);
        next();

    } catch (err) {

        console.log("JWT ERROR:", err.message);

        return res.status(401).json({
            msg: "Token is not valid"
        });

    }

};