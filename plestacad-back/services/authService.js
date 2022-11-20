/** Servicio encargado de gestionar la autenticación de los usuarios..
 * @module services/authService
 */


/**
 * Libreria bcrypt.
 * @type {object}
 * @const
 */
const bcrypt = require("bcrypt");

/**
 * Libreria JSON Web Token.
 * @type {object}
 * @const
 */

const jwt = require("jsonwebtoken");

/**
 * Libreria Joi.
 * @type {object}
 * @const
 */
const Joi = require("@hapi/joi");

/**
 * Valor de secret.
 * @type {object}
 * @const
 */
const secret = require("../config/index");

/**
 * Modelo User.
 * @type {object}
 * @const
 */
const User = require("../models/User");

/**
 * Error de validación.
 * @type {object}
 * @const
 */
const ValidationError = require("../config/errors/customErrors");

/**
 * Validadores de esquema de registro.
 * @type {object}
 * @const
 */
const schemaRegister = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  surname: Joi.string().min(1).max(255).required(),
  email: Joi.string().min(6).max(1024).required().email(),
  password: Joi.string().min(8).required()
});

/**
 * Validadores de esquema de inicio de sesión.
 * @type {object}
 * @const
 */
const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(8).required(),
});


/**
 * Registra a un usuario.
 * @param {string} userDto - datos del usuario a registrar.
 * @param {string} verifyToken - cadena de verificación única para la validación del usuario.
 * @returns {User} Retorna el nuevo usuario.
 */
async function signUp(userDto, verifyToken) {
  //Se validan los parámetros de la petición.
  const { error } = schemaRegister.validate(userDto);

  if (error) {
    throw new ValidationError(error.details[0].message);
    //return res.status(400).json({ error: error.details[0].message });
  }

  if (await User.findOne({ email: userDto.email })) {
    throw new ValidationError('Email used in another account.');
  }

  //Se encripta el password
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash(userDto.password, salt);


  //Se crea nuevo usuario
  const newUser = new User({
    name: userDto.name,
    surname: userDto.surname,
    email: userDto.email,
    password: password,
    verified: false,
    verifyToken: verifyToken
  });

  try {
    //Se guarda el nuevo usuario como no verificado.
    const userSave = await newUser.save();

    return { data: userSave };
  } catch (error) {
    throw error;
  }
}

/**
 * Inicia sesión con un usuario.
 * @param {string} userDto - datos del usuario que inicia sesión.
 * @returns retorna el JWT del usuario y sus datos
 */
async function login(userDto) {
  try {
    // Se comprueban los validadores con los datos de la petición.
    const { error } = schemaLogin.validate(userDto);

    if (error) throw new ValidationError(error.details[0].message);
    const user = await User.findOne({ email: userDto.email });
    if (!user) throw new ValidationError("not-found");

    //Se comprueba que el password sea la almacena en la base de datos.
    const checkPassword = await bcrypt.compare(
      userDto.password,
      user.password
    );
    if (!checkPassword) throw new ValidationError("wrong-password");

    //Comprobar que el usuario haya verificado su cuenta.
    if (!user.verified) throw new ValidationError("not-verified");
    //Se genera el token asociado al usuario.
    var token = jwt.sign({ id: user.id }, secret.key, {
      expiresIn: "300d", // El token expira en 300 días.
    });

    return { token: token, userLogged: user };
  } catch (error) {
    throw error;
  }
}

/**
 * Valida a un usuario.
 * @param {string} token - token de verificación del usuario.
 */
async function verifyUser(token) {
  try {
    //comprobar el usuario que tiene el token y validarlo.
    const user = await User.findOne({ verifyToken: token });
    if (!user.verified) {
      user.verified = true;
      user.save();
    } else {
      throw new ValidationError("not-found")
    }
  } catch (error) {
    throw error;
  }
}


module.exports = { signUp, verifyUser, login };
