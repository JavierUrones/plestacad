import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ["./contact.component.scss"]
})
/** Define el componente de la página de contacto de la web */
export class ContactoComponent implements OnInit {
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
  /** Comprueba si el usuario está en sesión */
  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }
  /** Redirige a la página de login */
  navigateToWorks() {
    this.router.navigateByUrl('/trabajos');
  }
}