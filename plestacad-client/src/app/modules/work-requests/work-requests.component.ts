import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { WorkRequest } from 'src/app/shared/models/work.request.model';
import { WorkRequestService } from 'src/app/shared/services/work.request.service';

@Component({
  selector: 'app-work-requests',
  templateUrl: './work-requests.component.html',
  styleUrls: ['./work-requests.component.scss']
})
/** Define el componente de gestión de solicitudes de incorporación a un trabajo académico */
export class WorkRequestsComponent implements OnInit {

  /** Lista de solicitudes de incorporación de un usuario, corresponden a las filas de la tabla donde se muestra el contenido */
  workRequests: MatTableDataSource<WorkRequest> = new MatTableDataSource();
  /** Columnas de la tabla donde se muestran las solicitudes */
  definedColumns: string[] = ['description', 'title', 'userSenderFullname', 'date', "options"];
  /** Atributo que determina cuando se están cargando las solicitudes de incorporación desde el servidor */
  loading!: boolean;
  constructor(private workRequestsService: WorkRequestService) { }

  ngOnInit(): void {
    this.loading = true;
    this.workRequestsService.getWorkRequestsWithInfoByUserReceiverId(sessionStorage.getItem("id") as string).subscribe(workRequests => {
      this.workRequests.data = workRequests.data;
      this.loading = false;
    })
  }

  /** Se dispara cuando el usuario acepta una solicitud de incorporación. Llama al servicio necesario para incorporar al usuario al trabajo académico pasándole los datos de lasolicitud.
   * @param element - datos de la solicitud de incorporación
   */
  acceptWorkRequest(element: any) {
    this.workRequestsService.acceptWorkRequest(element._id, element.userIdReceiver, element.workId, element.description).subscribe(res => {
      this.ngOnInit();

    })
  }

  /**
   * Se dispara cuando el usuario rechaza una solicitud de incorporación. Llama al servicio necesario para eliminar dicha solicitud sin incorporar al usuario al trabajo académico.
   * @param element - datos de la solicitud de incorporación
   */
  denyWorkRequest(element: any) {
    this.workRequestsService.denyWorkRequest(element._id, element.userIdReceiver).subscribe(res => {
      this.ngOnInit();
    })

  }

}
