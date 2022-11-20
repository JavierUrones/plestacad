/** Módulo que contiene el esquema de mongoose de los usuarios.
 * @module models/User
 */
/** Módulo mongoose */
const mongoose = require("mongoose");
/** Esquema de mongoose de los usuarios */
const userSchema = mongoose.Schema({
  /** Nombre del usuario */
  name: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  /** Apellido del usuario */
  surname: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  /** Correo electrónico del usuario */
  email: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  /** Contraseña del usuario */
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  /** Fecha de registro del usuario */
  registry_date: {
    type: Date,
    default: Date.now,
  },
  /** Biografía del usuario */
  biography: {
    type: String,
    required: false,
  },
  /** Determina si el usuario ha verificado su cuenta o no */
  verified: {
    type: Boolean,
    default: false
  },
  /** Cadena de verificación del usuario que se le envía por correo electrónico para poder verificar su cuenta */
  verifyToken: {
    type: String
  },
  /** Parametro que comprueba si el usuario es administrador */
  isAdmin:{
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);
