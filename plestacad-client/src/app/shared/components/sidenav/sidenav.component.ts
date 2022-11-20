import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { ServerSocketsRequestsService } from '../../services/server-sockets.service';
import { WorkRequestService } from '../../services/work.request.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
/** Define el componente de barra lateral de navegación */
export class SidenavComponent implements OnInit {

  /** Envía un evento cuando se hace click en una opción del menú */
  @Output() clickedMenuItem = new EventEmitter<boolean>();
  /** Almacena el número de solicitudes pendientes de incorporación del usuario */
  newWorkRequests: number = 0;

  /** Id del usuario en sesión */
  idUser!: string;
  /** Almacena el número de notificaciones del usuario */
  newNotifications: number = 0;
  constructor(private notificationService: NotificationService, private router: Router, private workRequestService: WorkRequestService, private serverSocketsRequestsService: ServerSocketsRequestsService) {
  }

  ngOnInit(): void {
    this.idUser = sessionStorage.getItem("id") as string;
    //se comprueba inicialmente el numero de solicitudes de incorporación:
    this.workRequestService.getWorkRequestsByUserReceiverId(sessionStorage.getItem('id') as string).subscribe(wRequests => {
      this.newWorkRequests = wRequests.data.length;
    });

    this.notificationService.getNotificationsByUserReceiverId(sessionStorage.getItem('id') as string).subscribe(notifications => {
      this.newNotifications = notifications.data.length;
    });

    this.serverSocketsRequestsService.getNewWorkRequestNotification().subscribe((idUser: string) => {
      if (idUser == sessionStorage.getItem('id') as string) {
        //se deben consultar el numero de request que tiene el usuario y notificar en el icono de la barra

        this.workRequestService.getWorkRequestsByUserReceiverId(sessionStorage.getItem('id') as string).subscribe(wRequests => {
          this.newWorkRequests = wRequests.data.length;
          if (this.router.url == "/solicitudes-trabajos") {
            window.location.reload();
          }

        })

      }
    })

    this.serverSocketsRequestsService.getNewNotification().subscribe((idUser: string) => {

      if (idUser == sessionStorage.getItem('id') as string) {
        this.notificationService.getNotificationsByUserReceiverId(idUser).subscribe(notifications => {
          this.newNotifications = notifications.data.length;
          if (this.router.url == "/notificaciones") {
            window.location.reload();
          }

        })

      }
    })


  }


  /** Envía un evento cuando se hace click en una opción de menú */
  onClickedMenuItem() {
    this.clickedMenuItem.emit(false);
  }


}
