/** Módulo que contiene el esquema de mongoose de las tareas.
 * @module models/Task
 */
/** Módulo mongoose */
const mongoose = require("mongoose");
/** Esquema de mongoose de las tareas */
const taskScheema = mongoose.Schema({
  /** Titulo de la tarea */
  title: {
    type: String,
    required: true,
  },
  /** Descripcion de la tarea */
  description: {
    type: String,
    required: false,
  },
  /** Fecha de inicio de la tarea */
  start: {
    type: Date,
    required: false,
  },
  /** Fecha de fin de la tarea */
  end: {
    type: Date,
    required: false,
  },
  /** Id del usuario al que se ha asignado la tarea */
  userAssignedId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  /** Id del apartado de clasificación en el que se encuentra la tarea clasificada */
  taskClassificatorId: { type: mongoose.Schema.Types.ObjectId, ref: "TaskClassificator", required: false },
  /** Id del trabajo académico al que pertenece la tarea */
  workId: { type: mongoose.Schema.Types.ObjectId, ref: "Work" }
});

module.exports = mongoose.model("Task", taskScheema);
