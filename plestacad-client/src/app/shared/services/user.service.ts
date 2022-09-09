import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';
import { UserRole } from '../models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  uri =  environment.apiURL;

  
  constructor(private http: HttpClient) { }
  getFullNameById(id: string){
      return this.http.get<any>(this.uri + 'users/fullname/' + id).pipe(
        map((response) => {
          return response;
        })
      );
  }

  getUsersByRole(role: string){
      return this.http.get<any>(this.uri + "users/role/"+role).pipe(
        map((response) => response.data.map((x: { _id: string, name: string; surname: string; role: UserRole; email: string;}) => {
          console.log("EO")
          var user = new User();
          user.name = x.name;
          user.surname = x.surname;
          //user.role = x.role;
          user.email = x.email;
          user._id = x._id;
          return user;
         }))
      )
  }

  getUserByEmail(email: string){
    return this.http.get<any>(this.uri + "users/email/"+email).pipe(
      map((response) => response.data.map((x: { _id: string, name: string; surname: string; role: UserRole; email: string;}) => {
        console.log("EO")
        var user = new User();
        user.name = x.name;
        user.surname = x.surname;
        //user.role = x.role;
        user.email = x.email;
        user._id = x._id;
        return user;
       }))
    )
}


}
