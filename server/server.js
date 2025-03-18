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
const addAgent = require("./routes/addAgent");
const agentList = require("./routes/getAgents");
const uploadContacts = require("./routes/uploadContacts");
const deleteAgent = require("./routes/deleteAgent");
const googleRoutes = require("./routes/google");

const { User } = require("./models/user"); 

const app = express();
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());


const corsOptions = {
  origin: "http://localhost:3000", // frontend domain
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
  next();
});

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;


// Connect to MongoDB
connection();



// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/addAgent", addAgent);
app.use("/api/getAgents", agentList);
app.use("/api/uploadContacts", uploadContacts);
app.use("/api/deleteAgent", deleteAgent);
app.use("/api/google", googleRoutes);

app.use((req, res, next) => {
        res.status(404).json({ message: "API route not found" });
      });
      
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
