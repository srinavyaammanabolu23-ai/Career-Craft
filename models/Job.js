const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    jobs: [
        {
            title: String,
            company: String,
            location: String,
            salary: String,
            experience: String,
            skills: [String],
            url: String
        }
    ]

});

module.exports = mongoose.model("job", JobSchema);