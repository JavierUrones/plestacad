import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  uri = "http://localhost:5200/api/";
  constructor(private http: HttpClient) { }


  getPostsByWorkId(id: string, optionOrder: string, pageSize:number, pageIndex: number) {
    console.log('ID', id);
    console.log("URL DE CONSULTA", this.uri + 'posts/' + id + "/" + optionOrder + "/" + pageSize + "/" + pageIndex)
    return this.http.get<any>(this.uri + 'posts/' + id + "/" + optionOrder + "/" + pageSize + "/" + pageIndex).pipe(
      map((response) => {
          console.log(response)
        return response;
      })
    );
  }

}
