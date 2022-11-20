/** Módulo que contiene el esquema de mongoose de las respuestas a los temas.
 * @module models/PostInteraction
 */
/** Módulo mongoose */
const mongoose = require("mongoose");
/** Esquema de mongoose de las respuestas a los temas */
const postInteractionScheema = mongoose.Schema({
    /** Id del usuario que ha creado la respuesta */
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    /** Nombre completo del usuario que ha creado la respuesta */
    authorFullName: {
        type: String,
        required: false
    },
    /** Mensaje de la respuesta */
    message: {
        type: String,
        required: true
    },
    /** Fecha de la respuesta */
    date: {
        type: Date,
        required: true
    }

});

module.exports = mongoose.model("PostInteraction", postInteractionScheema);
