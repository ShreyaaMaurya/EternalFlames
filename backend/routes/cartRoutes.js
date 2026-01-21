const express = require("express");
const router = express.Router();
const CartItem = require("../models/cart");
const Product = require("../models/product");
const userAuth = require("../middleware/userAuth");

router.post("/add", userAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id; // from auth middleware

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if item already in cart
    let cartItem = await CartItem.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ userId, productId, quantity });
    }

    res.json({ success: true, message: "Added to cart", cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", userAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await CartItem.find({ userId }).populate("productId");

    const cart = cartItems.map(item => ({
      id: item._id,
      product: item.productId,
      quantity: item.quantity,
      total: item.productId.price * item.quantity
    }));

    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

    res.json({ success: true, cart, totalAmount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be greater than 0" });
    }

    const cartItem = await CartItem.findOneAndUpdate(
      { _id: id, userId },
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.json({ success: true, message: "Cart updated", cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cartItem = await CartItem.findOneAndDelete({ _id: id, userId });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
