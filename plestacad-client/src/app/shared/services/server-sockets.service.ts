import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { io } from "socket.io-client";
@Injectable({
  providedIn: "root"
})
/**
 * Servicio que se encarga de gestionar los WebSockets que recibe y envía el cliente.
 */
export class ServerSocketsRequestsService {
  /**
   * Mensaje enviado en los sockets.
   */
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  socket = io('http://localhost:5200');
  // socket = io(); //for deployment


  /**
   * Envía un socket cuando el usuario entra en sesión.
   * @param userId id del usuario a enviar.
   */
  public loginUserSocket(userId: string) {
    this.socket.emit('login', userId);

  }



  /**
   * Envía un socket para consultar la lista de usuarios online.
   * @returns la lista de los usuarios recibidos.
   */
  public getUsersOnline() {
    this.socket.on('users-online', (data) => {

      this.message$.next(data);

    });
    return this.message$.asObservable();

  }

  /**
   * Envía un socket al usuario para indicar que la llamada en curso ha terminado.
   * @param request la información de la llamada
   */
  public sendEndVideocall(request: any) {
    this.socket.emit('end-videocall', request);


  }


  /**
   * Recibe el socket de llamada terminada.
   * @returns el mensaje recibido en el socket.
   */
  public endVideocall() {
    this.socket.on('end-videocall', (data) => {

      this.message$.next(data);

    });
    return this.message$.asObservable();

  }
  /**
   * Gestiona el socket que indica que ha llegado una nueva solicitud de incorporación a trabajo académico.
   * @returns el mensaje recibido en el socket.
   */
  public getNewWorkRequestNotification = () => {
    this.socket.on('workRequest', (message) => {
      this.message$.next(message);

    });

    return this.message$.asObservable();
  };

  /**
     * Gestiona el socket que indica que ha llegado una nueva notificación.
     * @returns el mensaje recibido en el socket.
     */
  public getNewNotification = () => {
    this.socket.on('notification', (message) => {
      this.message$.next(message);

    });

    return this.message$.asObservable();
  };

  /**
   * Envía el socket para iniciar una videollamada con otro usuario.
   * @param request la información de la videollamada
   */
  public sendVideocallRequest(request: any) {
    this.socket.emit('videocall-request', request);
  }


  /**
    * Recibe el socket de llamada iniciada.
    * @returns el mensaje recibido en el socket.
    */
  public getVideocallRequest = () => {
    this.socket.on('videocall-request', (message) => {

      this.message$.next(message);

    });
    return this.message$.asObservable();

  }








}

