import { EventEmitter, Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { io } from "socket.io-client";
@Injectable({
  providedIn: "root"
})
export class ServerSocketsRequestsService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  socket = io('http://localhost:5200');



  public loginUserSocket(userId: string){
    this.socket.emit('login', userId);

  }


  public getUsersOnline(){
    this.socket.on('users-online', (data) =>{
  
      this.message$.next(data);

    });
    return this.message$.asObservable();

  }


  public sendEndVideocall(request: any){
    this.socket.emit('end-videocall', request);


  }


  public endVideocall(){
    this.socket.on('end-videocall', (data) =>{
  
      this.message$.next(data);

    });
    return this.message$.asObservable();

  }



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

