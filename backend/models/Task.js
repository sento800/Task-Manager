const mongoose = require("mongoose");

const ToDoSchema = new mongoose.Schema({
  text: { type: String, require: true },
  completed: { type: Boolean, default: false },
});

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: { type: Date, require: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attachments: [{ type: String }],
    todoChecklist: [ToDoSchema],
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
