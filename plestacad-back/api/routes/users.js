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


  module.exports = router;