const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController.js");
const upload = require("../middlewares/uploadMiddleware.js");

const router = express.Router();

// Auth Routes

// PATH /api/v1/auth/register
// POST register user
router.post("/register", registerUser);

// PATH /api/v1/auth/login
// POST login user
router.post("/login", loginUser);

// PATH /api/v1/auth/profile
// GET get user profile
router.get("/profile", protect, getUserProfile);

// PATH /api/v1/auth/profile
// PUT update user profile
router.put("/profile", protect, updateUserProfile);

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imgUrl = `${req.protocol}://${req.get("host")}/upload/${
    req.file.filename
  }`;
  res.status(200).json({ imgUrl });
});

module.exports = router;
