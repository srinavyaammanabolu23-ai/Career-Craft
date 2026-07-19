const express = require("express");

console.log("Resume route file loaded");
const router = express.Router();

const auth = require("../middleware/auth");
const Resume = require("../models/Resume");

// Save Resume
router.post("/", auth, async (req, res) => {

    console.log("========== SAVE RESUME ==========");
    console.log("User ID:", req.user.id);
    console.log("Request Body:", req.body);

    try {

        const resume = await Resume.findOneAndUpdate(

            { userId: req.user.id },

            {
                userId: req.user.id,
                resumeData: req.body
            },

            {
                upsert: true,
                new: true
            }

        );

        res.json(resume);

    } catch (err) {

        console.error(err);

        res.status(500).send("Server Error");

    }

});

// Get Resume
router.get("/", auth, async (req, res) => {

    console.log("GET /api/resume called");
    console.log("User:", req.user.id);

    try {

        const resume = await Resume.findOne({
            userId: req.user.id
        });

        console.log("Resume Found:", resume);

        if (!resume) {
            return res.status(404).json({
                msg: "Resume not found"
            });
        }

        res.json(resume);

    } catch (err) {

        console.error(err);
        res.status(500).send("Server Error");

    }

});

module.exports = router;