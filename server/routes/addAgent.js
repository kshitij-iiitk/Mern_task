// Desc: Route to add an agent to a user

const express = require("express");
const { User } = require("../models/user");

const router = express.Router();

// This will be accessible at /api/addAgent/:userId
router.post("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { name, email, phone, password, contacts } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const newAgent = { name, email, phone, password, contacts };
        user.agents.push(newAgent);
        await user.save();

        res.status(200).json({ message: "Agent added successfully", user });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;