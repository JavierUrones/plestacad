import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
/**
 * Servicio para gestionar las notificaciones del sistema.
 */
export class NotificationService {
    /**
     * URL de la API
     */
    uri = environment.apiURL;


    constructor(private http: HttpClient) { }


    /**
     * Permite obtener las notificaciones relativas a un usuario.
     * @param id id del usuario
     * @returns la respuesta del servidor
     */
    getNotificationsByUserReceiverId(id: string) {
        return this.http.get<any>(this.uri + 'notification/receiver/' + id).pipe(
            map((response) => {
                return response;
            })
        );
    }


    /**
     * Marca como leído una notificación.
     * @param notificationId id de la notificación
     * @param userIdReceiver id del usuario receptor de la notificación
     * @returns la respuesta del servidor
     */
    markAsRead(notificationId: string, userIdReceiver: string) {
        return this.http.post<any>(this.uri + 'notification/markAsRead', { notificationId: notificationId, userIdReceiver: userIdReceiver }).pipe(
            map((response) => {
                return response;
            })
        );

    }


}
