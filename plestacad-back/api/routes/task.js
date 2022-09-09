const router = require("express").Router();

const TaskService = require("../../services/taskService");
const CalendarService = require("../../services/calendarService");

const taskService = new TaskService();
const calendarService = new CalendarService();
const auth = require("../middleware/authMiddleware");
router.get("/taskclassificator/:id",  auth, async (req, res) => {
  try {
    id = req.params.id;
    const taskclassificator = await taskService.getTaskClassificatorById(id);
    res.json({
      data: taskclassificator,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

);

router.get("/task/:id", auth, async (req, res) => {
  try {
    id = req.params.id;
    const task = await taskService.getTaskById(id);
    res.json({
      data: task,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

);


router.get("/tasks/work/:id",auth, async (req, res) => {
  try {
    idWork = req.params.id;
    const tasks = await taskService.getTasksByWorkId(idWork);
    res.json({
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

);

router.get("/taskclassificators/work/:id", auth,async (req, res) => {
  try {
    idWork = req.params.id;
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

router.post("/taskclassificator/:id", auth, async (req, res) => {
  const idWork = req.params.id;
  const taskClassificatorDto = req.body;
  const userIdResponsible = req.body.userIdResponsible;
  console.log(taskClassificatorDto)
  try {
    taskClassificatorDto.order = (await taskService.getTaskClassificatorsByWorkId(idWork)).length + 1;
    const taskClassificatorSave = await taskService.createTaskClassificator(taskClassificatorDto, idWork, userIdResponsible);
    res.status(200).send({
      data: taskClassificatorSave,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/taskclassificator/:idWork/:id/:userIdResponsible", auth,async (req, res) => {
  const id = req.params.id;
  const idWork = req.params.idWork;
  const userIdResponsible = req.params.userIdResponsible;
  try {
    //Se reordenan el resto de clasificadores
    const taskClassificators = await taskService.updateTasksClassificatorsOrders(idWork, id);

    const taskClassificatorDeleted = await taskService.deleteTaskClassificator(id, idWork, userIdResponsible);

    res.status(200).send({
      data: taskClassificatorDeleted,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/task/:id/:userIdResponsible", auth,async (req, res) => {
  const id = req.params.id;
  const userIdResponsible = req.params.userIdResponsible;

  try {
    const taskToDelete = await taskService.getTaskById(id);
    console.log( "tasktodelete!", userIdResponsible)
    const taskDeleted = await taskService.deleteTask(id, taskToDelete.workId, userIdResponsible);

    
    if(taskToDelete.start != undefined && taskToDelete.end != undefined) { //esto significa que tiene un evento creado asociado.
      const calendarEventToDelete = await calendarService.getCalendarEventByTaskOriginId(taskToDelete._id);
      console.log("evento a boorar", calendarEventToDelete)

      const calendarEventDeleted = await calendarService.deleteCalendarEvent(calendarEventToDelete._id);
      console.log("borrado evento", calendarEventDeleted)
    }

    res.status(200).send({
      data: taskDeleted,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});



router.put("/taskclassificator", auth,async (req, res) => {

  try {
    const idTaskClassificator = req.body._id;
    const title = req.body.title;
    if (title.trim().length > 0 && title.trim().length <= 30) {
      const taskClassificatorUpdated = await taskService.updateTaskClassificator(idTaskClassificator, title);
      res.status(200).send({
        data: taskClassificatorUpdated
      })
    } else {
      throw new Error("Titulo inválido");
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
})


router.put("/task", auth, async (req, res) => {

  try {
    var taskDto = req.body;
    var userIdResponsible = req.body.userIdResponsible;
    const taskUpdated = await taskService.updateTask(taskDto, userIdResponsible);

    console.log("TASK DTO de la tarea a acutalizar" , taskDto)
    const calendarEventDto = {
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
      taskOriginId: taskDto._id
    }
    //se crea el evento asociado a la tarea si la fecha de fin y la fecha de inicio han sido establecidas y todavia no existe el evento.
    const calendarEventCheck = await calendarService.getCalendarEventByTaskOriginId(taskDto._id);
    if(calendarEventCheck != undefined){
      calendarEventCheck.start = req.body.start;
      calendarEventCheck.end = req.body.end;
      await calendarService.updateEvent(calendarEventCheck);
    }
    else if (calendarEventDto.start != '' && calendarEventDto.end != '' ) {
      const taskEventCalendar = await calendarService.createCalendarEvent(calendarEventDto, idWork, userIdResponsible);

    }
    res.status(200).send({
      data: taskUpdated
    })
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
})



router.put("/taskclassificator/order",auth, async (req, res) => {

  try {
    const idWork = req.body.idWork;
    const idTaskClassificator = req.body._id;
    const newOrder = req.body.order;
    const taskClassificatorsUpdated = await taskService.updateTasksClassificatorOrder(idTaskClassificator, idWork, newOrder);
    res.status(200).send({
      data: taskClassificatorsUpdated
    })
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
})




router.post("/task/:id", auth,  async (req, res) => {
  const idWork = req.params.id;
  const taskDto = req.body;
  const userIdResponsible = req.body.userIdResponsible;

  try {
    const taskSave = await taskService.createTask(taskDto, idWork, userIdResponsible);

    const calendarEventDto = {
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
      taskOriginId: taskSave._id
    }
    console.log("event task", calendarEventDto)
    //se crea el evento asociado a la tarea si la fecha de fin y la fecha de inicio han sido establecidas.
    if (calendarEventDto.start != '' && calendarEventDto.end != '') {
      const taskEventCalendar = await calendarService.createCalendarEvent(calendarEventDto, idWork, userIdResponsible);

    }
    res.status(200).send({
      data: taskSave,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


router.put("/task/classificator",auth, async (req, res) => {

  try {
    const idTask = req.body.id;
    const userIdResponsible = req.body.userIdResponsible;
    const taskClassificatorId = req.body.taskClassificatorId;

    const taskUpdated = await taskService.updateTaskClassificatorId(idTask, taskClassificatorId, userIdResponsible);
    res.status(200).send({
      data: taskUpdated
    })
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
})
module.exports = router;