const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use environment variable for MongoDB URI
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/eternalflame";
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed");
    console.log(error);
    // Don't exit on Vercel - just log the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
