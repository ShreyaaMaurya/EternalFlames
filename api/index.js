const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("../backend/config/db");

const app = express();

// Connect DB
try {
  connectDB();
} catch (err) {
  console.error("Failed to connect to database:", err.message);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Routes
app.use("/api/admin", require("../backend/routes/adminRoutes"));
app.use("/api", require("../backend/routes/authRoutes"));
app.use("/api/products", require("../backend/routes/productRoutes"));
app.use("/api/cart", require("../backend/routes/cartRoutes"));
app.use("/api/message", require("../backend/routes/messageRoutes"));
app.use("/api/orders", require("../backend/routes/orderRoutes"));
app.use("/api/users", require("../backend/routes/userRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found", message: "API endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message 
  });
});

// Vercel serverless handler
module.exports = app;
