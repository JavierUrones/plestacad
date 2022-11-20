import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryCallDialogComponent } from 'src/app/modules/videocalls/entry-call-dialog/entry-call-dialog.component';
import { VideocallsComponent } from 'src/app/modules/videocalls/videocalls.component';
import { VideocallsService } from 'src/app/modules/videocalls/videocalls.service';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
/** Define el componente Main que establece el layout de la aplicación */
export class MainComponent implements OnInit {
  /** Atributo que comprueba si la barra lateral está abierta o no */
  sideBarOpen = true;
  /** Atributo que comprueba si se debe mostrar el contenido principal de la aplicación en ese momento. Se pone a false cuando la pantalla es muy pequeña y está abierta la barra lateral de navegación */
  showContent = true;

  /** Establece la suscripción para notificar llamadas entrantes. */
  entryCallSubscription: any;

  isAdmin: boolean = false;

  constructor(private userService: UserService, public dialog: MatDialog, private serverSocketsRequestsService: ServerSocketsRequestsService, private router: Router, private route: ActivatedRoute, private videocallsService: VideocallsService) {

  }

  ngOnInit(): void {
    this.showContent = true;
    this.serverSocketsRequestsService.loginUserSocket(sessionStorage.getItem("id") as string);
    this.videocallsService.initializePeer();

    this.userService.getUserById(sessionStorage.getItem("id") as string).subscribe((res) => {
      if(res.data.user.isAdmin){
        this.isAdmin = true;
      } else{
        this.isAdmin = false;

      }
    })
    this.entryCallSubscription = this.videocallsService.entryCallListener.subscribe((res: any) => {
      console.log("LLEGA PETICION", res)
      if (res.idPeer != undefined && res.idUserDestiny == sessionStorage.getItem("id") as string) {

        this.router.navigateByUrl('/videollamadas?entryCall=true&idPeer=' + res.idPeer + "&idUserOrigin=" + res.idUserOrigin + "&idUserDestiny=" + res.idUserDestiny + "&userNameOrigin=" + res.userNameOrigin);
      }
    })
    navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  }


  /** Abre y cierra la barra lateral de opciones */
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  /** Se dispara cuando el usuario pulsa sobre una de las opciones de la barra lateral.
   * @param event - datos del evento disparado
   */
  onClickedMenuItem(event: any) {
    this.sideBarOpen = false;
    this.showContent = true;
  }


  /** Determina si se debe mostrar o no el contenido principal dependiendo del tamaño de la pantalla del usuario y de si está abierta o cerrada la barra lateral de opciones.
   * @event - datos del evento disparado.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 900) {
      if (this.sideBarOpen) {
        this.showContent = false;
      } else {
        this.showContent = true;
      }
    } else {
      this.showContent = true;
    }
  }

  /** Se desuscribe de la la suscripción de videollamadas entrantes cuando el componente es destruido. */
  ngOnDestroy() {
    this.entryCallSubscription.unsubscribe();
  }




}
