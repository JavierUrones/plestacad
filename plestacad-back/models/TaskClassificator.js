/** Módulo que contiene el esquema de mongoose de los apartados de clasificación de tareas.
 * @module models/TaskClassificator
 */
/** Módulo mongoose */
const mongoose = require("mongoose");
/** Esquema de mongoose de los apartados de clasificación de tareas */
const taskClassificatorScheema = mongoose.Schema({
  /** Titulo del apartado de clasificación */
  title: {
    type: String,
    required: true,
  },
  /** Posición en la que se encuentra el apartado de clasificación en el tablero */
  order: {
    type: Number,
    required: true,
  },
  /** Id del trabajo académico al que pertenece el apartado de clasificación */
  workId: { type: mongoose.Schema.Types.ObjectId, ref: "Work" },
  /** Lista de tareas del apartado de clasificación */
  tasks: { type: []}
});

module.exports = mongoose.model("TaskClassificator", taskClassificatorScheema);
