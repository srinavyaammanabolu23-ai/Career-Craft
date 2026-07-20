const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/assessment", require("./routes/assessment"));
app.use("/api/path", require("./routes/careerPath"));
app.use("/api/skilltree", require("./routes/skillTree"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/coverletter", require("./routes/coverletter"));
app.use("/api/interview", require("./routes/interview"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/ai", require("./routes/ai"));

app.get("/", (req, res) => {
    res.send("Career Craft Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${PORT}`);
});