// 📁 backend/routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminAuth = require("../middleware/adminAuth");
const { addProduct, deleteProduct } = require("../controllers/productController");

// ✅ Admin registration (use once to create admin)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    res.json({ success: true, message: "Admin Registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, "secretkey", {
      expiresIn: "24h",
    });

    res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Protected admin product routes
router.post("/products", adminAuth, addProduct);
router.delete("/products/:id", adminAuth, deleteProduct);

module.exports = router;
