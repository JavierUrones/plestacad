import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { io } from "socket.io-client";
@Injectable({
  providedIn: "root"
})
export class ServerSocketsRequestsService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  socket = io('http://localhost:5200');

  public getNewWorkRequestNotification = () => {
    this.socket.on('workRequest', (message) =>{
      this.message$.next(message);

    });
    
    return this.message$.asObservable();
  };


  public getNewNotification = () => {
    this.socket.on('notification', (message) =>{
      this.message$.next(message);

    });
    
    return this.message$.asObservable();
  };

  public sendVideocallRequest(request: any){
    this.socket.emit('videocall-request', request);
  }

  public getVideocallRequest = () => {
    this.socket.on('videocall-request', (message) =>{
      this.message$.next(message);

    });
    return this.message$.asObservable();

  }




}

