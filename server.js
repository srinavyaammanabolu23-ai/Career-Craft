require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Backend Works!");
});

app.get("/test", (req, res) => {
    res.json({ success: true });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on ${PORT}`);
});