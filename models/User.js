const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
    streakCount: { type: Number, default: 0 },
    lastLoginDate: { type: Date },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);