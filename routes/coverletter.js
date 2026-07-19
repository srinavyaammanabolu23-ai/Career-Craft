const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const CoverLetter = require("../models/CoverLetter");

// Save Cover Letter
router.post("/", auth, async (req, res) => {

    try {

        const coverLetter = await CoverLetter.findOneAndUpdate(

            { userId: req.user.id },

            {
                userId: req.user.id,
                coverLetterData: req.body
            },

            {
                upsert: true,
                new: true
            }

        );

        res.json(coverLetter);

    } catch (err) {

        console.error(err);

        res.status(500).send("Server Error");

    }

});

// Load Cover Letter
router.get("/", auth, async (req, res) => {

    console.log("========== GET COVER LETTER ==========");

    try {

        const coverLetter = await CoverLetter.findOne({

            userId: req.user.id

        });

        console.log("Cover Letter Found:", coverLetter);

        if (!coverLetter) {

            return res.status(404).json({

                msg: "Cover Letter not found"

            });

        }

        res.json(coverLetter);

    }

    catch (err) {

        console.error(err);

        res.status(500).send("Server Error");

    }

});

module.exports = router;