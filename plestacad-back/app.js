const loaders = require("./loaders");
const express = require("express");
const authRoutes = require("./api/routes/authentication");
const workRoutes = require("./api/routes/works");
const userRoutes = require("./api/routes/users");
const filesRoutes = require("./api/routes/files");
const postsRoutes = require("./api/routes/posts");
const calendarRoutes = require("./api/routes/calendar");
const taskRoutes = require("./api/routes/task");
const notificationRoutes= require("./api/routes/notifications");

require('dotenv').config();
async function run() {
  const app = express();
  const server = require('http').createServer(app);

  
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
  /*app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });*/
  server.listen(PORT);

}

run();
