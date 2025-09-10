const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc   Get all users (Admin only)
// @route  GET /api/v1/users/
// @access Private(Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc, // include all existing user data
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );
    console.log(users);
    res.json(userWithTaskCounts);
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
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc   Delete user (Admin only)
// @route  DELETE /api/v1/users/:id
// @access Private(Admin)
// const deleteUser = (req, res) => {
//   try {
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

module.exports = { getAllUsers, getUserById };
