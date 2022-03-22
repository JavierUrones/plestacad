const router = require("express").Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const secret = require("../../config/index");
const AuthenticationService = require("../../services/authService");
const ValidationError = require("../../config/errors/customErrors");

const authService = new AuthenticationService();

router.post("/signup", async (req, res) => {
  const userDto = req.body;
  try {
    const { token, userSave } = await authService.signUp(userDto);
    res.json({
      data: userSave,
      token: token,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { token, userLogged } = await authService.login(req.body);
    req.session.email = userLogged.email;
    req.session.id = userLogged.id;
    req.session.role = userLogged.role;
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

router.get("/logout", async (req, res) => {
  try {
    email = req.session.email;
    req.session.email = null;
    req.session.id = null;
    req.session.role = null;
    res.status(200).send({
      logout: email,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
