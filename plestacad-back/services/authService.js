const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const secret = require("../config/index");
const User = require("../models/User");
const ValidationError = require("../config/errors/customErrors")
const EmailRepeatError = require("../config/errors/customErrors")

//Se definen los validadores del registro
const schemaRegister = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    surname: Joi.string().min(1).max(255).required(),
    email: Joi.string().min(6).max(1024).required().email(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("student", "admin", "teacher"),
  });

class AuthenticationService {

   async signUp(userDto) {
    //Se validan los parámetros de la petición.
    const { error } = schemaRegister.validate(userDto);

    if (error) {
      throw new ValidationError(error.details[0].message );
      //return res.status(400).json({ error: error.details[0].message });
    }

    if (await User.findOne({ email: userDto.email })) {
      throw new EmailRepeatError('Email already used');
      //return res.status(400).json({ error: "Email already in use" });
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
      role: userDto.role,
    });

    try {
      //Se guarda el nuevo usuario
      const userSave = await newUser.save();

      const user = await User.findOne({ email: userDto.email });
      //Se genera el token asociado al usuario.
      var token = jwt.sign({ id: user.id }, secret.key, {
        expiresIn: 86400, // El token expira en 24 horas.
      });
      //Se genera el token asociado al usuario.
      var token = jwt.sign({ id: user.id }, secret.key, {
        expiresIn: 86400, // El token expira en 24 horas.
      });

      return {token: token, user: userSave};
    } catch (error) {
        throw error;
    }
  }
}
  
module.exports = AuthenticationService;
