const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assessment = require('../models/Assessment');

// @route   POST /api/assessment
router.post('/', auth, async (req, res) => {
    const { interests, skills, values } = req.body;
    try {
        const assessmentData = { userId: req.user.id, interests, skills, values };
        const assessment = await Assessment.findOneAndUpdate(
            { userId: req.user.id },
            { $set: assessmentData },
            { new: true, upsert: true }
        );
        res.json(assessment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/assessment
router.get('/', auth, async (req, res) => {
    try {
        const assessment = await Assessment.findOne({ userId: req.user.id });
        if (!assessment) {
            return res.status(404).json({ msg: 'Assessment not found.' });
        }
        res.json(assessment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;