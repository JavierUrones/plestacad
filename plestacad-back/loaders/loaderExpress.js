/** Módulo que contiene la inicialización de express.
 * @module loaders/loaderExpress
 */

/** Módulo bodyParser */
const bodyParser = require("body-parser");
/** Módulo cors */
const cors = require("cors");
/** Módulo que contiene la configuración de la aplicación */
const config = require("../config/index");
/** Módulo swaggerUI */
const swaggerUI = require("swagger-ui-express");
/** Módulo swaggerDocs */
const swaggerDocs = require("../config/swagger.json");
/** Modulo session de express */
const session = require('express-session');


/**
 * Inicializa el framework express y la API.
 * @param {object} app - constante app de express.
 */
module.exports.initializeExpress = async (app) => {

    app.use(cors(config.configCORS.application.cors.server));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
    app.set("key", config.key);
    app.use(session({ secret: 'ssssssss', saveUninitialized: true, resave: true }));


};

