import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  uri = "http://localhost:5200/api/";

  
  constructor(private http: HttpClient) { }
  getFullNameById(id: string){
      return this.http.get<any>(this.uri + 'users/fullname/' + id).pipe(
        map((response) => {
          return response;
        })
      );
  }


}
