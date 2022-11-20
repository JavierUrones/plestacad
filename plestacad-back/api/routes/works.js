/** Router express que define las rutas relacionadas con la gestión de tareas de un trabajo académico.
 * @module routes/works
 * @requires express
 */
/**
 * Router express.
 * @type {object}
 * @const
 */
const router = require("express").Router();
/**
 * Servicio de los trabajos académicos.
 * @type {object}
 * @const
 */
const workService = require("../../services/workService");
/**
 * Servicio de los usuarios
 * @type {object}
 * @const
 */
const userService = require("../../services/userService");
/**
 * ValidationError
 * @type {object}
 * @const
 */
const ValidationError = require("../../config/errors/customErrors");
/**
 * Servicio de los archivos.
 * @type {object}
 * @const
 */
const fileService = require("../../services/fileService");
/**
 * Servicio de las tareas.
 * @type {object}
 * @const
 */
const taskService = require("../../services/taskService");
/**
 * Servicio del foro.
 * @type {object}
 * @const
 */
const postService = require("../../services/postService");

/**
 * Servicio del calendario
 * @type {object}
 * @const
 */
const calendarService = require("../../services/calendarService");
/**
 * Servicio de notificaciones.
 * @type {object}
 * @const
 */
const notificationService = require("../../services/notificationService");
/**
 * Ruta raíz del proyecto.
 * @type {string}
 * @const
 */
const rootProjectPath = require("path").resolve("./");
/**
 * Ruta donde se almacenan los archivos del proyecto.
 * @type {string}
 * @const
 */
const directoryFiles = "/userdata/";

/**
 * Middleware para comprobar la autenticación de usuarios.
 * @type {object}
 * @const
 */
const auth = require("../middleware/authMiddleware");

/**
 * Socket.io utils
 */
const { sendNewWorkRequestNotification } = require('../../utils/socket-io');

/**
 * Token utils
 */
const { getUserIdFromTokenRequest, checkIsAdmin } = require('../../utils/token');

/**
 * @name get/works
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/works", auth, async (req, res) => {
  try {
    const listWorks = await workService.getAllWorks();
    res.json({
      data: listWorks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name get/works/:id
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/works/:id", auth, async (req, res) => {
  try {
    id = req.params.id;
    const workById = await workService.getWorkById(id);
    res.json({
      data: workById,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name post/works
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/works", auth, async (req, res) => {
  const workDto = req.body;
  try {
    const studentsInvited = req.body.studentsInvited;
    const teachersInvited = req.body.teachersInvited;
    if (workDto.title.trim().length == 0 || workDto.description.trim().length == 0 || workDto.category.trim().length == 0 ||
      workDto.course < 0)
      throw new ValidationError("Datos introducidos inválidos");
    const workSave = await workService.createWork(workDto);

    await fileService.createDirectory(rootProjectPath + directoryFiles + workSave.id, workDto.authorId, true);
    await fileService.createDirectory(rootProjectPath + directoryFiles + workSave.id + "/" + workSave.title, workDto.authorId, true);

    //Se crean los apartados de clasificación de tareas iniciales.
    var taskClassificators = [{ title: "Nuevas", order: 0 }, { title: "En progreso", order: 1 }, { title: "Bloqueadas", order: 2 }, { title: "Terminadas", order: 3 },]
    await taskService.createTaskClassificator(taskClassificators[0], workSave.id, workDto.authorId, true)
    await taskService.createTaskClassificator(taskClassificators[1], workSave.id, workDto.authorId, true)
    await taskService.createTaskClassificator(taskClassificators[2], workSave.id, workDto.authorId, true)
    await taskService.createTaskClassificator(taskClassificators[3], workSave.id, workDto.authorId, true)


    //Se crean las solicitudes de incorporación al trabajo académico.

    for await (const student of studentsInvited) {

      var studentInvited = await userService.getUserByEmail(student);
      await workService.generateWorkRequest(workSave.id.toString(), studentInvited[0]._id.toString(), workDto.authorId, "student")
      sendNewWorkRequestNotification(studentInvited[0]._id.toString());

    };


    for await (const teacher of teachersInvited) {

      var teacherInvited = await userService.getUserByEmail(teacher);
      await workService.generateWorkRequest(workSave.id.toString(), teacherInvited[0]._id.toString(), workDto.authorId, "teacher")
      //Se envia mediante sockets la notificación al cliente de que se han creado nuevas solicitudes de incorporación.
      sendNewWorkRequestNotification(teacherInvited[0]._id.toString());
    };

    await
      res.status(200).send({
        data: workSave,
      });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    } else {

      return res.status(500).json({ error: error.message });
    }
  }
});

/**
 * @name post/worksByUser
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/worksByUser", auth, async (req, res) => {
  try {

    const userDto = req.body;
    var listWorks;
    var listWorksStudent = await workService.getWorksByStudentId(userDto.id);
    var listWorksTeacher = await workService.getWorksByTeacherId(userDto.id);
    listWorks = listWorksTeacher.concat(listWorksStudent);
    res.json({
      data: listWorks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name post/worksByUserIdAndCategory
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/worksByUserIdAndCategory", auth, async (req, res) => {
  try {
    const id = req.body.id;
    const category = req.body.category;
    var listWorks;
    listWorksTeacher = await workService.getWorksByTeacherIdAndCategory(id, category);
    listWorksStudent = await workService.getWorksByStudentIdAndCategory(id, category);
    listWorks = listWorksTeacher.concat(listWorksStudent)
    res.json({
      data: listWorks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name delete/works/:id
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.delete("/works/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

    let work = await workService.getWorkById(id);
    var reqUserId = getUserIdFromTokenRequest(req);
    if (reqUserId != work.authorId && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Acceso denegado");
    }
    fileService.deleteWorkDirectory(rootProjectPath + directoryFiles + id);

    let taskClassificators = await taskService.getTaskClassificatorsByWorkId(id);
    for await (let taskClassificator of taskClassificators) {
      await taskService.deleteTaskClassificator(taskClassificator._id, id, work.authorId, true)
    }

    let tasks = await taskService.getTasksByWorkId(id);
    for await (let task of tasks) {
      await taskService.deleteTask(task._id, id, work.authorId, true)
    }

    let events = await calendarService.getCalendarEventsByWorkId(id);

    for await (let event of events) {
      await calendarService.deleteCalendarEvent(event._id, work.authorId, true)
    }

    let posts = await postService.getPostsByWorkId(id);

    for await (let post of posts) {
      await postService.deletePost(post._id);
    }

    let notifications = await notificationService.getNotificationsByWorkId(id);

    for await (let notification of notifications) {
      await notificationService.deleteNotificationById(notification._id);
    }

    let workRequests = await workService.getWorkRequestsByWorkId(id);

    for await (let request of workRequests) {
      await workService.deleteWorkRequest(request._id)
    }

    let workDeleted = await workService.deleteWork(id);

    res.json({
      data: workDeleted
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


/**
 * @name post/workRequests
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/workRequests", auth, async (req, res) => {
  try {
    const id = req.body.workId;
    const userIdResponsible = req.body.userIdResponsible;
    const teachers = req.body.teachers;
    const students = req.body.students;
    for await (let student of students) {
      let studentInvited = await userService.getUserByEmail(student);
      await workService.generateWorkRequest(id.toString(), studentInvited[0]._id.toString(), userIdResponsible, "student")
      sendNewWorkRequestNotification(studentInvited[0]._id.toString());

    }
    for await (let teacher of teachers) {
      let teacherInvited = await userService.getUserByEmail(teacher);
      await workService.generateWorkRequest(id.toString(), teacherInvited[0]._id.toString(), userIdResponsible, "teacher")
      sendNewWorkRequestNotification(teacherInvited[0]._id.toString());

    }

    res.status(200).send({
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


/**
 * @name get/workRequestsByUserReceiverId/:id
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/workRequestsByUserReceiverId/:id", auth, async (req, res) => {
  try {
    const userReceiverId = req.params.id;
    let listRequests = await workService.getWorkRequestsByUserReceiverId(userReceiverId);
    res.json({
      data: listRequests,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/**
 * @name get/workRequestsWithInfoByUserReceiverId/:id
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/workRequestsWithInfoByUserReceiverId/:id", auth, async (req, res) => {
  try {
    const userReceiverId = req.params.id;
    let listRequests = await workService.getWorkRequestsByUserReceiverId(userReceiverId);

    let listRequestsWithInfo = [];
    for await (const request of listRequests) {
      var work = await workService.getWorkById(request.workId.toString());
      var user = await userService.getUserById(request.userIdSender.toString());
      listRequestsWithInfo.push({ _id: request._id, workId: request.workId, description: request.role, userIdSender: request.userIdSender, title: work.title, userIdReceiver: userReceiverId, userSenderFullname: user.name + " " + user.surname, date: request.date })

    };
    res.json({
      data: listRequestsWithInfo,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name post/worksByUserIdAndCategory
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/worksByUserIdAndCategory", auth, async (req, res) => {
  try {
    const id = req.body.id;
    const category = req.body.category;
    var listWorks;
    listWorksTeacher = await workService.getWorksByTeacherIdAndCategory(id, category);
    listWorksStudent = await workService.getWorksByStudentIdAndCategory(id, category);
    listWorks = listWorksTeacher.concat(listWorksStudent)
    res.json({
      data: listWorks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name post/workRequests/accept
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/worksRequests/accept", auth, async (req, res) => {
  try {
    const id = req.body.id;
    const role = req.body.role;
    const workId = req.body.workId;
    const userIdReceiver = req.body.userIdReceiver;
    let work = await workService.getWorkById(workId);


    switch (role) {
      case "student":
        work.students.push(userIdReceiver);
        break;
      case "teacher":
        work.teachers.push(userIdReceiver);
        break;
    }
    var updatedWork = await workService.updateWork(work);
    let result = await workService.deleteWorkRequest(id);

    sendNewWorkRequestNotification(userIdReceiver);


    res.status(200).send({
      data: result, updatedWork
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/**
 * @name delete/worksRequests/deny/:id/:userIdReceiver
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.delete("/worksRequests/deny/:id/:userIdReceiver", auth, async (req, res) => {
  try {
    id = req.params.id;
    userIdReceiver = req.params.userIdReceiver;

    let result = await workService.deleteWorkRequest(id);
    sendNewWorkRequestNotification(userIdReceiver);

    res.status(200).send({
      data: result,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/**
 * @name put/works/deleteUser
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put("/works/deleteUser", auth, async (req, res) => {
  try {
    var reqUserId = getUserIdFromTokenRequest(req);
    let work = await workService.getWorkById(req.body.workId);
    if (reqUserId != work.authorId && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Acceso denegado");
    }

    let workId = req.body.workId;
    let userId = req.body.userId;
    let type = req.body.type;

    let result = await workService.deleteUserFromWork(workId, userId, type);
    res.status(200).send({
      data: result,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

});

/**
 * @name put/works/leaveWork
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put("/works/leaveWork", auth, async (req, res) => {
  try {
    var reqUserId = getUserIdFromTokenRequest(req);
    let work = await workService.getWorkById(req.body.workId);
    let canLeave = false;
    for await (const user of work.teachers) {
      if(user.toString()==reqUserId){
        canLeave = true;
      }
    }
    for await (const user of work.students) {
      if(user.toString()==reqUserId){
        canLeave = true;
      }
    }
    if (!canLeave) {
      return res.status(403).send("Acceso denegado");
    }

    let workId = req.body.workId;
    let userId = req.body.userId;
    let type = req.body.type;

    let result = await workService.deleteUserFromWork(workId, userId, type);
    res.status(200).send({
      data: result,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

});



/**
 * @name put/works
 * @function
 * @memberof module:routes/works
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put("/works", auth, async (req, res) => {

  try {
    //check usuario propietario.
    var reqUserId = getUserIdFromTokenRequest(req);
    let work = await workService.getWorkById(req.body.workId);
    if (reqUserId != work.authorId && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Acceso denegado");
    }

    if (req.body.title != undefined && req.body.title.trim().length == 0 || req.body.description != undefined && req.body.description.trim().length == 0 || req.body.category != undefined && req.body.category.trim().length == 0 ||
      req.body.course < 0)
      return res.status(400).send("Datos especificados inválidos");


    work.category = req.body.category;
    work.course = req.body.course;
    work.title = req.body.title;
    work.description = req.body.description;
    work.classified = req.body.classified;
    let workUpdated = await workService.updateWork(work);
    res.status(200).send({
      data: workUpdated,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

});




module.exports = router;
