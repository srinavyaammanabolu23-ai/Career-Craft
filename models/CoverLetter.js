const mongoose = require("mongoose");

const CoverLetterSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    coverLetterData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("CoverLetter", CoverLetterSchema);