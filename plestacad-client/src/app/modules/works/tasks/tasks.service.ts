import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TasksService {

    uri = environment.apiURL;
    constructor(private http: HttpClient) { }

    getTasksByWorkId(idWork: string) {
        return this.http.get<any>(this.uri + "tasks/work/" + idWork).pipe(map(response => {
            return response.data
        }));
    }

    getTaskById(id: string){
        return this.http.get<any>(this.uri + "task/" + id).pipe(map(response => {
            return response.data
        }))
    }

    getTaskClassificatorsByWorkId(idWork: string) {
        return this.http.get<any>(this.uri + "taskclassificators/work/" + idWork).pipe(map(response => {
            return response.data
        }));
    }

    updateTaskClassification(taskClassificatorId: string, idTask: string, userIdResponsible: string) {
        return this.http.put<any>(this.uri + "task/classificator", { id: idTask, taskClassificatorId: taskClassificatorId , userIdResponsible: userIdResponsible}).pipe(map(response => {
            return response;
        }))
    }

    createTaskClassificator(idWork: string, userIdResponsible: string) {
        return this.http.post<any>(this.uri + "taskclassificator/" + idWork, { title: "Nuevo", userIdResponsible: userIdResponsible }).pipe(map(response => {
            return response;
        }))
    }

    createTask(idWork: string, title: string, description: string, start: Date, end: Date, taskClassificatorId: string, userAssignedId: string, userIdResponsible: string) {
        return this.http.post<any>(this.uri + "task/" + idWork, { title: title, description: description, start: start, end: end, taskClassificatorId: taskClassificatorId, userAssignedId: userAssignedId, userIdResponsible: userIdResponsible }).pipe(map(response => {
            return response;
        }))
    }

    deleteTaskClassificator(idWork: string, id: string, userIdResponsible: string) {
        return this.http.delete<any>(this.uri + "taskclassificator/" + idWork + "/" + id + "/" + userIdResponsible).pipe(map(response => {
            return response;
        }))
    }

    deleteTask(id: string, userIdResponsible: string){
        return this.http.delete<any>(this.uri + "task/" + id + "/" + userIdResponsible).pipe(map(response => {
            return response;
        }))   
    }

    updateTaskClassificator(title: string, idTaskClassificator: string, userIdResponsible: string) {
        return this.http.put<any>(this.uri + "taskclassificator/", { _id: idTaskClassificator, title: title, userIdResponsible:userIdResponsible }).pipe(map(response => {
            return response;
        }))
    }

    updateTaskClassificatorsOrder(idWork: string, id: string, newOrder: number) {
        return this.http.put<any>(this.uri + "taskclassificator/order", { _id: id, idWork: idWork, order: newOrder }).pipe(map(response => {
            return response;
        }))
    }

    updateTask(id: string, title: string, description: string, start: Date, end: Date, taskClassificatorId: string, userAssignedId: string, userIdResponsible: string){
        return this.http.put<any>(this.uri + "task/", { _id: id, title: title, description: description, start: start, end: end, taskClassificatorId: taskClassificatorId, userAssignedId: userAssignedId, userIdResponsible: userIdResponsible}).pipe(map(response => {
            return response;
        }))
    }






}
