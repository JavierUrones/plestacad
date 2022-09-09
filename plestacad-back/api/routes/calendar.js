const router = require("express").Router();
const CalendarService = require("../../services/calendarService");

const calendarService = new CalendarService();
const auth = require("../middleware/authMiddleware");
router.get("/calendar/:id", auth, async (req, res) => {
    try {
        id = req.params.id;
        const calendarEvents = await calendarService.getCalendarEventsByWorkId(id);
        res.json({
            data: calendarEvents,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
);


router.get("/calendar/event/:id", auth, async (req, res) => {
  try{
    id = req.params.id;
    const event = await calendarService.getCalendarEventById(id);
    res.json({
      data: event
    })
  } catch (error){
    return res.status(500).json({ error: error.message })
  }
})



router.post("/calendar/:id", auth, async (req, res) => {
    const idWork = req.params.id;
    const calendarEventDto = req.body;
    const userIdResponsible = req.body.userIdResponsible;
    try {
      const calendarEventSave = await calendarService.createCalendarEvent(calendarEventDto, idWork, userIdResponsible);
      res.status(200).send({
        data: calendarEventSave
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });


  router.put('/calendar/event', auth, async (req, res) => {
    const calendarEventDto = req.body;
    const userIdResponsible = req.body.userIdResponsible;

    try {
      const calendarUpdate = await calendarService.updateEvent(calendarEventDto, userIdResponsible);
      res.status(200).send({
        data: calendarUpdate
      })
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  })


  router.delete("/calendar/:id/:userIdResponsible", auth, async (req, res) => {
    const id = req.params.id;
    const userIdResponsible = req.params.userIdResponsible;
    try {
        const calendarEventDeleted = await calendarService.deleteCalendarEvent(id, userIdResponsible);
        
      res.status(200).send({
        data: calendarEventDeleted,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });

  


module.exports = router;