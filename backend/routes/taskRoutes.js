const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getDashboardData,
  getUserDashboardData,
  getTaskById,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
} = require("../controllers/taskController");

router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/:id", protect, getTaskById); //Get task by id
router.get("/", protect, getTasks); // Get all task
router.post("/", protect, adminOnly, createTask); // Create a task(Admin only)
router.put("/:id", protect, updateTask); // Update task details
router.delete("/:id", protect, adminOnly, deleteTask); // Delete a task(Admin only)
router.put(":id/status", protect, updateTaskStatus); //Update task status
router.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist

module.exports = router;
