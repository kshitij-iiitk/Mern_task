const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Contact Schema
const contactSchema = new mongoose.Schema({
	firstName: { type: String, required: true }, 
	phoneNumber: { type: String, required: true },
	note: { type: String, required: true } 
    });

// Agent Schema
const agentSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, required: true },
	password: { type: String, required: true },
	contacts: [contactSchema] 
});

// User Schema
const userSchema = new mongoose.Schema({
	name: { type: String, required: true }, 
	email: { type: String, required: true, unique: true },
	password: { type: String },
	authSource: { 
		type: String, 
		enum: ["self", "google"], 
		default: "self" 
	},
	agents: [agentSchema]
});

// JWT Token
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
	  { _id: this._id, name: this.name }, 
	  process.env.JWT_SECRET,
	  { expiresIn: "1d" }
	);
	return token;
};


const User = mongoose.models.User || mongoose.model("User", userSchema);

// Validation
const validate = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().label("Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().label("Password"),
		authSource: Joi.string().valid("self", "google").label("Auth Source"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
