import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

/** Servicio del calendario de los trabajos académicos */
export class CalendarService {
  /** URL de la API */
  uri = environment.apiURL;
  constructor(private http: HttpClient) { }

  /** Obtiene un evento a partir de su id.
   * @param id - id del evento
   * @returns Retorna la respuesta del servidor
   */
  getCalendarEventById(id: string) {
    return this.http.get<any>(this.uri + 'calendar/event/' + id).pipe(
      map((response) => {
        return response;
      })
    );
  }
  /**
   * Obtiene la lista de eventos del calendario a partir del id del trabajo académico.
   * @param id - id del trabajo académico
   * @returns Retorna la respuesta del servidor.
   */
  getCalendarEventsByWorkId(id: string) {
    return this.http.get<any>(this.uri + 'calendar/' + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

/**
 * Crea un nuevo evento en el calendario de un trabajo académico.
 * @param idWork - id del trabajo académico
 * @param title - título del evento
 * @param description - descripción del evento
 * @param start - fecha de inicio del evento
 * @param end - fecha de fin del evento
 * @param tags - lista de tags del evento
 * @param userIdResponsible - id del usuario responsable de la creación del evento
 * @returns Retorna la respuesta del servidor
 */
  createEvent(idWork: string, title: string, description: string, start: Date, end: Date, tags: string[], userIdResponsible: string) {
    return this.http.post<any>(this.uri + 'calendar/' + idWork, { workId: idWork, title: title, description: description, start: start, end: end, tags: tags, userIdResponsible: userIdResponsible }).pipe(map(response => {
      return response;
    }))

  }

  /**
   * Elimina un evento del calendario
   * @param idEvent - id del evento a borrar
   * @param userIdResponsible - id del usuario responsable de borrar el evento
   * @returns Retorna la respuesta del servidor
   */
  deleteEvent(idEvent: string, userIdResponsible: string) {
    return this.http.delete<any>(this.uri + "calendar/" + idEvent + "/" + userIdResponsible).pipe(map(response => {
      return response;
    }))

  }

/**
 * Actualiza un evento del calendario
 * @param eventId - id del evento a actualizar
 * @param title - título del evento
 * @param description - descripción del evento
 * @param start - fecha de inicio del evento
 * @param end - fecha de fin del evento
 * @param tags - lista de tags del evento
 * @param userIdResponsible - id del usuario responsable de actualizar el evento
 * @param workId - id del trabajo académico al que pertenece el evento
 * @returns Retorna la respuesta del servidor
 */
  updateEvent(eventId: string, title: string, description: string, start: Date, end: Date, tags: string[], userIdResponsible: string, workId: string) {
    return this.http.put<any>(this.uri + 'calendar/event', { _id: eventId, title: title, description: description, start: start, end: end, tags: tags, userIdResponsible: userIdResponsible, workId: workId }).pipe(map(response => {
      return response;
    }))
  }
}
