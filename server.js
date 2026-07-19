// =================================================================
//  CAREER CRAFT BACKEND - Main Server Entry Point
// =================================================================
console.log("THIS IS THE SERVER I AM EDITING");

require("dotenv").config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/path', require('./routes/careerPath'));
app.use('/api/skilltree', require('./routes/skillTree'));
console.log("Loading Resume Route...");
app.use("/api/resume", require("./routes/resume"));
console.log("Resume Route Loaded.");

console.log("Loading Cover Letter Route...");
app.use("/api/coverletter", require("./routes/coverletter"));
console.log("Cover Letter Route Loaded.");
app.use("/api/interview", require("./routes/interview"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/ai", require("./routes/ai"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});