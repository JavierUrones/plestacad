/** Servicio encargado de gestionar los usuarios.
 * @module services/userService
 */
/**
 * Modelo User
 */
const User = require("../models/User");
/**
 * Modelo Work
 */
const Work = require("../models/Work");
/**
 * Modelo WorkRequest
 */
const WorkRequest = require("../models/WorkRequest");
/**
 * ValidationError
 */
const ValidationError = require("../config/errors/customErrors");

/**
 * Módulo fs (file system)
 */
const fs = require("fs");

/**
 * Módulo brcrypt para encriptado y desencriptado de contraseñas
 */
const bcrypt = require("bcrypt");


/**
 * Devuelve la lista de todos los usuarios de la aplicación.
 * @returns Retorna la lista de todos los usuarios de la aplicación
 */
async function getAllUsers() {
  try {
    const listUsers = User.find({});
    return listUsers;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene un usuario a partir de su id.
 * @param {string} id - id del usuario
 * @returns El usuario correspondiente con el id
 */
async function getUserById(id) {
  try {
    const user = User.findById(id)
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene la lista de usuarios que pueden ser invitados al trabajo académico.
 * @param {string} workId - id del trabajo académico 
 * @returns Retorna la lista de usuarios invitables al trabajo académico
 */
async function getUsersForInvitationByRole(workId) {
  try {
    let listUsers = await User.find();

    
    for await (const user of listUsers) {
      //no deben pertenecer al trabajo academico ni tener invitaciones ya generadas.

      const requests = await WorkRequest.find({
        'userIdReceiver': user._id,
        'workId': workId
      });

      for await (const req of requests) {
        if (user._id.toString() == req.userIdReceiver.toString()) {

          listUsers = listUsers.filter(function (item) {
            return item._id.toString() != user._id.toString()
          }
          );
        }
      }

      const work = await Work.findById(workId);

      for await (const teacher of work.teachers) {

        if (teacher.toString() == user._id.toString()) {

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


/**
 * Obtiene un usuario a partir de su correo electrónico.
 * @param {string} email - correo electrónico del usuario.
 * @returns el usuario correspondiente al email indicado.
 */
async function getUserByEmail(email) {
  try {
    const user = User.find({
      email: email
    })
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * Devuelve la lista de contactos del usuario con el id especificado.
 * @param {string} id - id del usuario
 * @returns Retorna la lista de contactos del usuario
 */
async function getContactsByUserId(id) {
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



    return listOfUserContacts


  } catch (error) {
    console.error(error)
    throw error;
  }
}

/**
 * Permite actualizar la foto de perfil del usuario.
 * @param {string} pathDirectory - ruta raíz donde se almacenara la foto (por defecto "/userdata/profile-images/").
 * @param {*} pathFile - ruta de la foto subida por el usuario.
 * @param {*} filePath - ruta donde se almacenará la foto del usuario.
 */
function uploadProfilePhoto(pathDirectory, pathFile, filePath) {
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


/**
 * Actualiza la contraseña del usuario.
 * @param {User} userDto - datos del usuario a actualizar con la nueva contraseña.
 * @returns Retorna el usuario actualizado
 */
async function updatePassword(userDto) {
  try {
    //se comprueba el password actual introducido por el usuario.

    const currentUser = await User.findById(userDto.id)

    const checkPassword = await bcrypt.compare(
      userDto.currentPassword,
      currentUser.password
    );

    if (!checkPassword || userDto.password.length < 8) {

      throw new ValidationError("wrong-password");
    }
    else {

      const filter = { _id: userDto.id };
      //Se encripta el password
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(userDto.password, salt);
      const update = { password: password };


      let user = await User.findOneAndUpdate(filter, update);
      return user;
    }


  }
  catch (error) {
    throw error;
  }

}

/**
 * Actualiza los datos de un usuario.
 * @param {User} userDto - datos del usuario a actualizar.
 * @returns retorna el usuario actualizado
 */
async function updateUserData(userDto) {
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





module.exports = {getUsersForInvitationByRole, getUserById, getAllUsers, updateUserData, updatePassword, uploadProfilePhoto, getContactsByUserId, getUserByEmail,  };
