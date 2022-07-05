const loaders = require("./loaders");
const express = require("express");
const authRoutes = require("./api/routes/authentication");
const workRoutes = require("./api/routes/works");
const userRoutes = require("./api/routes/users");
const filesRoutes = require("./api/routes/files");
const postsRoutes = require("./api/routes/posts");

async function run() {
  const app = express();
  await loaders.initialize(app);
  app.get("/", (req, res) => {
    res.send(req.session.email);
  });
  app.use("/api", authRoutes);
  app.use("/api", workRoutes);
  app.use("/api", userRoutes);
  app.use("/api", filesRoutes);
  app.use("/api", postsRoutes);

  const PORT = process.env.PORT || 5200;
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}

run();
