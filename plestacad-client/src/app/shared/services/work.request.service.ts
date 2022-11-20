import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
/**
 * Servicio de gestión de solicitudes pendientes de incorporación a trabajos académicos.
 */
export class WorkRequestService {
    /**
     * URL de la API
     */
    uri = environment.apiURL;


    constructor(private http: HttpClient) { }

    /**
     * Obtiene la lista de solicitudes pendientes de incorporación pertenecientes a un usuario.
     * @param id id del suuario
     * @returns respuesta del servidor
     */
    getWorkRequestsByUserReceiverId(id: string) {
        return this.http.get<any>(this.uri + 'workRequestsByUserReceiverId/' + id).pipe(
            map((response) => {
                return response;
            })
        );
    }

    /**
     * Obtiene la lista de solicitudes de incorporación de un usuario con información extra.
     * @param id id del usuario 
     * @returns respuesta del servidor
     */
    getWorkRequestsWithInfoByUserReceiverId(id: string) {
        return this.http.get<any>(this.uri + 'workRequestsWithInfoByUserReceiverId/' + id).pipe(
            map((response) => {
                return response;
            })
        );
    }

    /**
     * Acepta una solicitud de incorporación a un trabajo académico.
     * @param id id de la solicitud.
     * @param userIdReceiver id del usuario que recibe la solicitud.
     * @param workId id del trabajo académico
     * @param role rol del usuario en el trabajo académico
     * @returns la respuesta del servidor
     */
    acceptWorkRequest(id: string, userIdReceiver: string, workId: string, role: string) {
        return this.http.post<any>(this.uri + "/worksRequests/accept", {
            id: id,
            userIdReceiver: userIdReceiver,
            workId: workId,
            role: role
        }).pipe(
            map((response) => {
                return response;
            })
        );
    }

    /**
     * Rechaza una solicitud de incorporación a trabajo académico
     * @param id id de la solicitud
     * @param userIdReceiver id del usuario que rechaza la solicitud 
     * @returns la respuesta del servidor
     */
    denyWorkRequest(id: string, userIdReceiver: string) {
        return this.http.delete<any>(this.uri + "/worksRequests/deny/" + id + "/" + userIdReceiver).pipe(map(res => {
            return res;
        }))
    }
}
