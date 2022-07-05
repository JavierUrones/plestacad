const router = require("express").Router();
const WorkService = require("../../services/workService");

const workService = new WorkService();

const ValidationError = require("../../config/errors/customErrors");
const FileService = require("../../services/fileService");
const fileService = new FileService();
const rootProjectPath = require("path").resolve("./");
const directoryFiles = "/userdata/";
router.get("/works", async (req, res) => {
  try {
    const listWorks = await workService.getAllWorks();
    res.json({
      data: listWorks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/works/:id", async (req, res) => {
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

router.post("/works", async (req, res) => {
  const workDto = req.body;
  try {
    const workSave = await workService.createWork(workDto);
      
    await fileService.createDirectory(rootProjectPath + directoryFiles + workSave.id);
    await fileService.createDirectory(rootProjectPath + directoryFiles + workSave.id + "/" + workSave.title);

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

router.post("/worksByUser", async (req, res) => {
  try {
    const userDto = req.body;
    var listWorks;
    if(userDto.role == "student")
       listWorks = await workService.getWorksByStudentId(userDto.id);
    else
        listWorks = await workService.getWorksByTeacherId(userDto.id)
    res.json({
      data: listWorks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.post("/worksByUserIdAndCategory", async (req, res) => {
  try {
    const id = req.body.id;
    const category = req.body.category;
    const role = req.body.role;
    var listWorks;
    console.log("ROLE", role)
    if(role=="teacher")
        listWorks = await workService.getWorksByTeacherIdAndCategory(id, category);
    else
        listWorks = await workService.getWorksByStudentIdAndCategory(id, category);

    res.json({
      data: listWorks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/works", async (req, res) => {
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

module.exports = router;
