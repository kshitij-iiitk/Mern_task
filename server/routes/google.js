//Desc: Google OAuth2.0 login route

const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user"); // Import User model

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// This will be accessible at /api/google
router.post("/", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "No token provided" });

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Google Payload:", payload);

    const email = payload.email;
    const name = payload.name;
    const password = payload.sub; // Unique Google ID
    const authSource = "google";

    let user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, create a new user
      user = new User({
        name,
        email,
        password, // Store Google ID as password (optional, since not used)
        authSource,
        agents: [], // Empty array for now
      });

      await user.save();
      console.log("New Google User Created:", user);
    }

    // Generate JWT Token for login
    const userToken = jwt.sign(
      { _id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Google login successful", token: userToken, user });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(400).json({ message: "Invalid Google token" });
  }
});

module.exports = router;
