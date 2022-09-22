const User = require("../models/User");
const Work = require("../models/Work");
const WorkRequest = require("../models/WorkRequest");

const fs = require("fs");
const bcrypt = require("bcrypt");

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

  async getUsersForInvitationByRole(workId) {
    try {
      let listUsers = await User.find();

      console.log(listUsers.length)
      for await (const user of listUsers) {
        //no deben pertenecer al trabajo academico ni tener invitaciones ya generadas.

        const requests = await WorkRequest.find({
          'userIdReceiver': user._id,
          'workId': workId
        });

        for await (const req of requests) {
          if (user._id.toString() == req.userIdReceiver.toString()) {
            console.log( "REQUEST", req, user)

            listUsers = listUsers.filter(function (item) {
              return item._id.toString() != user._id.toString()
            }
            );
          }
        }

        const work = await Work.findById(workId);

        for await (const teacher of work.teachers) {

          if (teacher.toString() == user._id.toString()) {
            console.log("Aca")
            console.log('teacher', teacher.toString(), user._id.toString())
            listUsers = listUsers.filter(function (item) {
              return item._id.toString() != user._id.toString()
            }
            );
          }

          for await (const student of work.students) {
            if (student.toString() == user._id.toString()) {
              listUsers = listUsers.filter(function (item) {
                return item._id.toString() != user._id.toString()
              }
              );
            }
          }

        }
      }





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
      for await (const work of worksOfUserAsStudent) {
        for await (const user of work.students)
          listOfContactsIds.push(user.toString());
      };
      for await (const work of worksOfUserAsTeacher) {
        for await (const user of work.students)
          listOfContactsIds.push(user.toString());
      };
      for await (const work of worksOfUserAsStudent) {
        for await (const user of work.teachers)
          listOfContactsIds.push(user.toString());
      };

      let contactsSetIds = [...new Set(listOfContactsIds)];

      let listOfUserContacts = [];

      for await (const contactId of contactsSetIds) {
        if (contactId != id)
          listOfUserContacts.push(await this.getUserById(contactId));
      }

      console.log("contactos", listOfUserContacts)


      return listOfUserContacts


    } catch (error) {
      console.error(error)
      throw error;
    }
  }

  uploadProfilePhoto(pathDirectory, pathFile, filePath) {
    try {
      if (!fs.existsSync(pathDirectory)) {
        fs.mkdirSync(pathDirectory);
        fs.renameSync(pathFile, filePath);
      } else {

        fs.renameSync(pathFile, filePath);

      }
    }
    catch (error) {
      throw error;
    }

  }



  async updatePassword(userDto) {
    try {
      const filter = { _id: userDto.id };
      //Se encripta el password
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(userDto.password, salt);
      const update = { password: password };


      let user = await User.findOneAndUpdate(filter, update);
      return user;
    }
    catch (error) {
      throw error;
    }

  }

  async updateUserData(userDto) {
    try {
      const filter = { _id: userDto.id };
      const update = { name: userDto.name, surname: userDto.surname };


      let user = await User.findOneAndUpdate(filter, update);
      return user;
    }
    catch (error) {
      throw error;
    }

  }




}





module.exports = UserService;
