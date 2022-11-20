/** Router express que define el middleware de la API.
 * @module middleware/authMiddleware
 * @requires express
 */
const routesMiddlewareAuth = require("express").Router();
/**
 * Módulo JWT (JSON Web Token)
 */
const jwt = require("jsonwebtoken");
/**
 * Módulo secret
 */
const secret = require("../../config/index");

/**
 * @name use/signup
 * @function
 * Comprueba que el token de las peticiones que llegan a las rutas de la API sea válido.
 * @memberof module:middleware/authMiddleware
 */
routesMiddlewareAuth.use((req, res, next) => {
  try {
      const token = req.header("access-token");
      if (!token) return res.status(403).send("Acceso denegado");
      const decoded = jwt.verify(token, secret.key);

      req.user = decoded;

      next();
  } catch (error) {
      res.status(400).send("Invalid token");
  }
});



module.exports = routesMiddlewareAuth;