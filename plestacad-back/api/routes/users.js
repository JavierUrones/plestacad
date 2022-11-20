/** Router express que define las rutas relacionadas con la gestión de tareas de un trabajo académico.
 * @module routes/users
 * @requires express
 */
/**
 * Router express.
 * @type {object}
 * @const
 */
const router = require("express").Router();
/**
 * Servicio de los usuarios
 * @type {object}
 * @const
 */
const userService = require("../../services/userService");

/**
 * Error de validación
 * @type {object}
 * @const
 */
const ValidationError = require("../../config/errors/customErrors");

/**
 * Middleware para comprobar la autenticación de usuarios.
 * @type {object}
 * @const
 */
const auth = require("../middleware/authMiddleware");

/**
 * Módulo formidable.
 * @type {object}
 * @const
 */
const formidable = require("formidable");

/**
 * Token utils
 * @type {object}
 * @const
 */
const {getUserIdFromTokenRequest, checkIsAdmin} = require("../../utils/token")

/**
 * @name get/users
 * @function
 * @memberof module:routes/users
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/users", auth, async (req, res) => {
    try{
      const listUsers =   await userService.getAllUsers();
      
      res.json({
        data: listUsers
      })
    }
    catch(error){
      return res.status(500).json({ error: error.message });
    }
  }
  );

  /**
 * @name get/users/role/:workId
 * @function
 * @memberof module:routes/users
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/users/role/:workId", auth, async (req, res) => {
  try{
    var workId = req.params.workId;

    let listUsers;
    if(workId != "undefined"){
      listUsers =   await userService.getUsersForInvitationByRole(workId);

    } else{
      listUsers = await userService.getAllUsers();
    }
    res.json({
      data: listUsers
    })
  }
  catch(error){
    return res.status(500).json({ error: error.message });
  }
}
);

/**
 * @name get/users/email/:email
 * @function
 * @memberof module:routes/users
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/users/email/:email", auth, async (req, res) => {
  try{
    var email = req.params.email;
    const user =   await userService.getUserByEmail(email);
    res.json({
      data: user
    })
  }
  catch(error){
    return res.status(500).json({ error: error.message });
  }
}
);

/**
 * @name get/users/:id
 * @function
 * @memberof module:routes/users
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/users/:id", auth, async (req, res) => {
  try{
    const user =   await userService.getUserById(req.params.id);
    
    res.json({
      data: {
        user
      }
    })
  }catch(error){
    return res.status(500).json({ error: error.message });

  }
})

/**
 * @name put/users/updatePassword
 * @function
 * @memberof module:routes/users
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put("/users/updatePassword", auth, async (req, res) => {
  try{

    const userDto = { id: req.body.id, password: req.body.password, currentPassword: req.body.currentPassword}
    let reqUserId = getUserIdFromTokenRequest(req);
    if(reqUserId != userDto.id && !await checkIsAdmin(reqUserId)){
      return res.status(403).send("Access denied  ");

    }
    const user =   await userService.updatePassword(userDto)
    
    res.json({
      data: {
        user
      }
    })
  }catch(error){
    if(error instanceof ValidationError){
      return res.status(400).send(error.message);
    }
    return res.status(500).json({ error: error.message });

  }
})

/**
 * @name get/users/updateData
 * @function
 * @memberof module:routes/users
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put("/users/updateData", auth, async (req, res) => {
  try{

    const userDto = { id: req.body.id, name: req.body.name, surname: req.body.surname}
    let reqUserId = getUserIdFromTokenRequest(req);
    if(reqUserId != userDto.id && !await checkIsAdmin(reqUserId)){
      return res.status(403).send("Access denied");

    }
    if(userDto.name.trim().length == 0 && userDto.surname.trim().length == 0)
      return res.status(400).send("Name or surname not valid.");

    const user =   await userService.updateUserData(userDto)
    
    res.json({
      data: {
        user
      }
    })
  }catch(error){
      return res.status(500).json({ error: error.message });

  }
})

/**
 * @name get/users/fullname/:id
 * @function
 * @memberof module:routes/users
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/users/fullname/:id", auth, async (req, res) => {
    try{
      const user =   await userService.getUserById(req.params.id);
    
      res.json({
        data: {
          "fullname": user.name + " " + user.surname
        }
      })
    }
    catch(error){
      return res.status(500).json({ error: error.message });
    }
  }
  );


  router.get("/users/contacts/:id", auth, async (req, res) => {
    try{
      const userId = req.params.id;
      //Los contactos del usuario serán los usuarios con los que comparta trabajos académicos, tanto alumnos como profesores.
      const listContacts = await userService.getContactsByUserId(userId)
    
      res.json({
        data: listContacts
        
      })
    }
    catch(error){
      return res.status(500).json({ error: error.message });
    }
  }
  );

  /**
 * @name post/users/profile-photo
 * @function
 * @memberof module:routes/users
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
  router.post("/users/profile-photo", auth, async (req, res) => {

    try{
      var form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(400).json({
            message: "Error during file parse",
          });
        }
        const userId = fields.userId;

        const uploadDirectory = "userdata/profile-images/"+userId;
        const file = files.upload;
        const fileName = encodeURIComponent(
          file.originalFilename = userId + ".jpg"
        );
        var response  = userService.uploadProfilePhoto(uploadDirectory, file.filepath, uploadDirectory + "/" + fileName);
        res.json({
          data: response
          
        })
  
  
        
      });

      

    } catch(error){
      return res.status(500).json({ error: error.message });

    }
  });

/**
 * @name get/users/profile-photo/:userId
 * @function
 * @memberof module:routes/users
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
  router.get("/users/profile-photo/:userId", auth, async (req, res) => {
    try{
      const userId = req.params.userId;

      res.sendFile("userdata/profile-images/"+userId+"/"+userId+".jpg", {root: '.' } ,(err)=>{
        if (err){
          res.json({
            message: "no-photo"
          })
        } else{
        }
      })
    }
    catch(error){
      return res.status(500).json({ error: error.message });
    }
  }
  );




  module.exports = router;