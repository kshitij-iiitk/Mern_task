const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true }, 
	email: { type: String, required: true, unique: true },
	password: { type: String },
	authSource: { 
		type: String, 
		enum: ["self", "google"], 
		default: "self" 
	}
});


// Generate JWT Token
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
	  { _id: this._id, name: this.name }, 
	  process.env.JWT_SECRET,
	  { expiresIn: "7d" }
	);
	return token;
      };
      

const User = mongoose.model("user", userSchema);

// Validation Function
const validate = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().label("Password"),
		authSource: Joi.string().valid("self", "google").label("Auth Source"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
