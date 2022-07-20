const router = require("express").Router();
const CalendarService = require("../../services/calendarService");

const calendarService = new CalendarService();

router.get("/calendar/:id", async (req, res) => {
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


router.get("/calendar/event/:id", async (req, res) => {
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



router.post("/calendar/:id", async (req, res) => {
    const idWork = req.params.id;
    const calendarEventDto = req.body;
    try {
      const calendarEventSave = await calendarService.createCalendarEvent(calendarEventDto, idWork);
      res.status(200).send({
        data: calendarEventSave
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });


  router.put('/calendar/event', async (req, res) => {
    const calendarEventDto = req.body;
    try {
      const calendarUpdate = await calendarService.updateEvent(calendarEventDto);
      res.status(200).send({
        data: calendarUpdate
      })
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  })


  


module.exports = router;