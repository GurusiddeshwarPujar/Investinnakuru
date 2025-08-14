// src/routes/authRoutes.js
const express = require('express');
const router = express.Router(); // Create an Express router instance

// Import the controller function for login from authController.js
const { loginUser } = require('../controllers/authController');

// Define a POST route for logging in an admin user
// This route will be accessible at /api/auth/login
router.post('/login', loginUser);

// Export the router so it can be used in your main server.js file
module.exports = router;