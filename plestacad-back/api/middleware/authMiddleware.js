const routesMiddlewareAuth = require("express").Router();
const jwt = require("jsonwebtoken");
const secret = require("../../config/index");


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


/*
routesMiddlewareAuth.use((req, res, next) => {
    const token = req.headers["access-token"];
  
    if (token) {
      jwt.verify(token, app.get("key"), (err, decoded) => {
        if (err) {
          return res.json({ message: "Token invalido" });
        } else {

          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.send({
        message: "No se ha incluido el token",
      });
    }
  });
*/


module.exports = routesMiddlewareAuth;