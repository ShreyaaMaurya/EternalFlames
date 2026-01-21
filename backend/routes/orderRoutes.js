const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getOrderById,
  getOrdersByUserId,
  cancelOrderByUser,
  deleteOrder
} = require("../controllers/orderController");

// Admin: Get all orders
router.get("/", require("../middleware/adminAuth"), getAllOrders);

// Create a new order
router.post("/", require("../middleware/userAuth"), createOrder);

// Get orders of a specific user
router.get("/user/:userId", require("../middleware/userAuth"), getOrdersByUserId);

// Get single order for user (own orders only)
router.get("/user/order/:id", require("../middleware/userAuth"), getOrderById);

// Get single order (Admin - any order)
router.get("/:id", require("../middleware/adminAuth"), getOrderById);

// Update order status (Admin)
router.put("/:id/status", require("../middleware/adminAuth"), updateOrderStatus);

// Cancel order (User)
router.put("/:id/cancel", require("../middleware/userAuth"), cancelOrderByUser);

// Delete order
router.delete("/:id", require("../middleware/adminAuth"), deleteOrder);

module.exports = router;
