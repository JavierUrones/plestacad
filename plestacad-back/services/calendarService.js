const CalendarEvent = require("../models/CalendarEvent");
const NotificationService = require("../services/notificationService");
const notificationService = new NotificationService();

class CalendarService {

  async getCalendarEventById(id) {
    try {
      const event = await CalendarEvent.findById(id);
      console.log("ev", event)
      return event;
    } catch (error) {
      throw error;
    }
  }


  async getCalendarEventByTaskOriginId(id){
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
  async getCalendarEventsByWorkId(id) {
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
  async createCalendarEvent(calendarEventDto, workId, userIdResponsible) {
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


  async deleteCalendarEvent(idEvent, userIdResponsible) {
    try {
      var event = await this.getCalendarEventById(idEvent);
      var calendarEventDeleted = await CalendarEvent.deleteOne({ _id: idEvent })

      notificationService.createNewNotification(event.workId.toString(), "delete-event-calendar", userIdResponsible, event.title);

      return calendarEventDeleted;
    } catch (error) {
      throw error;
    }

  }


  async updateEvent(eventDto, userIdResponsible) {
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


}

module.exports = CalendarService;

