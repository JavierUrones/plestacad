const { boolean, string } = require("@hapi/joi");
const mongoose = require("mongoose");
const taskClassificatorScheema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  workId: { type: mongoose.Schema.Types.ObjectId, ref: "Work" },
  tasks: { type: []}
});

module.exports = mongoose.model("TaskClassificator", taskClassificatorScheema);
