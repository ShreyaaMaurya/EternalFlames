const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

// -------------------- REGISTER --------------------
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ success: false, message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
        });

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
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// -------------------- LOGIN --------------------
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Invalid email or password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            "secretkey",
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// -------------------- GET PROFILE --------------------
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });

        const userData = user.toObject();
        if (userData.avatar) {
            userData.avatar = `http://localhost:4000/uploads/${userData.avatar}`;
        }

        res.json({
            success: true,
            user: userData
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// -------------------- UPDATE PROFILE --------------------
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, address } = req.body;

        // Using findByIdAndUpdate for atomic update and immediate return of new data
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name,
                    phone,
                    address,
                },
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// -------------------- UPLOAD AVATAR --------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

exports.uploadAvatar = [
    upload.single("avatar"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            user.avatar = req.file.filename;
            await user.save();

            res.json({
                success: true,
                message: "Avatar uploaded successfully",
                url: `http://localhost:4000/uploads/${req.file.filename}`
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
];