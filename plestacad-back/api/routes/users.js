const router = require("express").Router();
const UserService = require("../../services/userService");

const userService = new UserService();

const ValidationError = require("../../config/errors/customErrors");
const auth = require("../middleware/authMiddleware");

const formidable = require("formidable");


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

router.put("/users/updatePassword", auth, async (req, res) => {
  try{

    console.log("BODY", req.body)
    const userDto = { id: req.body.id, password: req.body.password, currentPassword: req.body.currentPassword}
    const user =   await userService.updatePassword(userDto)
    
    res.json({
      data: {
        user
      }
    })
  }catch(error){
    return res.status(500).json({ error: error.message });

  }
})

router.put("/users/updateData", auth, async (req, res) => {
  try{

    const userDto = { id: req.body.id, name: req.body.name, surname: req.body.surname}
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