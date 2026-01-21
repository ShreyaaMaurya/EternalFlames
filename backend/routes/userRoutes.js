const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/userAuth");
const upload = require("../middleware/upload");
const { getProfile, uploadAvatar, registerUser } = require("../controllers/userController");

router.get("/profile", auth, getProfile);
router.post("/upload-avatar", auth, uploadAvatar);
router.post("/register", upload.single("avatar"), registerUser);

module.exports = router;
