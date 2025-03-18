// Desc: Route to upload contacts and distribute them among agents

const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const { User } = require("../models/user");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// This will be accessible at /api/uploadContacts/:userId
router.post("/:userId", upload.single("file"), async (req, res) => {
    const { userId } = req.params;

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const contacts = xlsx.utils.sheet_to_json(sheet);

        // Validate required columns
        const requiredColumns = ["firstName", "phoneNumber", "note"];
        const fileColumns = Object.keys(contacts[0] || {});
        const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col));

        if (missingColumns.length > 0) {
            return res.status(400).json({ error: `Missing columns: ${missingColumns.join(", ")}` });
        }

        // Find user and get their agents
        const user = await User.findById(userId);
        if (!user || user.agents.length === 0) {
            return res.status(404).json({ error: "User not found or has no agents" });
        }

        // Distribute contacts among agents (Round Robin)
        let agentIndex = 0;
        const numAgents = user.agents.length;
        contacts.forEach(contact => {
            user.agents[agentIndex].contacts.push(contact);
            agentIndex = (agentIndex + 1) % numAgents; // Cycle through agents
        });

        await user.save();

        res.json({ message: "Contacts distributed successfully", agents: user.agents });
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
