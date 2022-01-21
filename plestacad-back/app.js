const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  config = require("./configs/config"),
  swaggerUI = require("swagger-ui-express"),
  cors = require('cors');
  swaggerDocs = require("./swagger.json");
const app = express();

const configCORS = {
  application: {
    cors: {
      server: [
        {
          origin: "*",
          credentials: true,
        },
      ],
    },
  },
};

app.use(cors(configCORS.application.cors.server));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.set("key", config.key);
mongoose.connect("mongodb://localhost/Api-Plestacad");
const databaseConnnection = mongoose.connection;
databaseConnnection.on("error", function (err) {
  console.log("connection error", err);
});
databaseConnnection.once("open", function () {
  console.log("Connection to DB successful");
});

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);
app.get("/", (req, res) => {
  res.send("TEST");
});

const routesMiddlewareAuth = express.Router();
routesMiddlewareAuth.use((req, res, next) => {
  const token = req.headers["access-token"];

  if (token) {
    jwt.verify(token, app.get("key"), (err, decoded) => {
      if (err) {
        return res.json({ message: "Invalid token" });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send({
      message: "No token provided",
    });
  }
});

app.get("/datos", routesMiddlewareAuth, (req, res) => {
  const datos = [
    { id: 1, nombre: "Asfo" },
    { id: 2, nombre: "Denisse" },
    { id: 3, nombre: "Carlos" },
  ];

  res.json(datos);
});

const PORT = process.env.PORT || 5200;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
