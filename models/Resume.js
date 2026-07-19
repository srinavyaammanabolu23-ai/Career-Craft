const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    resumeData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Resume", ResumeSchema);