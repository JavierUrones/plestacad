import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { JwtHelperService } from '@auth0/angular-jwt'; //problems with docker-compose
import { UserRole } from 'src/app/shared/models/role.enum';
import { User } from 'src/app/shared/models/user.model';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  //jwtHelper = new JwtHelperService();
  uri = environment.apiURL;

  constructor(private http: HttpClient, private router: Router) {}
  
  login(email: string, password: string) {
    return this.http.post<any>(this.uri+'login', {
      email: email,
      password: password,
    });
  }

  logout() {
    return this.http.get(this.uri+"logout")
  }

  isLogged() {
    const jwtToken = <string>localStorage.getItem("jwt");
    const decoded = jwtDecode<JwtPayload>(jwtToken);
    return decoded.iat! < Date.now();
  }

  signup(name: string, surname: string, email:string, password: string){
    return this.http.post<any>(this.uri+'signup', {
      name: name,
      surname: surname,
      email: email,
      password: password
    });
  }
}
