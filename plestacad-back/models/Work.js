/** Módulo que contiene el esquema de mongoose de los trabajos académicos.
 * @module models/Work
 */
/** Módulo mongoose */
const mongoose = require("mongoose");
/** Esquema de mongoose de los trabajos académicos */
const workScheema = mongoose.Schema({
  /** Titulo del trabajo académico */
  title: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  /** Id del usuario creador del trabajo académico */
  authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  /** Lista de profesores del trabajo académico */
  teachers: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  ],
  /** Lista de estudiantes del trabajo académico */
  students: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  ],
  /** Curso del trabajo académico */
  course: { type: Number },
  /** Categoría del trabajo académico */
  category: {
    type: String,
    enum: ["tfg", "tfm", "tesis"]
  },
  /** Descripción del trabajo académico */
  description: { type: String, required: true},
  /** Determina si un trabajo académico se encuentra clasificado o no */
  classified: { type: Boolean, default: false}
});

module.exports = mongoose.model("Work", workScheema);
