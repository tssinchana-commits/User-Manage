const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { protect, authorize } = require("../middleware/authMiddleware");


router.get(
  "/",
  protect,
  authorize("Admin", "Manager", "Representative"),
  customerController.getCustomerById
);
// Create Customer (Admin & Manager)
router.post(
  "/",
  protect,
  authorize("Admin", "Manager"),
  customerController.createCustomer
);

// Get Single Customer
router.get(
  "/:id",
  protect,
  authorize("Admin", "Manager", "Representative"),
  customerController.getCustomerById
);

// Update Customer
router.put(
  "/:id",
  protect,
  authorize("Admin", "Manager"),
  customerController.updateCustomer
);

// Delete Customer
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  customerController.deleteCustomer
);

module.exports = router;