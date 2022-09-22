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

  getUserById(id: string){
    return this.http.get<any>(this.uri + 'users/' + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateUserPassword(id: string, password: string){
    return this.http.put<any>(this.uri + 'users/updatePassword', {
      id: id,
      password: password
    }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateUserData(id: string, name: string, surname: string){
    return this.http.put<any>(this.uri + 'users/updateData', {
      id: id,
      name: name,
      surname: surname
    }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getPasswordDataByUserId(id: string){
    return this.http.get<any>(this.uri + 'users/passwordData' + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getFullNameById(id: string){
      return this.http.get<any>(this.uri + 'users/fullname/' + id).pipe(
        map((response) => {
          return response;
        })
      );
  }

  getUsersForInvitationByRole(workId: string){
      return this.http.get<any>(this.uri + "users/role/"+workId).pipe(
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

getUserContacts(userId: string){
  return this.http.get<any>(this.uri + 'users/contacts/' + userId).pipe(
    map((response) => {
      return response;
    })
  );
}


uploadProfilePhoto(userId: string, file: any){
    let formData = new FormData();    
    formData.append('upload', file);
    formData.append('userId' , userId)
    console.log(formData)
    return this.http.post(this.uri + 'users/profile-photo', formData);
}

getProfilePhoto(userId: string){
  const options = {
    responseType: 'blob' as const,
  };
  return this.http.get<any>(this.uri + 'users/profile-photo/' + userId, {responseType: 'blob' as 'json'}).pipe(
    map((response) => {
      return response;
    })
    
  );
}




}
