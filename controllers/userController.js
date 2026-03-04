const User = require("../models/User");
const Role = require("../models/Role");
const crypto = require("crypto");

/* ----------------------------------
   SHA256 Hash Function
----------------------------------- */
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

exports.login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // 🔥 POPULATE ROLES HERE
    const user = await User.findOne({ emailId }).populate("roles");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const hashedPassword = hashPassword(password);

    if (hashedPassword !== user.password) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // 🔥 Extract role names
    const roleNames = user.roles.map(role => role.name);

    const token = jwt.sign(
      {
        id: user._id,
        roles: roleNames
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/* ----------------------------------
   CREATE User
----------------------------------- */
exports.createUser = async (req, res) => {
  try {
    const { username, mobileNo, emailId, password } = req.body;

    if (!username || !mobileNo || !emailId || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = hashPassword(password);

    const user = await User.create({
      username,
      mobileNo,
      emailId,
      password: hashedPassword,
      roles: [],
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* ----------------------------------
   GET All Users
----------------------------------- */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roles");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ----------------------------------
   UPDATE User
----------------------------------- */
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ----------------------------------
   DELETE User
----------------------------------- */
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ----------------------------------
   ADD Role to User
----------------------------------- */
exports.addRoleToUser = async (req, res) => {
  try {
    const { userId, roleName } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Prevent duplicate roles
    if (!user.roles.includes(role._id)) {
      user.roles.push(role._id);
      await user.save();
    }

    res.json({
      message: "Role added successfully",
      user,
    });

  } catch (error) {
    console.error("Error adding role:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ----------------------------------
   REMOVE Role from User
----------------------------------- */
exports.removeRoleFromUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.roles = user.roles.filter(
      (role) => role.toString() !== roleId
    );

    await user.save();

    res.json({
      message: "Role removed successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};