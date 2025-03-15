require("dotenv").config();
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connection = require("./db"); // Database connection
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const { User } = require("./models/user"); // Import User model

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;

// Initialize Google OAuth Client
const client = new OAuth2Client();

// Connect to MongoDB
connection();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Google Authentication Route
app.post("/google-auth", async (req, res) => {
  const { credential, client_id } = req.body;

  try {
    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: client_id,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = new User({
        firstName: given_name,
        lastName: family_name,
        email,
        authSource: "google",
      });

      await user.save();
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set JWT Token as HTTP-only cookie
    res
    .status(200)
    .cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production (HTTPS)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
      .json({ message: "Authentication successful", user, token });

  } catch (err) {
    console.error("Error during Google Authentication:", err);
    res.status(400).json({ error: "Authentication failed", details: err });
  }
});

// ❌ REMOVE THIS ROUTE, since it's already handled in `routes/users.js`
// app.get("/api/users/me", (req, res) => {
//   res.json({ id: 1, name: "John Doe", email: "john@example.com" });
// });

// Start Server
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
