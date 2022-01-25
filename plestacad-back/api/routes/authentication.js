const router = require("express").Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const secret = require("../../config/index");
const AuthenticationService = require("../../services/authService");
const EmailRepeatError = require("../../config/errors/customErrors");
const ValidationError = require("../../config/errors/customErrors");

const authService = new AuthenticationService();
//Se definen los validadores del registro
const schemaRegister = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  surname: Joi.string().min(1).max(255).required(),
  email: Joi.string().min(6).max(1024).required().email(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("student", "admin", "teacher"),
});

router.post("/signup", async (req, res) => {

  const userDto = req.body;
  try {
    const  {token, userSave} = await authService.signUp(userDto)
    res.json({
      data: userSave,
      token: token,
    });
  } catch (error) {
    console.log(error)
    if (error instanceof EmailRepeatError){
        return res.status(400).json({error: error.message});
    } else if(error instanceof ValidationError){
      return res.status(400).json({error: error.message});
    } else{

    return res.status(500).json({error: error.message});
  }
  }
});


//Se definen los validadores del login.
const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(8).required(),
});

router.post("/login", async (req, res) => {
  try {
    // Se comprueban los validadores con los datos de la petición.
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "User not found" });

    //Se comprueba que el password sea la almacena en la base de datos.
    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!checkPassword)
      return res.status(400).json({ error: "Password invalid" });

    //Se genera el token asociado al usuario.
    var token = jwt.sign({ id: user.id }, secret.key, {
      expiresIn: 86400, // El token expira en 24 horas.
    });

    //Se devuelven los datos del usuario junto al token.
    res.status(200).send({
      id: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
