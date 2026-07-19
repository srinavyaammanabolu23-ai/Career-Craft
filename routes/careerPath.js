const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CareerPath = require('../models/CareerPath');

// @route   POST /api/path
router.post('/', auth, async (req, res) => {
    const { careerTitle, skillsHave, skillsNeed, milestones, interviewQuestions } = req.body;
    try {
        const pathData = { userId: req.user.id, careerTitle, skillsHave, skillsNeed, milestones, interviewQuestions };
        const careerPath = await CareerPath.findOneAndUpdate(
            { userId: req.user.id },
            { $set: pathData },
            { new: true, upsert: true }
        );
        res.json(careerPath);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/path
router.get('/', auth, async (req, res) => {
    try {
        const careerPath = await CareerPath.findOne({ userId: req.user.id });
        if (!careerPath) {
            return res.status(404).json({ msg: 'Career path not found.' });
        }
        res.json(careerPath);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;