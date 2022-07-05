const mongoose = require("mongoose");

const workScheema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  teachers: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  ],
  students: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  ],
  course: { type: Number },
  category: {
    type: String,
    enum: ["tfg", "tfm", "tesis"]
  },
  description: { type: String, required: true}
});

module.exports = mongoose.model("Work", workScheema);
