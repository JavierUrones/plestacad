/** Módulo que contiene el esquema de mongoose de las solicitudes de incorporación.
 * @module models/WorkRequest
 */
/** Módulo mongoose */
const mongoose = require("mongoose");
/** Esquema de mongoose de las solicitudes de incorporación a trabajos académicos */
const workRequestScheema = mongoose.Schema({
    /** Rol del usuario que se va a incorporar al trabajo académico */
    role: {
        type: String,
        enum: ["student", "teacher"]
    },
    /** Fecha de creación de la solicitud */
    date: {
        type: Date
    },
    /** Id del usuario que envía la solicitud */
    userIdSender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    /** Id del usuario que recibe la solicitud */
    userIdReceiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    /** Id del trabajo académico relacionado con la solicitud */
    workId: { type: mongoose.Schema.Types.ObjectId, ref: 'Work' },
});

module.exports = mongoose.model("WorkRequest", workRequestScheema);
