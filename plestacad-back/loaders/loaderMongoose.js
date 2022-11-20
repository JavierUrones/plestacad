/** Módulo que contiene la inicialización de mongoose.
 * @module loaders/loaderMongoose
 */

/** Módulo de mongoose */
mongoose = require("mongoose")
/** Módulo de configuración de la aplicación */ 
config = require("../config/index");

/**
 * Establece conexión con la base de datos a partir de las constantes establecidas en el archivo de configuración.
 * @returns Retorna la conexión con la base de datos
 */
module.exports.initializeMongoose = async () => {
  var username = config.user_mongodb_compass;
  var pass = config.password_mongodb_compass;
  const conn = await mongoose.connect("mongodb+srv://" +  username +":" + pass +"@plestacad-cluster.6f4o3of.mongodb.net/?retryWrites=true&w=majority");
  //const conn = await mongoose.connect("mongodb://localhost:27017/test-database");
 
  return conn.connection;
};
