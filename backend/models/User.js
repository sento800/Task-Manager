const mongoose = require("mongoose");

const UseSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    profileImageUrl: { type: String, default: null },
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UseSchema);
