const User = require("../models/User");
const Work = require("../models/Work");

class UserService {


  async getAllUsers() {
    try {
      const listUsers = User.find({});
      return listUsers;
    } catch (error) {
      throw error;
    }
  }


  async getUserById(id) {
    try {
      const user = User.findById(id)
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsersByRole(role) {
    try {
      const listUsers = User.find({ role: role });
      return listUsers;
    } catch (error) {
      throw error;
    }
  }


  async getUserByEmail(email) {
    try {
      const user = User.find({
        email: email
      })
      return user;
    } catch (error) {
      throw error;
    }
  }


  async getContactsByUserId(id) {
    try {
      const worksOfUserAsTeacher = await Work.find({
        'teachers': {
          $in: [
            mongoose.Types.ObjectId(id)
          ]
        }
      });

      const worksOfUserAsStudent = await Work.find({
        'students': {
          $in: [
            mongoose.Types.ObjectId(id)
          ]
        }
      });

      var listOfContactsIds = [];
      for await (const work of worksOfUserAsTeacher) {
        for await (const user of work.teachers) 
        listOfContactsIds.push(user.toString());
      };
      for await (const work of worksOfUserAsTeacher) {
        for await (const user of work.students) 
        listOfContactsIds.push(user.toString());
      };
      for await (const work of worksOfUserAsStudent) {
        for await (const user of work.students) 
        listOfContactsIds.push(user.toString());
      };
      for await (const work of worksOfUserAsTeacher) {
        for await (const user of work.students) 
        listOfContactsIds.push(user.toString());
      };
      let contactsSetIds = [...new Set(listOfContactsIds)];

      let listOfUserContacts = [];
      for await(const contactId of contactsSetIds){
        if(contactId != id)
          listOfUserContacts.push(await this.getUserById(contactId));
      }

      return listOfUserContacts


    } catch (error) {
      console.error(error)
      throw error;
    }
  }

  
}



module.exports = UserService;
