import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class CalendarService {
  uri = environment.apiURL;
  constructor(private http: HttpClient) {}


  getCalendarEventById(id: string){
    return this.http.get<any>(this.uri + 'calendar/event/' + id).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getCalendarEventsByWorkId(id: string) {
    console.log('ID get files from work', id);
    return this.http.get<any>(this.uri + 'calendar/' + id).pipe(
      map((response) => {
        return response;
      })
    );
  }


  createEvent(idWork: string, title: string, description: string, start: Date, end: Date, tags: string[], userIdResponsible: string){
    return this.http.post<any>(this.uri + 'calendar/' + idWork, { workId: idWork, title: title, description: description, start: start, end: end, tags: tags, userIdResponsible: userIdResponsible}).pipe(map(response => {
      return response;
    }))

  }

  deleteEvent(idEvent: string, userIdResponsible: string){
  return this.http.delete<any>(this.uri + "calendar/" + idEvent + "/" + userIdResponsible).pipe(map(response => {
    return response;
  }))
  
  }


  updateEvent(eventId: string, title: string, description: string, start: Date, end: Date, tags: string[], userIdResponsible: string){
    return this.http.put<any>(this.uri + 'calendar/event', { _id: eventId, title: title, description: description, start: start, end: end, tags: tags, userIdResponsible: userIdResponsible}).pipe(map(response => {
      return response;
    }))
  }
}
