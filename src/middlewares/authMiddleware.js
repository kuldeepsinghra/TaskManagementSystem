const jwt = require("jsonwebtoken");
require("dotenv").config();

//middleware security using jwt token and verify the token
exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log('token for validation', token);
  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    //verify by token which is give as a signature or decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //whenever we are going to store the result then it would be through req.user
    req.user = decoded;
    console.log('req.user data after decode', req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.adminOnly = (req, res, next) => {
  //if someone want to call admin api and his role is not admin then give response in middleware as access denied
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
