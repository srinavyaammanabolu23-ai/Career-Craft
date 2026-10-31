
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");

require("dotenv").config();

const normalizeEmail = (email) => {
    return typeof email === "string"
        ? email.trim().toLowerCase()
        : "";
};

const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        { user: { id: userId } },
        process.env.JWT_SECRET,
        { expiresIn: "5h" }
    );
};

// ==========================================
// REGISTER NEW USER
// POST /api/auth/register
// ==========================================

router.post("/register", async (req, res) => {
    try {
        const name = typeof req.body?.name === "string"
            ? req.body.name.trim()
            : "";

        const email = normalizeEmail(req.body?.email);

        const password = typeof req.body?.password === "string"
            ? req.body.password
            : "";

        if (!name || !email || !password) {
            return res.status(400).json({
                msg: "Please provide your name, email and password."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                msg: "Password must contain at least 8 characters."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                msg: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            streakCount: 1,
            lastLoginDate: new Date()
        });

        await user.save();

        const token = generateToken(user.id);

        return res.status(201).json({
            token,
            streak: user.streakCount
        });

    } catch (err) {
        console.error("Registration error:", err.name);

        if (err.code === 11000) {
            return res.status(409).json({
                msg: "An account with this email already exists."
            });
        }

        return res.status(500).json({
            msg: "Registration failed. Please try again."
        });
    }
});

// ==========================================
// LOGIN EXISTING USER
// POST /api/auth/login
// ==========================================

router.post("/login", async (req, res) => {
    try {
        const email = normalizeEmail(req.body?.email);

        const password = typeof req.body?.password === "string"
            ? req.body.password
            : "";

        if (!email || !password) {
            return res.status(400).json({
                msg: "Email and password are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.warn("AUTH_LOGIN: User not found");

            return res.status(400).json({
                msg: "Invalid credentials."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            console.warn("AUTH_LOGIN: Password verification failed");

            return res.status(400).json({
                msg: "Invalid credentials."
            });
        }

        // Update login streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastLogin = user.lastLoginDate
            ? new Date(user.lastLoginDate)
            : null;

        if (!lastLogin || isNaN(lastLogin.getTime())) {
            user.streakCount = 1;
        } else {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastLogin < yesterday) {
                user.streakCount = 1;
            } else if (lastLogin < today) {
                user.streakCount =
                    (Number(user.streakCount) || 0) + 1;
            }
        }

        user.lastLoginDate = today;
        await user.save();

        const token = generateToken(user.id);

        return res.json({
            token,
            streak: user.streakCount
        });

    } catch (err) {
        console.error("Login error:", err.name);

        return res.status(500).json({
            msg: "Login failed. Please try again."
        });
    }
});

// ==========================================
// GET LOGGED-IN USER
// GET /api/auth
// ==========================================

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                msg: "User not found."
            });
        }

        return res.json(user);

    } catch (err) {
        console.error("Profile error:", err.name);

        return res.status(500).json({
            msg: "Unable to retrieve user profile."
        });
    }
});

module.exports = router;
