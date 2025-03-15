const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

// Create user (Signup)
router.post("/", async (req, res) => {
	try {
		// If the user is registering via Google OAuth, skip password validation
		if (req.body.authSource === "google") {
			const { email, name } = req.body;

			let user = await User.findOne({ email });
			if (user)
				return res.status(200).send({ message: "User already exists", user });

			// Create a Google-authenticated user without a password
			user = new User({ email, name, authSource: "google" });
			await user.save();

			return res.status(201).send({ message: "Google user created successfully", user });
		}

		// For manual sign-up (email/password)
		const { error } = validate(req.body);
		if (error) return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res.status(409).send({ message: "User with given email already exists!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword, authSource: "self" }).save();
		res.status(201).send({ message: "User created successfully" });

	} catch (error) {
		res.status(500).send({ message: "Internal Server Error", error });
	}
});

// ✅ Correct `/me` route (instead of `/api/users/me`)
router.get("/me", async (req, res) => {
	try {
		res.json({ id: 1, name: "Johaedfa	n Doe", email: "john@example.com" });
	} catch (error) {
		res.status(500).json({ message: "Error fetching user", error });
	}
});

app.get("/api/users/me", (req, res) => {
	res.json({ id: 1, name: "John Doe", email: "john@example.com" });
    });
    

module.exports = router;
