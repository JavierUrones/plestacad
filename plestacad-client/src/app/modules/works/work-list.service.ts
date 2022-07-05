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

  getWorksByUserId(id: string, roleUser: string){
    console.log("ID", id)
    return this.http.post<any>(this.uri+"worksByUser", {
      "id": id,
      "role": roleUser
    }).pipe(map(response => {
      return response.data
    }));
  }

  getWorksByStudentAndCategory(id: string, category: string){
    return this.http.post<any>(this.uri+"worksByUserIdAndCategory", {
      "id": id,
      "category": category,
      "role": sessionStorage.getItem("role") as string
    }).pipe(map(response => {
      return response.data
    }));
  }


    getWorkById(id: string){
    return this.http.get<any>(this.uri+"works/"+id).pipe(map(response => { return response;}))
  }

  createWork(authorId: string | null, title: string, description: string, category: string, course: number, teachers: any[]) {
    return this.http.post<any>(this.uri+"works", {
      authorId: authorId,
      title: title,
      description: description,
      category: category,
      course: course,
      teachers: teachers
    })
  }


}
