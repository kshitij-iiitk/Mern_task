// Desc: Route to delete an agent from a user's list of agents

const express = require("express");
const { User } = require("../models/user");

const router = express.Router();

// This will be accessible at /api/deleteAgent
router.delete("/:userId/:agentId", async (req, res) => {
  const { userId, agentId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.agents = user.agents.filter((agent) => agent._id.toString() !== agentId);
    await user.save();

    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
