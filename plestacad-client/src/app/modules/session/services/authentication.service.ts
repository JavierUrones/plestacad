import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:5000/api/auth', {
      username: email,
      password: password,
    });
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  isLogged() {
    const jwtToken = <string>localStorage.getItem("jwt");
    return !this.jwtHelper.isTokenExpired(jwtToken);
  }
}
