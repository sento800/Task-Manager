const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

// User Management Routes

//PATH api/v1/users/
//GET get all user (admin)
router.get("/", protect, adminOnly, getAllUsers);

//PATH api/v1/users/:id;
//GET get user by id
router.get("/:id", protect, getUserById);

//PATH api/v1/users/:id
//DELETE delete all user (admin)
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
