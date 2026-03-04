const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Add role (Admin only)
router.put(
  "/add-role",
  protect,
  authorize("Admin"),
  userController.addRoleToUser
);

// Get users (Admin & Manager)
router.get(
  "/",
  protect,
  authorize("Admin", "Manager"),
  userController.getUsers
);

// Create user (Admin only)
router.post(
  "/",
  protect,
  authorize("Admin"),
  userController.createUser
);

// Delete user (Admin only)
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  userController.deleteUser
);

module.exports = router;