const mongoose = require("mongoose");

const workScheema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  teachers: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  ],
  students: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  ],
  course: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ["tfg", "tfm", "tesis"]
  }
});

module.exports = mongoose.model("Work", workScheema);
