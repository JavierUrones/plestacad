const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  surname: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  registry_date: {
    type: Date,
    default: Date.now,
  },
  biography: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "student",
    enum: ["student", "teacher", "admin"],
  },
});

module.exports = mongoose.model("User", userSchema);
