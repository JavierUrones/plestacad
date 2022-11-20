/** Módulo encargado de establecer funciones relacionadas con la validación del token y los usuarios.
 * @module utils/token
 */
/**
 * Módulo jwt para la gestión de los JSON Web Tokens.
 */
const jwt = require("jsonwebtoken");
/**
 * Módulo secret con datos de la configuración de la aplicación.
 */
const secret = require("../config/index");
/**
 * Modelo Work
 */
const Work = require("../models/Work");
/**
 * Modelo User
 */
 const User = require("../models/User");



/**
 * Verifica el token de acceso de las peticiones que llegan a la API.
 * @param req - petición realizada por un cliente a la API
 * @returns Retorna el token descodificado para poder interpretar su contenido
 */
function getUserIdFromTokenRequest(req){
    const token = req.header("access-token");

    const decoded = jwt.verify(token, secret.key);

    return decoded.id;

}


async function checkIsAdmin(id){
    let user = await User.findById(id);
    if(user.isAdmin) return true; else return false;
}
/**
 * Comprueba si el usuario especificado pertenece a un trabajo académico.
 * @param {string} workId - id del trabajo académico
 * @param {string} userId - id del usuario
 * @returns true - si el usuario pertenece al trabajo académico
 * @returns false - si el usuario no pertenece al trabajo académico
 */
async function checkUserInWork(workId, userId){
   let work =  await Work.findById(workId.toString());
   let response = false;
   await work.teachers.forEach(teacher => { 
    if(teacher.toString() == userId.toString()){
        response = true;
    }
   })
   await work.students.forEach(student => { 
    if(student.toString() == userId.toString()){
        response = true;
    }
   })
   return response;
}

/**
 * Comprueba si un usuario tiene rol de profesor en un trabajo académico.
 * @param {string} workId - id del trabajo académico
 * @param {string} userId - id del usuario a comprobar
 * @returns true - si el usuario tiene rol de profesor en el trabajo académico
 * @returns false - si el usuario no tiene rol de profesor en el trabajo académico
 */
async function checkIsTeacherInWork(workId, userId){
    let work =  await Work.findById(workId.toString());

   let response = false;
   await work.teachers.forEach(teacher => { 
    if(teacher.toString() == userId.toString()){
        response = true;
    }
   })
   return response;
}



module.exports.getUserIdFromTokenRequest = getUserIdFromTokenRequest;
module.exports.checkUserInWork = checkUserInWork;
module.exports.checkIsTeacherInWork = checkIsTeacherInWork;
module.exports.checkIsAdmin = checkIsAdmin;