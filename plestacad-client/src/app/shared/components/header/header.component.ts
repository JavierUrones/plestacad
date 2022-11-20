import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/modules/session/services/authentication.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
/**
 * Define el componente de header.
 */
export class HeaderComponent implements OnInit {

  /** Nombre del usuario */
  username: string = ""
  /** Apellido del usuario */
  surname: string = ""
  /** Id del usuario */
  idUser!: string;
  /** Foto de perfil del usuario */
  photoProfile!: any;

  /** Comprueba si el usuario es administrador */
  isAdmin!: boolean;
  /** Envía eventos cuando el botón para mostrar/ocultar la barra lateral se pulsa. */
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(private sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('name') as string;
    this.surname = sessionStorage.getItem('surname') as string;
    this.idUser = sessionStorage.getItem('id') as string;
    this.getProfilePhoto();
    this.userService.getUserById(sessionStorage.getItem("id") as string).subscribe((res) => { if (res.data.user.isAdmin) this.isAdmin = true; else this.isAdmin = false });
  }

  /**
   * Envía un evento para abrir/cerrar la barra lateral de menú.
   */
  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  /**
   * Obtiene la foto de perfil del usuario.
   */
  getProfilePhoto() {
    this.userService.getProfilePhoto(sessionStorage.getItem("id") as string).subscribe((photo) => {
      if (photo.type == "image/jpeg") {
        let objectURL = URL.createObjectURL(photo);
        this.photoProfile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      } else {
        this.photoProfile = undefined;
      }

    })
  }

  /**
   * Desconecta al usuario de sesión.
   */
  logout() {
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('surname');

    this.authenticationService.logout();
    this.router.navigateByUrl("/login")
  }
}
