const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interests: [{ type: String }],
    skills: [{ type: String }],
    values: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Assessment', AssessmentSchema);