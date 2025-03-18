//Desc:Route to get all agents of a user

const express = require("express");
const { User } = require("../models/user");

const router = express.Router();

// This will be accessible at /api/getAgents/:userId
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select("agents");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ agents: user.agents });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
