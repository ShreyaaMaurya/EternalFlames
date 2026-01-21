const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/db");

connectDB();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// API routes (MUST come BEFORE static files and catch-all)
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Static files (AFTER API routes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../my-project")));

// Catch-all for frontend (MUST be last)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../my-project/index.html"));
});

// 🔒 IMPORTANT: protect listen()
if (require.main === module) {
  const PORT = 4000;
  app.listen(PORT, () =>
    console.log(`Server running locally on http://localhost:${PORT}`)
  );
}

module.exports = app;
