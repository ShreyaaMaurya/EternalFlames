const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const verifyAdmin = require("../middleware/adminAuth");

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required" });
    }

    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    res.json({ success: true, message: "Message received successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// 📋 2️⃣  Get all messages
// NOTE: made public so admin pages served from filesystem can fetch messages.
router.get("/", async (req, res) => {
  console.log("route: GET /api/message hit, auth header:", req.headers.authorization);
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 20;

    const messages = await Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// 🗑️ 3️⃣  Delete a message by ID (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
