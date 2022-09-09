const User = require("../models/User");

class UserService {

    
  async getAllUsers() {
    try {
      const listUsers = User.find({});
      return listUsers;
    } catch (error) {
      throw error;
    }
  }


  async getUserById(id){
    try {
      const user = User.findById(id)
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsersByRole(role){
    try{
      const listUsers = User.find({ role: role });
      return listUsers;
    }catch (error) {
      throw error;
    }
  }


  async getUserByEmail(email){
    try {
      const user = User.find({
        email: email
      })
      return user;
    } catch (error) {
      throw error;
    }
  }
}


module.exports = UserService;
