const Role = require("../models/Role");

// CREATE Role
exports.createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET All Roles
exports.getRoles = async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
};

// UPDATE Role
exports.updateRole = async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(role);
};

// DELETE Role
exports.deleteRole = async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: "Role deleted" });
};