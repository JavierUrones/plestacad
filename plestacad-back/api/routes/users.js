const router = require("express").Router();
const UserService = require("../../services/userService");

const userService = new UserService();

const ValidationError = require("../../config/errors/customErrors");
const auth = require("../middleware/authMiddleware");

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

router.get("/users/role/:role", auth, async (req, res) => {
  try{
    var role = req.params.role;
    const listUsers =   await userService.getUsersByRole(role);
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


  module.exports = router;