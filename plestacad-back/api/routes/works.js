const router = require("express").Router();
const WorkService = require("../../services/workService");

const workService = new WorkService();

const ValidationError = require("../../config/errors/customErrors");

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
    const listWorks = await workService.getWorksByUserId(userDto.id);
    res.json({
      data: listWorks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.post("/worksByStudentIdAndCategory", async (req, res) => {
  try {
    const userDto = req.body;
    const listWorks = await workService.getWorksByStudentIdAndCategory(userDto.id, req.body.category);
    res.json({
      data: listWorks,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


module.exports = router;
