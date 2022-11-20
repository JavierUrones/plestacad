import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio de trabajos académicos.
 */
export class WorkService {

/**
 * URL de la API
 */
  uri = environment.apiURL;
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de trabajos académicos asociados a un usuario.
   * @param id id del usuario
   * @returns la respuesta del servidor.
   */
  getWorksByUserId(id: string) {
    return this.http.post<any>(this.uri + "worksByUser", {
      "id": id
    }).pipe(map(response => {
      return response.data
    }));
  }

    /**
   * Obtiene todos los trabajos académicos.
   * @returns la respuesta del servidor.
   */
     getAllWorks() {
      return this.http.get<any>(this.uri + "works").pipe(map(response => {
        return response.data
      }));
    }

  /**
   * Genera las solicitudes de invitación al trabajo académico para los estudiantes y profesores especificados.
   * @param workId id del trabajo
   * @param userIdResponsible id del usuario responsable
   * @param teachers lista de profesores
   * @param students lista de estudiantes
   * @returns la respuesta del servidor.
   */
  generateWorkRequests(workId: string, userIdResponsible: string, teachers: any, students: any) {
    let body = {
      userIdResponsible: userIdResponsible, workId: workId, teachers: teachers, students: students
    }
    return this.http.post<any>(this.uri + "workRequests", body).pipe(map(response => {
      return response
    }));
  }

  /**
   * Obtiene la lista de trabajos académicos a partir de la categoría.
   * @param id id del usuario.
   * @param category categoría del trabajo académico
   * @returns la respuesta del servidor.
   */
  getWorksByStudentAndCategory(id: string, category: string) {
    return this.http.post<any>(this.uri + "worksByUserIdAndCategory", {
      "id": id,
      "category": category,
      "role": sessionStorage.getItem("role") as string
    }).pipe(map(response => {
      return response.data
    }));
  }

/**
 * Obtiene el trabajo académico por id.
 * @param id id del trabajo académico.
 * @returns respuesta del servidor.
 */
  getWorkById(id: string) {
    return this.http.get<any>(this.uri + "works/" + id).pipe(map(response => { return response; }))
  }

  /**
   * Crea un trabajo académico.
   * @param authorId id del usuario autor del trabajo
   * @param title título del trabajo académico
   * @param description descripción del trabajo académico
   * @param category categoría del trabajo académico
   * @param course curso del trabajo académico
   * @param teachers lista de profesores del trabajo académico
   * @param teachersInvited profesores invitados al trabajo académico
   * @param studentsInvited estudiantes invitados al trabajo académico
   * @returns la respuesta del servidor
   */
  createWork(authorId: string | null, title: string, description: string, category: string, course: number, teachers: any[], teachersInvited: any[], studentsInvited: any[]) {
    return this.http.post<any>(this.uri + "works", {
      authorId: authorId,
      title: title,
      description: description,
      category: category,
      course: course,
      teachers: teachers,
      teachersInvited: teachersInvited,
      studentsInvited: studentsInvited
    })
  }

/**
 * Elimina a un usuario del trabajo académico.
 * @param workId id del trabajo académico
 * @param userId id del usuario
 * @param type rol del usuario en el trabajo académico.
 * @returns la respuesta del servidor.
 */
  deleteUserFromWork(workId: string, userId: string, type: string){
    return this.http.put<any>(this.uri + "works/deleteUser", {
      userId: userId,
      workId: workId,
      type: type
    }).pipe(map(response => {
      return response;
    }));
  }

  leaveFromWork(workId: string, userId: string, type: string){
    return this.http.put<any>(this.uri + "works/leaveWork", {
      userId: userId,
      workId: workId,
      type: type
    }).pipe(map(response => {
      return response;
    }));
  }

  /**
 * Elimina un trabajo académico.
 * @param workId id del trabajo académico
 * @returns la respuesta del servidor.
 */
  deleteWork(workId: string){
    return this.http.delete<any>(this.uri + "works/" + workId).pipe(map(response => {
      return response;
    }))
  }
/**
 * Actualiza un trabajo académico.
 * @param workId id del trabajo académico
 * @param title título del trabajo académico
 * @param description descripción del trabajo académico
 * @param course curso del trabajo académico
 * @param category categoría del trabajo académico
 * @returns la respuestas del servidor
 */
  updateWork(workId: string, title: string, description: string, course: number, category: string){
    return this.http.put<any>(this.uri + "works/", { workId: workId, title: title, description: description, course: course, category: category}).pipe(map(response => {
      return response;
    }))
  }

  /**
   * Marca un trabajo como clasificado.
   * @param workId id del trabajo académico
   * @returns la respuesta del servidor
   */
  setWorkAsClassified(workId: string){
    return this.http.put<any>(this.uri + "works/", { workId: workId, classified: true}).pipe(map(response => {
      return response;
    }))
  }

/**
   * Marca un trabajo como no clasificado.
   * @param workId id del trabajo académico
   * @returns la respuesta del servidor
   */
  setWorkAsDesclassified(workId: string){
    return this.http.put<any>(this.uri + "works/", { workId: workId,classified: false}).pipe(map(response => {
      return response;
    }))
  }


}
