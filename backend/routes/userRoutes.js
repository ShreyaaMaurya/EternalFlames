// const express = require("express");
// const router = express.Router();
// const User = require("../models/user");
// const auth = require("../middleware/userAuth");
// const upload = require("../middleware/upload");
// const { getProfile, uploadAvatar, registerUser } = require("../controllers/userController");

// router.get("/profile", auth, getProfile);
// router.post("/upload-avatar", auth, uploadAvatar);
// router.post("/register", upload.single("avatar"), registerUser);

// module.exports = router;


const express = require("express");
const router = express.Router();
const auth = require("../middleware/userAuth");

const {
  registerUser,
  loginUser,
  getProfile,
  uploadAvatar,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getProfile);
router.post("/upload-avatar", auth, uploadAvatar);

module.exports = router;
