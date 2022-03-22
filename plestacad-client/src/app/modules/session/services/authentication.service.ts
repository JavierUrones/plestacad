import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserRole } from 'src/app/shared/models/role.enum';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  jwtHelper = new JwtHelperService();
  uri = "http://localhost:5200/api/";

  constructor(private http: HttpClient, private router: Router) {}
  
  login(email: string, password: string) {
    return this.http.post<any>(this.uri+'login', {
      email: email,
      password: password,
    });
  }

  logout() {
    return this.http.get(this.uri+"/logout")
  }

  isLogged() {
    const jwtToken = <string>localStorage.getItem("jwt");
    return !this.jwtHelper.isTokenExpired(jwtToken);
  }

  signup(name: string, surname: string, email:string, password: string, role:UserRole){
    return this.http.post<any>(this.uri+'signup', {
      name: name,
      surname: surname,
      email: email,
      password: password,
      role: role
    });
  }
}
