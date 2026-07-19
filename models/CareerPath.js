const mongoose = require('mongoose');

const CareerPathSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    careerTitle: { type: String, required: true },
    skillsHave: [{ type: String }],
    skillsNeed: [{ type: String }],
    milestones: [{
        title: String,
        description: String,
        completed: { type: Boolean, default: false }
    }],
    interviewQuestions: [{
        question: String,
        answer: String,
    }],
}, { timestamps: true });

module.exports = mongoose.model('CareerPath', CareerPathSchema);