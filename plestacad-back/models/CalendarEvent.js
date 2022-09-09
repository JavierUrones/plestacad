const { boolean, string } = require("@hapi/joi");
const mongoose = require("mongoose");
const calendarEventScheema = mongoose.Schema({
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
    required: true,
  },
  end: {
    type: Date,
    required: false,
  },
  tags: {
    type: [],
    required: false
  },
  taskOriginId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  workId: { type: mongoose.Schema.Types.ObjectId, ref: "Work" }

});

module.exports = mongoose.model("CalendarEvent", calendarEventScheema);
