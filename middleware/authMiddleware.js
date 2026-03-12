const jwt = require("jsonwebtoken");
const User = require("../models/User");
const axios = require("axios");

exports.protect = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    // 🔥 Call Auth Server
    const response = await axios.post(
      "http://localhost:4000/verify-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.data.valid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Save user details returned by auth server
    req.user = response.data.user;

    next();

  } catch (error) {

    console.error("Auth verification failed:", error.message);

    return res.status(401).json({
      message: "Token verification failed"
    });

  }
};

exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.roles;
    console.log("User roles from token:", userRoles);

    const hasAccess = userRoles.some(roles =>
      allowedRoles.includes(roles)
    );

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied. Insufficient role."
      });
    }

    next();
  };
};