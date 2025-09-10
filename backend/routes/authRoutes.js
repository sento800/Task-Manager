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
// POST register user
router.post("/register", registerUser);

// POST login user
router.post("/login", loginUser);

// GET get user profile
router.get("/profile", protect, getUserProfile);

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
