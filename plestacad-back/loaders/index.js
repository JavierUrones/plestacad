/** Módulo que solicita la inicialización de los recursos.
 * @module loaders/loaderMongoose
 */

/** Módulo loader de mongoose */
const mongooseLoader = require("./loaderMongoose");
/** Módulo loader de express */
const expressLoader = require("./loaderExpress");


/** Inicializa los recursos especificados en los loaders. */
module.exports.initialize = async (app, server) =>  {
  await mongooseLoader.initializeMongoose();
  console.log('MongoDB Initialized');

  await expressLoader.initializeExpress(app);
  console.log('Express Initialized');

};

