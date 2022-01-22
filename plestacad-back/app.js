const loaders = require("./loaders");
const express = require("express");
const authRoutes = require("./api/routes/authentication");

async function run() {
  const app = express();
  await loaders.initialize(app);
  app.get("/", (req, res) => {
    res.send("TEST");
  });
  app.use("/api", authRoutes);


  const PORT = process.env.PORT || 5200;
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}

run();
