import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "../session/services/authentication.service";
import { UserService } from "../../shared/services/user.service";

@Injectable({
    providedIn: 'root'
})
/**
 * Guard para la comprobación de que un usuario es administrador.
 */
export class AdminGuard implements CanActivate {
    /**
     * Constructor
     * @param userService - servicio de gestión de usuarios.
     * @param router 
     */
    constructor(private userService: UserService, private router: Router) { }
    /**
     * Permite comprobar si un administrador se ha logueado previamente, en caso de que no, redirige a la ruta /login.
     * @param next 
     * @param state 
     * @returns true si el usuario se ha autenticado
     * @return false si el usuario no se ha autenticado.
     */
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise(myRes => {
            this.userService.getUserById(sessionStorage.getItem("id") as string).subscribe({
                next: (serverRes) => {
                    if (serverRes.data.user.isAdmin) {
                        myRes(true)
                    } else {
                        this.router.navigate(['/trabajos']);
                        myRes(false)
                    }
            },
            error: (e) => {
                    this.router.navigate(["/login"])
                    myRes(false)

                }
            })
            
        });
    }
}

