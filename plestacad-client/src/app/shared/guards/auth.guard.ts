import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/modules/session/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Guard para la comprobación de la autenticación previa de un usuario.
 */
export class AuthGuard implements CanActivate {
  /**
   * Constructor
   * @param authenticationService servicio de autenticación
   * @param router 
   */
  constructor(private authenticationService: AuthenticationService, private router: Router) { }
  /**
   * Permite comprobar si un usuario se ha logueado previamente, en caso de que no, redirige a la ruta /login.
   * @param next 
   * @param state 
   * @returns true si el usuario se ha autenticado
   * @return false si el usuario no se ha autenticado.
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authenticationService.isLogged()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
