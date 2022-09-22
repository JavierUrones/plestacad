import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserRole } from 'src/app/shared/models/role.enum';
import { Work } from 'src/app/shared/models/work.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkListService {


  uri = environment.apiURL;
  constructor(private http: HttpClient) { }

  getWorksByUserId(id: string) {
    console.log("ID", id)
    return this.http.post<any>(this.uri + "worksByUser", {
      "id": id
    }).pipe(map(response => {
      return response.data
    }));
  }

  generateWorkRequests(workId: string, userIdResponsible: string, teachers: any, students: any) {
    let body = {
      userIdResponsible: userIdResponsible, workId: workId, teachers: teachers, students: students
    }
    return this.http.post<any>(this.uri + "workRequests", body).pipe(map(response => {
      return response
    }));
  }

  getWorksByStudentAndCategory(id: string, category: string) {
    return this.http.post<any>(this.uri + "worksByUserIdAndCategory", {
      "id": id,
      "category": category,
      "role": sessionStorage.getItem("role") as string
    }).pipe(map(response => {
      return response.data
    }));
  }


  getWorkById(id: string) {
    return this.http.get<any>(this.uri + "works/" + id).pipe(map(response => { return response; }))
  }

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


  deleteUserFromWork(workId: string, userId: string, type: string){
    return this.http.put<any>(this.uri + "works/deleteUser", {
      userId: userId,
      workId: workId,
      type: type
    }).pipe(map(response => {
      return response;
    }));
  }

  deleteWork(workId: string){
    return this.http.delete<any>(this.uri + "works/" + workId).pipe(map(response => {
      return response;
    }))
  }

  updateWork(workId: string, title: string, description: string, course: number, category: string){
    return this.http.put<any>(this.uri + "works/", { workId: workId, title: title, description: description, course: course, category: category}).pipe(map(response => {
      return response;
    }))
  }

  setWorkAsClassified(workId: string){
    return this.http.put<any>(this.uri + "works/", { workId: workId, classified: true}).pipe(map(response => {
      return response;
    }))
  }

  setWorkAsDesclassified(workId: string){
    return this.http.put<any>(this.uri + "works/", { workId: workId,classified: false}).pipe(map(response => {
      return response;
    }))
  }


}
