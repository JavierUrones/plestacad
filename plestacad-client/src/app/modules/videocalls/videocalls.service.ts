import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
import { environment } from 'src/environments/environment';
import { Peer } from "peerjs";

@Injectable({
  providedIn: 'root',
})
export class VideocallsService {
  uri = environment.apiURL;
  peer : any;
  constructor(private http: HttpClient, private serverSocketsRequestsService: ServerSocketsRequestsService) {
    this.peer = new Peer();
    }
  }


  

