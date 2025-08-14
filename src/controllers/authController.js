// src/controllers/authController.js
const { PrismaClient } = require('../../generated/prisma'); // Adjust path based on your 'src' location
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); // Used for hashing passwords
const jwt = require('jsonwebtoken'); // Used for creating and verifying JWTs

// Controller function to handle admin user login
const loginUser = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  try {
    // 1. Check if an admin with the provided email exists
    let admin = await prisma.tbl_admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid Credentials (Email)' }); // Use generic messages for security
    }

    // ⭐ NEW: Check if the admin's status is 1 (active)
    if (admin.status !== 1) {
      // You can customize the message based on the status if needed
      return res.status(403).json({ msg: 'Your account is not active. Please contact support.' });
    }

    // 2. Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials (Password)' }); // Use generic messages for security
    }

    // 3. Generate a JWT token for the authenticated admin
    const payload = {
      admin: {
        id: admin.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token back
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during login');
  }
};

// Export the function to be used by the routes
module.exports = { loginUser };
