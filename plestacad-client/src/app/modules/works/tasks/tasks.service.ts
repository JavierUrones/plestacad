import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/** Servicio para la gestión de tareas de un trabajo académico */
@Injectable({
    providedIn: 'root'
})
export class TasksService {
    /** URL de la API */
    uri = environment.apiURL;
    constructor(private http: HttpClient) { }

    /**
     * Obtiene la lista de tareas de un trabajo académico.
     * @param idWork - id del trabajo académico
     * @returns Retorna la respuesta del servidor
     */
    getTasksByWorkId(idWork: string) {
        return this.http.get<any>(this.uri + "tasks/work/" + idWork).pipe(map(response => {
            return response.data
        }));
    }

    /**
     * Obtiene una tarea a partir de su id
     * @param id - id de la tarea
     * @returns Retorna la respuesta del servidor 
     */
    getTaskById(id: string){
        return this.http.get<any>(this.uri + "task/" + id).pipe(map(response => {
            return response.data
        }))
    }

    /**
     * Obtiene la lista de apartados de clasificación de tareas de un trabajo académico
     * @param idWork - id del trabajo académico
     * @returns Retorna la respuesta del servidor
     */
    getTaskClassificatorsByWorkId(idWork: string) {
        return this.http.get<any>(this.uri + "taskclassificators/work/" + idWork).pipe(map(response => {
            return response.data
        }));
    }

    /**
     * Actualiza la clasificación de una tarea
     * @param taskClassificatorId - id del apartado de clasificación
     * @param idTask - id de la tarea
     * @param userIdResponsible - id del usuario responsable de actualizar la tarea
     * @returns Retorna la respuesta del servidor
     */
    updateTaskClassification(taskClassificatorId: string, idTask: string, userIdResponsible: string) {
        return this.http.put<any>(this.uri + "task/classificator", { id: idTask, taskClassificatorId: taskClassificatorId , userIdResponsible: userIdResponsible}).pipe(map(response => {
            return response;
        }))
    }

    /**
     * Crea un nuevo apartado de clasificación de tareas
     * @param idWork - id del trabajo académico
     * @param userIdResponsible - id del usuario responsable de crear el apartado de clasificación
     * @returns Retorna la respuesta del servidor
     */
    createTaskClassificator(idWork: string, userIdResponsible: string) {
        return this.http.post<any>(this.uri + "taskclassificator/" + idWork, { title: "Nuevo", userIdResponsible: userIdResponsible }).pipe(map(response => {
            return response;
        }))
    }


    /**
     * Crea una nueva tarea
     * @param idWork - id del trabajo académico
     * @param title - título de la tarea
     * @param description - descripción de la tarea
     * @param start - fecha de inicio de la tarea
     * @param end - fecha de fin de la tarea
     * @param taskClassificatorId - id del apartado de clasificación de la tarea
     * @param userAssignedId - id del usuario asignado a la tarea
     * @param userIdResponsible - id del usuario responsable de crear la tarea
     * @returns Retorna la respuesta del servidor
     */
    createTask(idWork: string, title: string, description: string, start: Date, end: Date, taskClassificatorId: string, userAssignedId: string, userIdResponsible: string) {
        return this.http.post<any>(this.uri + "task/" + idWork, { title: title, description: description, start: start, end: end, taskClassificatorId: taskClassificatorId, userAssignedId: userAssignedId, userIdResponsible: userIdResponsible }).pipe(map(response => {
            return response;
        }))
    }

    /**
     * Elimina un apartado de clasificación de tareas
     * @param idWork - id del trabajo académico
     * @param id - id del apartado de clasificación de tareas
     * @param userIdResponsible - id del usuario responsable de eliminar el apartado de clasificación
     * @returns Retorna la respuesta del servidor
     */
    deleteTaskClassificator(idWork: string, id: string, userIdResponsible: string) {
        return this.http.delete<any>(this.uri + "taskclassificator/" + idWork + "/" + id + "/" + userIdResponsible).pipe(map(response => {
            return response;
        }))
    }

    /**
     * Elimina una tarea
     * @param id - id del apartado de clasificación de tareas
     * @param userIdResponsible - id del usuario responsable de eliminar el apartado de clasificación
     * @returns Retorna la respuesta del servidor
     */
    deleteTask(id: string, userIdResponsible: string){
        return this.http.delete<any>(this.uri + "task/" + id + "/" + userIdResponsible).pipe(map(response => {
            return response;
        }))   
    }

    /**
     * Actualiza el titulo de un apartado de clasificación de tareas
     * @param title - titulo a actualizar del apartado de clasificación de tareas
     * @param idTaskClassificator - id del apartado de clasificación de tareas
     * @param userIdResponsible - id del usuario responsable de eliminar el apartado de clasificación
     * @returns Retorna la respuesta del servidor
     */
    updateTaskClassificator(title: string, idTaskClassificator: string, userIdResponsible: string) {
        return this.http.put<any>(this.uri + "taskclassificator/", { _id: idTaskClassificator, title: title, userIdResponsible:userIdResponsible }).pipe(map(response => {
            return response;
        }))
    }

    /**
     * Actualiza el orden apartado de clasificación de tareas
     * @param idWork - id del trabajo académico
     * @param id - id del apartado de clasificación de tareas
     * @param newOrder - orden de clasificación del apartado
     * @returns Retorna la respuesta del servidor
     */
    updateTaskClassificatorsOrder(idWork: string, id: string, newOrder: number) {
        return this.http.put<any>(this.uri + "taskclassificator/order", { _id: id, idWork: idWork, order: newOrder }).pipe(map(response => {
            return response;
        }))
    }


     /**
     * Actualiza una tarea
     * @param id - id de la tarea
     * @param title - título de la tarea
     * @param description - descripción de la tarea
     * @param start - fecha de inicio de la tarea
     * @param end - fecha de fin de la tarea
     * @param taskClassificatorId - id del apartado de clasificación de la tarea
     * @param userAssignedId - id del usuario asignado a la tarea
     * @param userIdResponsible - id del usuario responsable de crear la tarea
     * @returns Retorna la respuesta del servidor
     */
    updateTask(id: string, title: string, description: string, start: Date, end: Date, taskClassificatorId: string, userAssignedId: string, userIdResponsible: string){
        return this.http.put<any>(this.uri + "task/", { _id: id, title: title, description: description, start: start, end: end, taskClassificatorId: taskClassificatorId, userAssignedId: userAssignedId, userIdResponsible: userIdResponsible}).pipe(map(response => {
            return response;
        }))
    }






}
