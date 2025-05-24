import 'dotenv/config'; 

import express from 'express';
import cors from 'cors'; // For handling cross-origin requests
import mongoose from 'mongoose'; // For MongoDB connection

const app = express();
const PORT = process.env.PORT || 5000; 

// --- Middleware ---
// Enable CORS for all routes (important for frontend communication)
app.use(cors());
// Parse JSON request bodies (for when frontend sends data)
app.use(express.json());

// --- Connect to MongoDB ---
import connectDB from './config/db.js';
connectDB();

// --- Basic Routes ---


// A simple GET route to test if the server is running
app.get('/', (req, res) => {
    res.send('SuperMall Backend API is running!');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(`Access it at: http://localhost:${PORT}`);
});