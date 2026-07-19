const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    interviewData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Interview", InterviewSchema);