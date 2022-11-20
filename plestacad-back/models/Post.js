/** Módulo que contiene el esquema de mongoose de los temas del foro.
 * @module models/Post
 */
/** Módulo mongoose */
const mongoose = require("mongoose");
/** Esquema de mongoose de los temas del foro */
const postScheema = mongoose.Schema({
  /** Titulo de tema */
  title: {
    type: String,
    required: true,
  },
  /** Fecha de creación del tema */
  creationDate: {
    type: Date,
    required: true,
  },
  /** Indica si un tema está marcado como favorito o no */
  isFavorite: {
    type: Boolean,
    required: true,
  },
  /** Contenido del tema */
  message: {
    type: String,
    required: true,
  },
  /** Fecha del ultimo mensaje del tema */
  lastMessageDate: {
    type: Date,
  },
  /** Lista de los id de las respuestas del tema */
  interactions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "PostInteraction" },
  ],
  /** id del trabajo académico en el que se ha creado el tema*/
  workId: { type: mongoose.Schema.Types.ObjectId, ref: "Work" },
  /** id del usuario que ha creado el tema */
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Post", postScheema);
