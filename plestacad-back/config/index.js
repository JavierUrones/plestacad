/** Módulo encargado de establecer los parámetros de configuración de la aplicación
 * @module config/index
 */


/**
 * Constantes de configuración de la aplicación.
 */
module.exports = {
  key: process.env.TOKEN_SECRET || "mysecretkey",
  user_mongodb_compass: process.env.USER_MONGODB_COMPASS || "javier",
  password_mongodb_compass: process.env.PASSWORD_MONGODB_COMPASS || "1806"
};

/**
 * Configuración de las cabeceras CORS de la API.
 */
const configCORS = {
  application: {
    cors: {
      server: [
        {
          origin: "*",
          credentials: true,
          methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
          allowedHeaders: ['Content-Type', 'Authorization'],
          
        },
      ],
    },
  },
};

module.exports.configCORS = configCORS;
