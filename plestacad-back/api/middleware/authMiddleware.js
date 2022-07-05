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

module.exports = routesMiddlewareAuth;