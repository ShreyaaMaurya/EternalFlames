const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const adminAuth = require("../middleware/adminAuth");

// ✅ Add new product (admin only)
router.post("/add", adminAuth, async (req, res) => {
  try {
    const { name, description, price, image, category, page } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ success: false, message: "Name, price, and image are required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      page: page || "products", // default to "products"
    });

    res.json({ success: true, message: `Product added to ${page || "products"} page`, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get all products (with working pagination)
router.get("/", async (req, res) => {
  try {
    // Convert skip & limit to numbers safely
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 4;
    const page = req.query.page;

    // Optional filter for page (if you use multiple product sections)
    const filter = page ? { page } : {};

    // Sorted by creation order so pagination works correctly
    const products = await Product.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    // Total count for reference
    const total = await Product.countDocuments(filter);

    res.json({ success: true, products, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
