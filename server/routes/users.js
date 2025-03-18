//Desc: Route for user registration and fetching user details

const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

// This will be accessible at /api/users
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

// This will be accessible at /api/users/me
router.get("/me", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		if (!user) return res.status(404).send({ message: "User not found" });

		res.status(200).json(user);
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


// This will be accessible at /api/users/:id
router.get("/:id", auth, async (req, res) => {
	try {
	  const user = await User.findById(req.params.id).select("name email authSource");
	  if (!user) return res.status(404).send({ message: "User not found" });
      
	  res.json(user);
	} catch (error) {
	  res.status(500).send({ message: "Internal Server Error" });
	}
      });
      

module.exports = router;
