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
}


module.exports = UserService;
