//middleware to verify the token and attach the user to the request object

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).send({ message: "Access Denied. No token provided." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWTPRIVATEKEY);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(400).send({ message: "Invalid token." });
    }
};

module.exports = auth;
