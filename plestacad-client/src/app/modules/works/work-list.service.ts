import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Work } from 'src/app/shared/models/work.model';

@Injectable({
  providedIn: 'root'
})
export class WorkListService {
  uri = "http://localhost:5200/api/";
  constructor(private http: HttpClient) { }

  getWorksByUserId(id: string){
    console.log("ID", id)
    return this.http.post<any>(this.uri+"worksByUser", {
      "id": id
    }).pipe(map(response => {
      return response.data
    }));
  }

  getWorksByStudentAndCategory(id: string, category: string){
    return this.http.post<any>(this.uri+"worksByStudentIdAndCategory", {
      "id": id,
      "category": category
    }).pipe(map(response => {
      return response.data
    }));
  }
}
