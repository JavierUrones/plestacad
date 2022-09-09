const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("../config/index");
const swaggerUI = require("swagger-ui-express");
const swaggerDocs = require("../config/swagger.json");
const session = require('express-session');


module.exports.initializeExpress = async (app) => {

    app.use(cors(config.configCORS.application.cors.server));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
    app.set("key", config.key);
    app.use(session({ secret: 'ssssssss', saveUninitialized: true, resave: true }));


};

