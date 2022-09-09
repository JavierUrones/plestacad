import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = <string>localStorage.getItem("jwt");

    if (!jwtToken) {
      return next.handle(req);
    }

    const _req = req.clone({
      headers: req.headers.set('access-token', `${jwtToken}`),
    });
    return next.handle(_req);
  }

}