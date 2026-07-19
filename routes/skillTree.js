const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SkillTree = require('../models/SkillTree');

// @route   POST /api/skilltree
router.post('/', auth, async (req, res) => {
    const { treeData } = req.body;
    try {
        const skillTree = await SkillTree.findOneAndUpdate(
            { userId: req.user.id },
            { $set: { userId: req.user.id, treeData } },
            { new: true, upsert: true }
        );
        res.json(skillTree);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/skilltree
router.get('/', auth, async (req, res) => {
    try {
        const skillTree = await SkillTree.findOne({ userId: req.user.id });
        if (!skillTree) {
            return res.status(404).json({ msg: 'Skill tree not found.' });
        }
        res.json(skillTree);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;