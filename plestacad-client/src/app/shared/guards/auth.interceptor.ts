import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/modules/session/services/authentication.service';

/** Guard para interceptar las peticiones realizadas a la API */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService){

  }
  /** Intercepta la petición enviada a la API y le añade la cabecera "access-token" con el valor del jwt del usuario en sesión.
   * @param req - petición a la API
   * @param next - handler http
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const idUser = sessionStorage.getItem("id") as string;

    if(idUser==null){
      localStorage.removeItem('jwt');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('id');
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('surname');
      this.authenticationService.logout();
    }
    let jwtToken = <string | undefined >localStorage.getItem("jwt");


    if (!jwtToken) {
      return next.handle(req);
    }

    const _req = req.clone({
      headers: req.headers.set('access-token', `${jwtToken}`),
    });
    return next.handle(_req);
  }

}