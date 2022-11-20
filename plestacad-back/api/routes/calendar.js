/** Router express que define las rutas relacionadas con la autenticación de los usuarios.
 * @module routes/calendar
 * @requires express
 */
/**
 * Router express.
 * @type {object}
 * @const
 */
const router = require("express").Router();

/**
 * Calendar service
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
const { getUserIdFromTokenRequest, checkUserInWork, checkIsAdmin } = require('../../utils/token');

/**
 * @name get/calendar/:id
 * @function
 * @memberof module:routes/calendar
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/calendar/:id", auth, async (req, res) => {
  try {
    id = req.params.id;
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(id.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    const calendarEvents = await calendarService.getCalendarEventsByWorkId(id);
    res.json({
      data: calendarEvents,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
);


/**
 * @name get/calendar/event/:id
 * @function
 * @memberof module:routes/calendar
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.get("/calendar/event/:id", auth, async (req, res) => {
  try {
    id = req.params.id;
    const event = await calendarService.getCalendarEventById(id);
    res.json({
      data: event
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})


/**
 * @name post/calendar/:id
 * @function
 * @memberof module:routes/calendar
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.post("/calendar/:id", auth, async (req, res) => {
  const idWork = req.params.id;
  const calendarEventDto = req.body;
  const userIdResponsible = req.body.userIdResponsible;
  try {
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(calendarEventDto.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    if (new Date(calendarEventDto.start) > new Date(calendarEventDto.end)) {
      return res.status(400).send("Start date after end date is not valid");
    }
    if (calendarEventDto.title.trim().length == 0) {
      return res.status(400).send("Title value not valid");
    }
    const calendarEventSave = await calendarService.createCalendarEvent(calendarEventDto, idWork, userIdResponsible);
    res.status(200).send({
      data: calendarEventSave
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @name put/calendar/event
 * @function
 * @memberof module:routes/calendar
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.put('/calendar/event', auth, async (req, res) => {
  const calendarEventDto = req.body;
  const userIdResponsible = req.body.userIdResponsible;

  try {
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(calendarEventDto.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    if(calendarEventDto.title.trim()==""){
      return res.status(400).send("Title value not valid");
    }
    const calendarUpdate = await calendarService.updateEvent(calendarEventDto, userIdResponsible);
    res.status(200).send({
      data: calendarUpdate
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/**
 * @name delete/calendar/:id/:userIdResponsible
 * @function
 * @memberof module:routes/calendar
 * @param {string} path - express path
 * @param {callback} middleware - express middleware.
 */
router.delete("/calendar/:id/:userIdResponsible", auth, async (req, res) => {
  const id = req.params.id;
  const userIdResponsible = req.params.userIdResponsible;
  try {
    let calendarEvent = await calendarService.getCalendarEventById(id);
    let reqUserId = getUserIdFromTokenRequest(req);
    let userInWork = await checkUserInWork(calendarEvent.workId.toString(), reqUserId);
    if (!userInWork && !await checkIsAdmin(reqUserId)) {
      return res.status(403).send("Access denied");
    }
    const calendarEventDeleted = await calendarService.deleteCalendarEvent(id, userIdResponsible, false);

    res.status(200).send({
      data: calendarEventDeleted,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});




module.exports = router;