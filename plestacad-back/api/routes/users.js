const router = require("express").Router();
const UserService = require("../../services/userService");

const userService = new UserService();

const ValidationError = require("../../config/errors/customErrors");

router.get("/users", async (req, res) => {
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

router.get("/users/role/:role", async (req, res) => {
  try{
    console.log("entra")
    var role = req.params.role;
    const listUsers =   await userService.getUsersByRole(role);
    console.log("TEACHERS", listUsers)
    res.json({
      data: listUsers
    })
  }
  catch(error){
    return res.status(500).json({ error: error.message });
  }
}
);



router.get("/users/fullname/:id", async (req, res) => {
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