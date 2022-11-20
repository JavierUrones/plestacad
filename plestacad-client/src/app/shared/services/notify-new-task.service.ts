import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
/**
 * Servicio que permite notificar entre componentes cuando se produce una actualización en una tarea.
 */
export class NotifyNewTaskService {
  /**
   * Permite suscribirse para recibir un evento cuando una tarea es modificada.
   */
  subjectNotifier: Subject<null> = new Subject<null>();
 
  /**
   * Constructor del servicio
   */
  constructor() { }
 
  /**
   * Notifica un cambio en una tarea.
   */
  notifyChangeTask() {
    this.subjectNotifier.next(null);
  }
}
 