const router = require("express").Router();
const WorkService = require("../../services/workService");
const UserService = require("../../services/userService");
const ValidationError = require("../../config/errors/customErrors");
const FileService = require("../../services/fileService");
const TaskService = require("../../services/taskService");
const PostService = require("../../services/postService");
const CalendarService = require("../../services/calendarService");
const NotificationService = require("../../services/notificationService");

const userService = new UserService();
const calendarService = new CalendarService();
const workService = new WorkService();
const fileService = new FileService();
const taskService = new TaskService();
const postService = new PostService();
const notificationService = new NotificationService();


const rootProjectPath = require("path").resolve("./");
const directoryFiles = "/userdata/";

const auth = require("../middleware/authMiddleware");

const { sendNewWorkRequestNotification } = require('../../utils/socket-io');





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

router.post("/works", auth, async (req, res) => {
  const workDto = req.body;
  try {
    const studentsInvited = req.body.studentsInvited;
    const teachersInvited = req.body.teachersInvited;

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
      console.log("studentInvited", studentInvited)
      await workService.generateWorkRequest(workSave.id.toString(), studentInvited[0]._id.toString(), workDto.authorId, "student")
      sendNewWorkRequestNotification(studentInvited[0]._id.toString());

    };


    for await (const teacher of teachersInvited) {
      console.log("profesor", teacher)

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


router.delete("/works/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

    let work = await workService.getWorkById(id);

    fileService.deleteWorkDirectory(rootProjectPath + directoryFiles + id);

    let taskClassificators = await taskService.getTaskClassificatorsByWorkId(id);
    for await(let taskClassificator of taskClassificators){
      await taskService.deleteTaskClassificator(taskClassificator._id, id, work.authorId, true)
    }

    let tasks = await taskService.getTasksByWorkId(id);
    for await(let task of tasks){
      await taskService.deleteTask(task._id, id, work.authorId, true)
    }

    let events = await calendarService.getCalendarEventsByWorkId(id);

    for await(let event of events){
      await calendarService.deleteCalendarEvent(event._id, work.authorId, true)
    }

    let posts = await postService.getPostsByWorkId(id);

    for await(let post of posts){
      await postService.delete(post._id);
    }

    let notifications = await notificationService.getNotificationsByWorkId(id);

    for await (let notification of notifications){
      await notificationService.deleteNotificationById(notification._id);
    }

    let workRequests = await workService.getWorkRequestsByWorkId(id);

    for await (let request of workRequests){
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



router.post("/workRequests", auth, async (req, res) => {
  try {
    const id = req.body.workId;
    const userIdResponsible = req.body.userIdResponsible;
    const teachers = req.body.teachers;
    const students = req.body.students;
    //console.log(id, userIdResponsible, teachers, students)
    for await(let student of students){
      let studentInvited = await userService.getUserByEmail(student);
      await workService.generateWorkRequest(id.toString(),studentInvited[0]._id.toString(), userIdResponsible, "student")
      sendNewWorkRequestNotification(studentInvited[0]._id.toString());

    }
    for await(let teacher of teachers){
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


router.get("/workRequestsByUserReceiverId/:id", auth, async (req, res) =>{
  try{
    const userReceiverId = req.params.id;
    let listRequests = await workService.getWorkRequestsByUserReceiverId(userReceiverId);
    res.json({
      data: listRequests,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})


router.get("/workRequestsWithInfoByUserReceiverId/:id", auth, async (req, res) => {
  try{
    const userReceiverId = req.params.id;
    let listRequests = await workService.getWorkRequestsByUserReceiverId(userReceiverId);

    let listRequestsWithInfo = [];
    for await (const request of listRequests) {
      var work = await workService.getWorkById(request.workId.toString());
      var user = await userService.getUserById(request.userIdSender.toString());
      listRequestsWithInfo.push({_id: request._id, workId: request.workId, description: request.role,  userIdSender: request.userIdSender, title: work.title, userIdReceiver: userReceiverId, userSenderFullname: user.name + " " + user.surname, date: request.date })
      
    };
    res.json({
      data: listRequestsWithInfo,
    });
  }catch(error){
    return res.status(500).json({ error: error.message });
  }
});


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

router.post("/worksRequests/accept", auth, async (req, res) => {
  try{
    const id = req.body.id;
    const role = req.body.role;
    const workId = req.body.workId;
    const userIdReceiver = req.body.userIdReceiver;
    let work = await workService.getWorkById(workId);
    console.log(role)

    console.log("work before", work)
    switch(role){
      case "student":
        work.students.push(userIdReceiver);
        break;
      case "teacher":
        work.teachers.push(userIdReceiver);
        break;
    }
    console.log("trabajo updated", work)
    var updatedWork = await workService.updateWork(work);
    let result = await workService.deleteWorkRequest(id);

    sendNewWorkRequestNotification(userIdReceiver);


    res.status(200).send({
      data: result, updatedWork
    });

  }catch(error){
    return res.status(500).json({ error: error.message });
  }
})


router.delete("/worksRequests/deny/:id/:userIdReceiver", auth, async (req, res) => {
  try{
    console.log("paranms", req.params)
    id = req.params.id;
    userIdReceiver = req.params.userIdReceiver;

    let result = await workService.deleteWorkRequest(id);
    sendNewWorkRequestNotification(userIdReceiver);

    res.status(200).send({
      data: result,
    });

  }catch(error){
    return res.status(500).json({ error: error.message });
  }
})


router.put("/works/deleteUser", auth, async (req, res) => {

  try{
    let workId = req.body.workId;
    let userId = req.body.userId;
    let type = req.body.type;
    console.log("work id", workId)

    let result = await workService.deleteUserFromWork(workId, userId, type);
    console.log(result)
    res.status(200).send({
      data: result,
    });

  }catch(error){
    return res.status(500).json({ error: error.message });
  }

});

router.put("/works", auth, async (req, res) => {

  try{
    let work = await workService.getWorkById(req.body.workId);

    console.log(work);
    work.category = req.body.category;
    work.course = req.body.course;
    work.title = req.body.title;
    work.description = req.body.description;
    work.classified = req.body.classified;
    let workUpdated = await workService.updateWork(work);
    res.status(200).send({
      data: workUpdated,
    });

  }catch(error){
    return res.status(500).json({ error: error.message });
  }

});




module.exports = router;
