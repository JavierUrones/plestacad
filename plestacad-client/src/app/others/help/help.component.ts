import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ["./help.component.scss"]
})
/** Componente de ayuda al usuario */
export class HelpComponent implements OnInit {
  /** Comprueba si el usuario está en sesión o no */
  sideBarOpen: boolean = true;
  userOnSession!: boolean;
  public secciones: Array<string> = ['primera', 'segunda', 'tercera', 'cuarta', 'quinta'];
  constructor(private router: Router, private route: ActivatedRoute, private viewportScroller: ViewportScroller) {
  }

  /** Carga el valor de userOnSession */
  ngOnInit(): void {
    let user = sessionStorage.getItem("id") as string;
    if (user != undefined) {
      this.userOnSession = true;
    } else {
      this.userOnSession = false;
    }
  }

  /** Redirige a la página de login */
  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

  /** Cierra la barra lateral */
  toggleSideBar(){
    this.sideBarOpen = !this.sideBarOpen;
  }
  /** Redirige a la página de visualización de trabajos académicos */
  navigateToWorks() {
    this.router.navigateByUrl('/trabajos');
  }

  /** Se desplaza a la sección seleccionada
   * @param fragment - sección seleccionada.
   */
  scrollTo(fragment: any): void {
    this.router.navigate([], { fragment: fragment }).then(res => {
      const element = document.getElementById(fragment);
      if (element != undefined){ 
        element.scrollIntoView();
        this.toggleSideBar();

       }
    });
  }
}
