/** Módulo que contiene el esquema de mongoose de los eventos del calendario.
 * @module models/CalendarEvent
 */
/**
 * Módulo mongoose
 */
const mongoose = require("mongoose");
/**
 * Esquema de mongoose de los eventos del calendario.
 */
const calendarEventScheema = mongoose.Schema({
  /** Titulo del evento */
  title: {
    type: String,
    required: true,
  },
  /** Descripcion del evento */
  description: {
    type: String,
    required: false,
  },
  /** Fecha de inicio del evento  */
  start: {
    type: Date,
    required: true,
  },
  /** Fecha de fin del evento */
  end: {
    type: Date,
    required: false,
  },
  /** Categorias del evento */
  tags: {
    type: [],
    required: false
  },
  /** Id de la tarea origen en caso de que sea un evento creado a partir de una tarea. */
  taskOriginId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  /** Id del trabajo académico */
  workId: { type: mongoose.Schema.Types.ObjectId, ref: "Work" }

});

module.exports = mongoose.model("CalendarEvent", calendarEventScheema);
