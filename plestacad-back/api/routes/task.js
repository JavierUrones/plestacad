/** Router express que define las rutas relacionadas con la gestión de tareas de un trabajo académico.
 * @module routes/task
 * @requires express
 */
/**
 * Router express.
 * @type {object}
 * @const
 */
const router = require("express").Router();

/**
 * Servicio de tareas.
 * @type {object}
 * @const
 */
const taskService = require("../../services/taskService");

/**
 * Servicio del calendario.
 * @type {object}
 * @const
 */
const calendarService = require("../../services/calendarService");

/**
 * Middleware para comprobar la autenticación de usuarios.
 * @type {object}
 * @const
 */
const auth = require("../middleware/authMiddleware");

/**
 * Token utils
 * @type {object}
 * @const
 */
const { getUserIdFromTokenRequest, checkUserInWork, checkIsAdmin } = require("../../utils/token")

/**
 * @name get/taskclassificator/:id
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/taskclassificator/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    const taskclassificator = await taskService.getTaskClassificatorById(id);
    res.json({
      data: taskclassificator,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

);

/**
 * @name get/taskclassificator/:id
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/task/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    const task = await taskService.getTaskById(id);
    res.json({
      data: task,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

);

/**
 * @name get/tasks/work/:id
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/tasks/work/:id", auth, async (req, res) => {
  try {
    let idWork = req.params.id;
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(idWork.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    const tasks = await taskService.getTasksByWorkId(idWork);
    res.json({
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

);

/**
 * @name get/taskclassificators/work/:id
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/taskclassificators/work/:id", auth, async (req, res) => {
  try {
    let idWork = req.params.id;
    const taskClassificators = await taskService.getTaskClassificatorsByWorkId(idWork);
    for (var i = 0; i < taskClassificators.length; i += 1) {
      taskClassificators[i].tasks = await taskService.getTasksByTaskClassificator(taskClassificators[i]._id);
    }
    res.json({
      data: taskClassificators
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

);

/**
 * @name post/taskclassificator/:id
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/taskclassificator/:id", auth, async (req, res) => {
  const idWork = req.params.id;
  const taskClassificatorDto = req.body;
  const userIdResponsible = req.body.userIdResponsible;
  try {
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(idWork.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    if (taskClassificatorDto.title.trim().length == 0)
      return res.status(400).send("Title not valid");
    taskClassificatorDto.order = (await taskService.getTaskClassificatorsByWorkId(idWork)).length;
    const taskClassificatorSave = await taskService.createTaskClassificator(taskClassificatorDto, idWork, userIdResponsible, false);
    res.status(200).send({
      data: taskClassificatorSave,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name delete/taskclassificator/:idWork/:id/:userIdResponsible
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.delete("/taskclassificator/:idWork/:id/:userIdResponsible", auth, async (req, res) => {
  const id = req.params.id;
  const idWork = req.params.idWork;
  const userIdResponsible = req.params.userIdResponsible;
  try {
    //Se reordenan el resto de clasificadores
    const taskClassificators = await taskService.updateTasksClassificatorsOrders(idWork, id);

    const taskClassificatorDeleted = await taskService.deleteTaskClassificator(id, idWork, userIdResponsible, false);

    res.status(200).send({
      data: taskClassificatorDeleted,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name delete/task/:id/:userIdResponsible
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.delete("/task/:id/:userIdResponsible", auth, async (req, res) => {
  const id = req.params.id;
  const userIdResponsible = req.params.userIdResponsible;

  try {

    const taskToDelete = await taskService.getTaskById(id);
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(taskToDelete.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    const taskDeleted = await taskService.deleteTask(id, taskToDelete.workId, userIdResponsible, false);


    if (taskToDelete.start != undefined && taskToDelete.end != undefined) { //esto significa que tiene un evento creado asociado.
      const calendarEventToDelete = await calendarService.getCalendarEventByTaskOriginId(taskToDelete._id);

      const calendarEventDeleted = await calendarService.deleteCalendarEvent(calendarEventToDelete._id, userIdResponsible, false);
    }

    res.status(200).send({
      data: taskDeleted,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


/**
 * @name put/taskclassificator
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put("/taskclassificator", auth, async (req, res) => {

  try {
    const idTaskClassificator = req.body._id;
    const title = req.body.title;
    let tClassificator = await taskService.getTaskClassificatorById(idTaskClassificator);
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(tClassificator.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    if (title.trim().length == 0)
      return res.status(400).send("Title not valid");

    if (title.trim().length > 0 && title.trim().length <= 30) {
      const taskClassificatorUpdated = await taskService.updateTaskClassificator(idTaskClassificator, title);
      res.status(200).send({
        data: taskClassificatorUpdated
      })
    } else {
      throw new Error("Titulo inválido");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/**
 * @name put/task
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put("/task", auth, async (req, res) => {

  try {
    var taskDto = req.body;
    var userIdResponsible = req.body.userIdResponsible;
    let task = await taskService.getTaskById(taskDto._id);
    let reqUserId = getUserIdFromTokenRequest(req);
    let idWork = task.workId;
    let userInWork = await checkUserInWork(task.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    if (taskDto.title.trim().length == 0)
      return res.status(400).send("Title value not valid");
    if (new Date(taskDto.start) > new Date(taskDto.end)) {
      return res.status(400).send("Start date after end date is not valid");
    }

    const taskUpdated = await taskService.updateTask(taskDto, userIdResponsible);

    const calendarEventDto = {
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
      taskOriginId: taskDto._id
    }
    //se crea el evento asociado a la tarea si la fecha de fin y la fecha de inicio han sido establecidas y todavia no existe el evento.
    const calendarEventCheck = await calendarService.getCalendarEventByTaskOriginId(taskDto._id);
    if (calendarEventCheck != undefined) {
      calendarEventCheck.start = req.body.start;
      calendarEventCheck.end = req.body.end;
      if (calendarEventDto.start != '' && calendarEventDto.end != '')
        await calendarService.updateEvent(calendarEventCheck, userIdResponsible);
      else
        await calendarService.deleteCalendarEvent(calendarEventCheck._id, userIdResponsible, false);

    }
    else if (calendarEventDto.start != '' && calendarEventDto.end != '') {
      const taskEventCalendar = await calendarService.createCalendarEvent(calendarEventDto, idWork, userIdResponsible);

    }
    res.status(200).send({
      data: taskUpdated
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})


/**
 * @name put/taskclassificator/order
 * @function
 * @memberof module:routes/tasks
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put("/taskclassificator/order", auth, async (req, res) => {

  try {
    const idWork = req.body.idWork;
    const idTaskClassificator = req.body._id;
    const newOrder = req.body.order;
    const taskClassificatorsUpdated = await taskService.updateTasksClassificatorOrder(idTaskClassificator, idWork, newOrder);
    res.status(200).send({
      data: taskClassificatorsUpdated
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})


/**
 * @name delete/task/:id
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/task/:id", auth, async (req, res) => {
  const idWork = req.params.id;
  const taskDto = req.body;
  const userIdResponsible = req.body.userIdResponsible;

  try {
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(idWork.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    if (taskDto.title.trim().length == 0)
      return res.status(400).send("Title value not valid");


    if (taskDto.userAssignedId == "") {
      taskDto.userAssignedId = null;
    }
    const taskSave = await taskService.createTask(taskDto, idWork, userIdResponsible);

    const calendarEventDto = {
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
      taskOriginId: taskSave._id
    }
    //se crea el evento asociado a la tarea si la fecha de fin y la fecha de inicio han sido establecidas.
    if (calendarEventDto.start != '' && calendarEventDto.end != '') {
      const taskEventCalendar = await calendarService.createCalendarEvent(calendarEventDto, idWork, userIdResponsible);

    }
    res.status(200).send({
      data: taskSave,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name put/task/classificator
 * @function
 * @memberof module:routes/task
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put("/task/classificator", auth, async (req, res) => {

  try {
    const idTask = req.body.id;
    const userIdResponsible = req.body.userIdResponsible;
    const taskClassificatorId = req.body.taskClassificatorId;
    let reqUserId = getUserIdFromTokenRequest(req);
    let task = await taskService.getTaskById(idTask);
    let userInWork = await checkUserInWork(task.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    const taskUpdated = await taskService.updateTaskClassificatorId(idTask, taskClassificatorId, userIdResponsible);
    res.status(200).send({
      data: taskUpdated
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})
module.exports = router;