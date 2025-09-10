// @desc   Dashboard Data (admin only)
// @route  GET /api/v1/tasks/dashboard-data

const Task = require("../models/Task");

// @access private
const getDashboardData = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Dashboard Data (user-specific)
// @route  GET /api/v1/tasks/user-dashboard-data
// @access private
const getUserDashboardData = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get task by ID
// @route  GET /api/v1/tasks/:id
// @access private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) {
      res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get all tasks (admin: all, user: only assigned tasks)
// @route  GET /api/v1/tasks/
// @access private
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }
    // add completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedCount: completedCount };
      })
    );

    // status summary counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });

    console.log(status);
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Create a new task(admin only)
// @route  POST /api/v1/tasks/
// @access private (admin)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of user IDs" });
    }
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Update task details
// @route  PUT /api/v1/tasks/:id
// @access private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({
        message: "Task not found",
      });
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Update task checklist
// @route  GET /api/v1/tasks/:id/todo
// @access private
const updateTaskChecklist = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get user by id
// @route  GET /api/v1/users/:id
// @access public
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({
        message: "Task not found",
      });
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Get user by id
// @route  GET /api/v1/users/:id
// @access public
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({
        message: "Task not found",
      });
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of user IDs" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updateTask = await task.save();
    res.status(200).json({
      message: "Task updated successfully",
      updateTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
  getUserDashboardData,
  getTaskById,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
};
