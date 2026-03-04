const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId }).populate("roles");

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        emailId: user.emailId,
        roles: user.roles.map(role => role.name) // important
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};