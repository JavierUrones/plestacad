const express = require("express"),
    bodyParser = require('body-parser'),
    jwt = require("jsonwebtoken"),
    config = require("./configs/config"),
    swaggerUI = require("swagger-ui-express"),
    swaggerDocs = require('./swagger.json')
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.set("key", config.key)



app.get("/", (req, res) => {
    res.send("TEST")
});

app.post('/api/auth', (req, res) => {
    console.log("REQ", req.body)
    if (req.body.username === "demo@test.es" && req.body.password === "123456") {
        const payload = {
            check: true
        };
        const token = jwt.sign(payload, app.get('key'), {
            expiresIn: 1440
        });
        res.json({
            message: 'Succesful auth',
            token: token
        });
    } else {
        res.json({ message: "Invalid user or password" })
    }
})

const routesAuth = express.Router(); 
routesAuth.use((req, res, next) => {
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, app.get('key'), (err, decoded) => {      
        if (err) {
          return res.json({ message: 'Invalid token' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          message: 'No token provided' 
      });
    }
 });

 app.get('/datos', routesAuth, (req, res) => {
    const datos = [
     { id: 1, nombre: "Asfo" },
     { id: 2, nombre: "Denisse" },
     { id: 3, nombre: "Carlos" }
    ];
    
    res.json(datos);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})