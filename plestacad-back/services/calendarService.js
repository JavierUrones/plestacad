/** Servicio encargado de gestionar los eventos del calendario.
 * @module services/calendarService
 */

/**
 * Modelo CalendarEvent.
 * @type {object}
 * @const
 */
const CalendarEvent = require("../models/CalendarEvent");

/**
 * Servicio de notificaciones.
 * @type {object}
 * @const
 */
const notificationService = require("../services/notificationService");

/**
 * Obtener evento del calendario por id.
 * @param {string} id - id del evento.
 * @returns {CalendarEvent} Retorna el evento.
 */
async function getCalendarEventById(id) {
  try {
    const event = await CalendarEvent.findById(id);
    return event;
  } catch (error) {
    throw error;
  }
}


/**
 * Obtener evento del calendario por id de la tarea orígen..
 * @param {string} id - id de la tarea asociada al evento.
 * @returns {CalendarEvent} Retorna el evento asociado.
 */
async function getCalendarEventByTaskOriginId(id) {
  try {
    const listCalendarEvents = await CalendarEvent.findOne({
      'taskOriginId': {
        $in: [
          mongoose.Types.ObjectId(id)
        ]
      }
    });
    return listCalendarEvents;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtener evento del calendario por id del trabajo académico.
 * @param {string} id - id del trabajo.
 * @returns Retorna la lista de eventos asociados al trabajo académico.
 */
async function getCalendarEventsByWorkId(id) {
  try {
    const listCalendarEvents = await CalendarEvent.find({
      'workId': {
        $in: [
          mongoose.Types.ObjectId(id)
        ]
      }
    });
    return listCalendarEvents;
  } catch (error) {
    throw error;
  }
}

/**
 * Crea un nuevo evento en el calendario.
 * @param {Calendar} calendarEventDto - datos del calendario a crear.
 * @param {string} workId - id del trabajo en el que se va a crear el evento.
 * @param {string} userIdResponsible - id del usuario responsable de crear el evento.
 * @returns {CalendarEvent} - Retorna el nuevo evento creado.
 */
async function createCalendarEvent(calendarEventDto, workId, userIdResponsible) {
  const newCalendarEvent = new CalendarEvent({
    title: calendarEventDto.title,
    description: calendarEventDto.description,
    start: new Date(calendarEventDto.start),
    end: new Date(calendarEventDto.end),
    tags: calendarEventDto.tags,
    taskOriginId: calendarEventDto.taskOriginId,
    workId: workId
  });
  try {
    const calendarEventSave = await newCalendarEvent.save();
    notificationService.createNewNotification(workId, "new-event-calendar", userIdResponsible, newCalendarEvent.title);

    return calendarEventSave;
  } catch (error) {
    throw error;
  }
}

/**
 * Borra un evento del calendario.
 * @param {string} idEvent - id del evento a borrar.
 * @param {string} userIdResponsible - id del usuario responsable de borrar el evento.
 * @param {boolean} initial - flag que indica si el evento creado debe generar notificación o no.
 * @returns {CalendarEvent} - Retorna el evento borrado.
 */
async function deleteCalendarEvent(idEvent, userIdResponsible, initial) {
  try {
    var event = await this.getCalendarEventById(idEvent);
    var calendarEventDeleted = await CalendarEvent.deleteOne({ _id: idEvent })

    if (!initial)
      notificationService.createNewNotification(event.workId.toString(), "delete-event-calendar", userIdResponsible, event.title);

    return calendarEventDeleted;
  } catch (error) {
    throw error;
  }

}

/**
 * Actualiza un evento del calendario.
 * @param {CalendarEvent} eventDto - datos del evento a actualizar.
 * @param {string} userIdResponsible - id del usuario responsable de borrar el evento.
 * @returns {CalendarEvent} - Retorna el evento actualizado.
 */
async function updateEvent(eventDto, userIdResponsible) {
  try {
    const filter = { _id: eventDto._id };
    const update = { title: eventDto.title, description: eventDto.description, start: eventDto.start, end: eventDto.end, tags: eventDto.tags };
    let event = await CalendarEvent.findOneAndUpdate(filter, update);
    notificationService.createNewNotification(event.workId.toString(), "update-event-calendar", userIdResponsible, event.title);

    return event;
  } catch (error) {
    throw error;
  }
}



module.exports = {getCalendarEventById, updateEvent, deleteCalendarEvent, createCalendarEvent, getCalendarEventsByWorkId, getCalendarEventByTaskOriginId};

