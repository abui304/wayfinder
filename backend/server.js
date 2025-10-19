const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors({
    origin: "http://localhost:5173", // or whatever port your frontend uses
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/itinerary', require('./routes/itineraryRoutes'));

const PORT = process.env.PORT || 6969;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));