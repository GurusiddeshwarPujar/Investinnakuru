// src/server.js

require('dotenv').config(); // Loads environment variables from .env
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Dynamic CORS: allows both local dev & production frontend
const allowedOrigins = [
    'http://localhost:3000',             // Local Next.js frontend
    'https://your-frontend.vercel.app'   // Production frontend (change to your real domain)
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Import authentication routes
const authRoutes = require('./routes/authRoutes');

// Mount authentication routes
// All routes defined in authRoutes.js will be prefixed with '/api/auth'
app.use('/api/auth', authRoutes);

// Basic route to confirm the server is running
app.get('/', (req, res) => {
    res.send('Admin Backend API is running!');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
