// =================================================================
//  CAREER CRAFT BACKEND - Main Server Entry Point
// =================================================================
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

app.get('/', (req, res) => res.send('Career Craft API is running...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));