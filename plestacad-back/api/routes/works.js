const router = require("express").Router();
const WorkService = require("../../services/workService");
const UserService = require("../../services/userService");
const ValidationError = require("../../config/errors/customErrors");
const FileService = require("../../services/fileService");
const TaskService = require("../../services/taskService");

const userService = new UserService();

const workService = new WorkService();


const fileService = new FileService();
const taskService = new TaskService();

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

    await fileService.createDirectory(rootProjectPath + directoryFiles + workSave.id);
    await fileService.createDirectory(rootProjectPath + directoryFiles + workSave.id + "/" + workSave.title);

    //Se crean los apartados de clasificación de tareas iniciales.
    var taskClassificators = [{ title: "Nuevas", order: 0 }, { title: "En progreso", order: 1 }, { title: "Bloqueadas", order: 2 }, { title: "Terminadas", order: 3 },]
    await taskService.createTaskClassificator(taskClassificators[0], workSave.id)
    await taskService.createTaskClassificator(taskClassificators[1], workSave.id)
    await taskService.createTaskClassificator(taskClassificators[2], workSave.id)
    await taskService.createTaskClassificator(taskClassificators[3], workSave.id)


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


router.delete("/works", auth, async (req, res) => {
  try {
    const id = req.body.id;
    // Del. work, files, posts, tasks, calendar events and notifications.
    res.json({
      data: id
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






module.exports = router;
