/** Módulo principal de la aplicación que pone en marcha el funcionamiento de la misma.
 * @module app
 */
/** Módulo loaders */
const loaders = require("./loaders");
/** Módulo express */
const express = require("express");
/** Módulo con las rutas de autenticación */
const authRoutes = require("./api/routes/authentication");
/** Módulo con las rutas de trabajos académicos */
const workRoutes = require("./api/routes/works");
/** Módulo con las rutas de los usuarios */
const userRoutes = require("./api/routes/users");
/** Módulo con las rutas de los archivos */
const filesRoutes = require("./api/routes/files");
/** Módulo con las rutas de los temas del foro */
const postsRoutes = require("./api/routes/posts");
/** Módulo con las rutas del calendario */
const calendarRoutes = require("./api/routes/calendar");
/** Módulo con las rutas de las tareas */
const taskRoutes = require("./api/routes/task");
/** Módulo con las rutas de las notificaciones */
const notificationRoutes = require("./api/routes/notifications");

require('dotenv').config();
/** Servidor a inicializar */
let server;
/**
 * Esta función llama a los loaders y luego establece las rutas de la API a partir de los módulos de rutas.
 * También se encarag de llamar a la inicialización del servidor de los sockets.
 */
async function run() {
  const app = express();
  server = require('http').createServer(app);
  module.exports = server;

  await loaders.initialize(app);
  const { socketConnection } = require('./utils/socket-io');
  socketConnection(server);

  app.get("/", (req, res) => {

    res.send(req.session.email);
  });

  app.use("/api", authRoutes);
  app.use("/api", workRoutes);
  app.use("/api", userRoutes);
  app.use("/api", filesRoutes);
  app.use("/api", postsRoutes);
  app.use("/api", calendarRoutes);
  app.use("/api", taskRoutes);
  app.use("/api", notificationRoutes);

  const PORT = process.env.PORT || 5200;
  server.listen(PORT, () => { console.log("Listening on port", PORT) });

}

run();
