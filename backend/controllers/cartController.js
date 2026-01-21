const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const userAuth = require("../middleware/userAuth");

// All cart routes require user authentication
router.use(userAuth);

// Add to cart
router.post("/add", cartController.addToCart);

// Get cart
router.get("/", cartController.getCart);

// Update cart item quantity
router.put("/:id", cartController.updateCartItem);

// Remove from cart
router.delete("/:id", cartController.removeFromCart);

module.exports = router;
