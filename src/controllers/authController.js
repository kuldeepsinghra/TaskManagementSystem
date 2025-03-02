const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config() 

// Securely Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    //by user id and user role we will idetify the user on the time of verification 
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Simple Email Validation
const isValidEmail = (email) => {
  return email.includes("@") && email.includes(".");
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    //Validation for parameter
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //Validation for email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    //Check already user present or not in database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Call the user model and save this data to mongodb
    const user = new User({ name, email, password, role });
    //Call the save hook of mongodb and generate hash password
    await user.save();
    //Genereated token send as a response so client can be store it
    res.status(201).json({ token: generateToken(user), user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate Email Format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find user in database 
    const user = await User.findOne({ email });
    //compare plain text password to hashpassword(present in user mongo model)
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Return JWT Token so client can be store it
    res.json({ token: generateToken(user), user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
