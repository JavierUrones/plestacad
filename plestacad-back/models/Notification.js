const { boolean, string } = require("@hapi/joi");
const mongoose = require("mongoose");
const notificationScheema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  workId: { type: mongoose.Schema.Types.ObjectId, ref: "Work" },
  usersIdReceivers:[
    {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  ], //id de las personas que reciben la notificación.
  userIdResponsible: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //id del usuario que provoca la notificación.
  mainContent: {
    type: String //recurso relacionado con la notificacion
  },
});

module.exports = mongoose.model("Notification", notificationScheema);
