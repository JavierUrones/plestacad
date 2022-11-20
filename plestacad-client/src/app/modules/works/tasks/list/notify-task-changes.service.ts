import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
 
/** Servicio que notifica entre componentes la actualización o creación de tareas */
@Injectable({
  providedIn: 'root'
})
export class NotifyTaskChangesService {
  /** Se encarga de ofrecer la suscripción que notifica de nuevos cambios en las tareas */
  subjectNotifier: Subject<null> = new Subject<null>();
 
  constructor() { }
 
  /** Se encarga de notificar los nuevos cambios en las tareas */
  notifyChangeTask() {
    this.subjectNotifier.next(null);
  }
}
 