const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// REGISTER USER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, gender, address } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: "User already exists" });

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPass,
            gender,
            address,
            role: "user"
        });

        // create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            "secretkey",
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// LOGIN USER
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ success: false, message: "Invalid password" });

        // create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            "secretkey",
            { expiresIn: "30d" }
        );

        res.json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// REGISTER ADMIN (only once)
router.post('/register-admin', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User already exists" });

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPass,
            role: "admin"
        });

        res.json({ message: "Admin created successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LOGIN ADMIN
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid password" });

        // create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            "secretkey",
            { expiresIn: "7d" }
        );

        res.json({ message: "Login success", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
