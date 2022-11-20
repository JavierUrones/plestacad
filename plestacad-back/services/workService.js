/** Servicio encargado de gestionar los usuarios.
 * @module services/workService
 */
/**
 * Modelo Work
 */
const Work = require("../models/Work");
/**
 * Modelo WorkRequest
 */
const WorkRequest = require("../models/WorkRequest");

/**
 * Obtiene la lista de todos los trabajos académicos.
 * @returns Retorna la lista de todos los trabajos académicos
 */
async function getAllWorks() {
  try {
    const listWorks = Work.find({});
    return listWorks;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene un trabajo académico a partir de su id.
 * @param {string} id - id del trabajo académico 
 * @returns Retorna el trabajo académico asociado al id.
 */
async function getWorkById(id) {
  try {
    const workById = Work.findById(id)
    return workById;
  } catch (error) {
    throw error;
  }
}

/**
 * Crea un nuevo trabajo académico.
 * @param {Work} workDto - datos del trabajo académico
 * @returns Retorna el nuevo trabajo académico creado
 */
async function createWork(workDto) {
  const newWork = new Work({
    title: workDto.title,
    authorId: workDto.authorId,
    teachers: workDto.teachers,
    students: workDto.students,
    category: workDto.category,
    description: workDto.description,
    course: workDto.course
  });

  try {
    //Se guarda el nuevo trabajo.
    const workSave = await newWork.save();
    return workSave;
  } catch (error) {
    throw error;
  }
}

/**
 * Elimina un trabajo académico.
 * @param {string} id - id del trabajo académico a eliminar
 * @returns Retorna el trabajo académico eliminado
 */
async function deleteWork(id) {
  try {
    let work = await Work.deleteOne({ _id: id });
    return work;
  } catch (error) {
    throw error;
  }
}

/**
 * Actualiza un trabajo académico
 * @param {Work} workDto - datos del trabajo académico a actualizar.
 * @returns Retorna el trabajo académico actualizado
 */
async function updateWork(workDto) {
  try {
    const filter = { _id: workDto.id };
    const update = {
      title: workDto.title,
      authorId: workDto.authorId,
      teachers: workDto.teachers,
      students: workDto.students,
      category: workDto.category,
      description: workDto.description,
      course: workDto.course,
      classified: workDto.classified
    };

    let work = await Work.findOneAndUpdate(filter, update);

    return work;
  } catch (error) {
    throw error;
  }
}

/**
 * Elimina un solicitud de incorporación a un trabajo académico.
 * @param {string} id - id de la solicitud de incorporación a un trabajo académico.
 * @returns Retorna la solicitud de incoporación a dicho trabajo académico eliminada.
 */
async function deleteWorkRequest(id) {
  try {
    var workRequest = await WorkRequest.deleteOne({ _id: id })
    return workRequest;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene los trabajos académicos en los que un usuario participa como estudiante a partir de su id.
 * @param {string} id - id del trabajo académico
 * @returns Retorna la lista de trabajos académicos en los que el usuario participa como estudiante
 */
async function getWorksByStudentId(id) {
  try {
    const listWorks = await Work.find({
      'students': {
        $in: [
          mongoose.Types.ObjectId(id)
        ]
      }
    })
    return listWorks;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene los trabajos académicos en los que un usuario participa como profesor a partir de su id.
 * @param {string} id - id del trabajo académico
 * @returns Retorna la lista de trabajos académicos en los que el usuario participa como profesor
 */
async function getWorksByTeacherId(id) {
  try {
    const listWorks = await Work.find({
      'teachers': {
        $in: [
          mongoose.Types.ObjectId(id)
        ]
      }
    })
    return listWorks;
  } catch (error) {
    throw error;
  }
}


/**
 * Obtiene los trabajos académicos de una categoría en concreto en los que el usuario participa como estudiante.
 * @param {string} id - id del trabajo académico
 * @param {string} category - categoría del trabajo académico.
 * @returns Retorna la lista de trabajos académicos en los que el usuario participa como estudiante
 */
async function getWorksByStudentIdAndCategory(id, category) {
  try {


    const listWorks = await Work.find({
      'category': category,
      'students': {
        $in: [
          mongoose.Types.ObjectId(id)
        ]
      }
    })
    return listWorks;
  } catch (error) {
    throw error;
  }
}


/**
 * Obtiene los trabajos académicos de una categoría en concreto en los que el usuario participa como profesor.
 * @param {string} id - id del trabajo académico
 * @param {string} category - categoría del trabajo académico.
 * @returns Retorna la lista de trabajos académicos en los que el usuario participa como profesor
 */
async function getWorksByTeacherIdAndCategory(id, category) {
  try {

    const listWorks = await Work.find({
      'category': category,
      'teachers': {
        $in: [
          mongoose.Types.ObjectId(id)
        ]
      }
    })
    return listWorks;
  } catch (error) {
    throw error;
  }
}

/**
 * Genera una solicitud de incorporación a un trabajo académico para un usuario en concreto.
 * @param {string} idWork - id del trabajo académico
 * @param {string} userIdReceiver - id del usuario que recibe la solicitud de incorporación.
 * @param {string} userIdSender - id del usuario que envía la solicitud de incorporación.
 * @param {string} role - rol del usuario en el trabajo académico (profesor o estudiante)
 * @returns Retorna la solicitud de incorporación creada
 */
async function generateWorkRequest(idWork, userIdReceiver, userIdSender, role) {
  const newWorkRequest = new WorkRequest({
    workId: idWork,
    userIdReceiver: userIdReceiver,
    userIdSender: userIdSender,
    role: role,
    date: new Date()
  });

  try {
    //Se guarda el nuevo trabajo.
    const workRequestSave = await newWorkRequest.save();
    return workRequestSave;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene las solicitudes de incorporación a un trabajo académico de un usuario.
 * @param {string} id - id del usuario.
 * @returns Retorna la lista de solicitudes de incoporación del usuario
 */
async function getWorkRequestsByUserReceiverId(id) {
  try {

    const listRequests = await WorkRequest.find({
      'userIdReceiver': id
    })
    return listRequests;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene las solicitudes de incorporación a un trabajo académico existentes de un trabajo académico.
 * @param {string} id - id del trabajo académico
 * @returns Retorna la lista de solicitudes de incorporación que se han creado para el trabajo académico indicado
 */
async function getWorkRequestsByWorkId(id) {
  try {

    const listRequests = await WorkRequest.find({
      'workId': id
    })
    return listRequests;
  } catch (error) {
    throw error;
  }
}


/**
 * Elimina a un usuario de un trabajo académico.
 * @param {string} workId - id del trabajo académico.
 * @param {string} userId - id del usuario a borrar
 * @param {string} type - rol del usuario en el trabajo académico
 * @returns Retorna el trabajo académico actualizado
 */
async function deleteUserFromWork(workId, userId, type) {
  try {

    const work = await Work.findById(workId);
    if (type == "student") {
      work.students = work.students.filter((student) => student.toString() != userId.toString())
    }
    if (type == "teacher") {
      work.teachers = work.teachers.filter((teacher) => teacher.toString() != userId.toString())
    }

    work.save();
    return work;
  } catch (error) {
    throw error;
  }
}



module.exports = {updateWork, createWork, deleteWork, getWorkById, getAllWorks, getWorksByTeacherId, 
  getWorksByStudentIdAndCategory, deleteWorkRequest, getWorksByTeacherIdAndCategory, generateWorkRequest, 
  getWorkRequestsByUserReceiverId, getWorksByStudentId, getWorkRequestsByWorkId, deleteUserFromWork };
