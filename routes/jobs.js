const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Job = require("../models/Job");

// SAVE JOBS
router.post("/", auth, async (req, res) => {

    try {

        const { jobs } = req.body;

        const savedJobs = await Job.findOneAndUpdate(

            { userId: req.user.id },

            {
                userId: req.user.id,
                jobs
            },

            {
                upsert: true,
                new: true
            }

        );

        res.json(savedJobs);

    } catch (err) {

        console.error(err);

        res.status(500).send("Server Error");

    }

});

// GET JOBS

router.get("/", auth, async (req, res) => {

    try {

        const jobs = await Job.findOne({

            userId: req.user.id

        });

        if (!jobs) {

            return res.status(404).json([]);

        }

        res.json(jobs.jobs);

    }

    catch (err) {

        console.error(err);

        res.status(500).send("Server Error");

    }

});

module.exports = router;