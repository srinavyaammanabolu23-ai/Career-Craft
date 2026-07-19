const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Interview = require("../models/Interview");

// ============================
// Save Interview
// ============================
router.post("/", auth, async (req, res) => {

    console.log("========== POST INTERVIEW ==========");
    console.log(req.body);


    try {

        const interview = await Interview.findOneAndUpdate(

            { userId: req.user.id },

            {
                userId: req.user.id,
                interviewData: req.body
            },

            {
                upsert: true,
                new: true
            }

        );

        res.json(interview);

    }

    catch (err) {

        console.error(err);

        res.status(500).send("Server Error");

    }

});

// ============================
// Load Interview
// ============================
// ============================
// Load Interview
// ============================
router.get("/", auth, async (req, res) => {

    console.log("========== GET INTERVIEW ==========");
    console.log("User:", req.user.id);

    try {

        const interview = await Interview.findOne({

            userId: req.user.id

        });

        if (!interview) {

            return res.status(404).json({

                msg: "Interview not found"

            });

        }

        console.log("Saved Interview:", interview);

        res.json(interview);

    }

    catch (err) {

        console.error(err);

        res.status(500).send("Server Error");

    }

});

module.exports = router;