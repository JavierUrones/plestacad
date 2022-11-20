import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
/** Servicio de login y registro de usuarios */
export class AuthenticationService {
  /** URL de la API */
  uri = environment.apiURL;

  constructor(private http: HttpClient, private router: Router) {}
  
  /**
   * Permite iniciar sesión a un usuario a partir de los valores de los parámetros indicados.
   * @param email  - correo electrónico del usuario
   * @param password - contraseña del usuario
   * @returns Retorna la respuesta del servidor
   */
  login(email: string, password: string) {
    return this.http.post<any>(this.uri+'login', {
      email: email,
      password: password,
    });
  }

  /** Cierra la sesión de un usuario. */
  logout() {
    return this.http.get(this.uri+"logout")
  }

  /** Comprueba si un usuario ha iniciado sesión a partir de la validez del JWT almacenado. */
  isLogged() {
    const jwtToken = localStorage.getItem("jwt") as string;
    if(jwtToken==null){
      return false;
    } else{
      const decoded = jwtDecode<JwtPayload>(jwtToken);
      return decoded.iat! < Date.now();
    }

  }

  /**
   * Registra a un usuario en la aplicación a partir de los valores de los parámetros recibidos.
   * @param name - nombre del usuario
   * @param surname - apellido del usuario
   * @param email - correo electrónico del usuario
   * @param password - contraseña del usuario
   * @returns Retorna la respuesta del servidor.
   */
  signup(name: string, surname: string, email:string, password: string){
    return this.http.post<any>(this.uri+'signup', {
      name: name,
      surname: surname,
      email: email,
      password: password
    });
  }
}
