/** Router express que define las rutas relacionadas con la autenticación de los usuarios.
 * @module routes/authentication
 * @requires express
 */

/**
 * Authentication service.
 * @type {object}
 * @const
 */

const authService = require("../../services/authService");

/**
 * Error de validación.
 * @type {object}
 * @const
 */
const ValidationError = require("../../config/errors/customErrors");


/**
 * Email util functions
 * @type {object}
 * @const
 */
const {sendEmailConfirmation, generateVerifyToken} = require("../../utils/email");


/**
 * Router express.
 * @type {object}
 * @const
 */
const router = require("express").Router();

/**
 * @name post/signup
 * @function
 * @memberof module:routes/authentication
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/signup", async (req, res) => {
  const userDto = req.body;
  try {
    let verifyToken = generateVerifyToken(); //se crea el token de verificación del usuario

    const response = await authService.signUp(userDto, verifyToken);

    //sendEmailConfirmation(userDto, verifyToken); //comentar en pruebas


    res.json({
      data: response
    });
    

  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

/**
 * @name post/login
 * @function
 * @memberof module:routes/authentication
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/login", async (req, res) => {
  try {
    const { token, userLogged } = await authService.login(req.body);
    req.session.email = userLogged.email;
    req.session.id = userLogged.id;

    //req.session.role = userLogged.role;
    //Se devuelve el token.

    res.status(200).send({
      token: token,
      user: userLogged
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
});

/**
 * @name get/logout
 * @function
 * @memberof module:routes/authentication
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/logout", async (req, res) => {
  try {
    email = req.session.email;
    req.session.email = null;
    req.session.id = null;
    //req.session.role = null;
    res.status(200).send({
      logout: email,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @name get/verify/:token
 * @function
 * @memberof module:routes/authentication
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/verify/:token", async (req, res) => {
  try {
    var token = req.params.token;
    await authService.verifyUser(token);
    res.redirect(process.env.URL_CLIENT+"/login");
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
