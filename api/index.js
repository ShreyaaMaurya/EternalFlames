const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("../backend/config/db");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/admin", require("../backend/routes/adminRoutes"));
app.use("/api", require("../backend/routes/authRoutes"));
app.use("/api/products", require("../backend/routes/productRoutes"));
app.use("/api/cart", require("../backend/routes/cartRoutes"));
app.use("/api/message", require("../backend/routes/messageRoutes"));
app.use("/api/orders", require("../backend/routes/orderRoutes"));
app.use("/api/users", require("../backend/routes/userRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Vercel serverless handler
module.exports = app;
