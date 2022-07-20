const CalendarEvent = require("../models/CalendarEvent");

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
  async createCalendarEvent(calendarEventDto, workId) {
    console.log("DTO CALENDAR", calendarEventDto)
    const newCalendarEvent = new CalendarEvent({
      title: calendarEventDto.title,
      description: calendarEventDto.description,
      start: new Date(calendarEventDto.start).toISOString(),
      end: new Date(calendarEventDto.end).toISOString(),
      tags: calendarEventDto.tags,
      workId: workId
    });
    try {
      const calendarEventSave = await newCalendarEvent.save();
      return calendarEventSave;
    } catch (error) {
      throw error;
    }
  }


  async updateEvent(eventDto) {
    try {
      console.log("EVENT DTO", eventDto)
      const filter = { _id: eventDto._id };
      const update = { title: eventDto.title, description: eventDto.description, start: eventDto.start, end: eventDto.end, tags: eventDto.tags };
      let event = await CalendarEvent.findOneAndUpdate(filter, update);

      return event;
    } catch (error) {
      throw error;
    }
  }


}

module.exports = CalendarService;

