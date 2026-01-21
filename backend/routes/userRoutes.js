const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/userAuth");
const { getProfile, uploadAvatar } = require("../controllers/userController");

router.get("/profile", auth, getProfile);
router.post("/upload-avatar", auth, uploadAvatar);
const upload = require("../middleware/upload");

router.post("/register", upload.single("avatar"), registerUser);

module.exports = router;
