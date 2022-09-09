const { boolean, string } = require("@hapi/joi");
const mongoose = require("mongoose");
const taskScheema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  start: {
    type: Date,
    required: false,
  },
  end: {
    type: Date,
    required: false,
  },
  userAssignedId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  taskClassificatorId: { type: mongoose.Schema.Types.ObjectId, ref: "TaskClassificator", required: false },
  workId: { type: mongoose.Schema.Types.ObjectId, ref: "Work" }
});

module.exports = mongoose.model("Task", taskScheema);
