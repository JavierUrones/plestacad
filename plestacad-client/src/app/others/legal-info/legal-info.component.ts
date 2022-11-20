import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-info',
  templateUrl: './legal-info.component.html',
  styleUrls: ["./legal-info.component.scss"]
})
/** Componente de información legal al usuario */
export class LegalInfoComponent implements OnInit {
  /** Comprueba si el usuario está en sesión o no */
  userOnSession!: boolean;

  constructor(private router: Router) {
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


  /** Redirige a la página de visualización de trabajos académicos */
  navigateToWorks() {
    this.router.navigateByUrl('/trabajos');
  }
}
