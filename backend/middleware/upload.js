const multer = require("multer");

// store files in memory (Vercel-safe)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit (optional but smart)
  }
});

module.exports = upload;
