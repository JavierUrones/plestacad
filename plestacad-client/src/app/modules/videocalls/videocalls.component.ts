import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
import { VideocallsService } from './videocalls.service';
import { Peer } from "peerjs";

@Component({
  selector: 'app-videocalls',
  templateUrl: './videocalls.component.html',
  styleUrls: ['./videocalls.component.scss']
})
export class VideocallsComponent implements OnInit {

    @Input() stream: any;

    roomName: string = "test";
    currentStream: any;
    listUser: Array<any> = [];

    constructor(
      private videocallsService: VideocallsService,
      private serverSocketsRequestsService: ServerSocketsRequestsService
    ) {}
  

    ngOnInit(): void {
      /*this.serverSocketsRequestsService.getVideocallRequest().subscribe((message: any) => {
        if(message.userId==sessionStorage.getItem("id") as string)
            console.log("llega al cliente la llamada final", message);
      })*/
      //this.checkMediaDevices();
      this.initPeer();
      this.initSocket();
    }

    initCall(){
        //this.serverSocketsRequestsService.sendVideocallRequest({ userId: "62c482330ab2c47215272816" })


    }
  
    
      initPeer = () => {
        const {peer} = this.videocallsService;

        peer.on('open', (id: any) => {
            console.log("init peer")

          const body = {
            idPeer: id,
            roomName: this.roomName,
            idUser: "62c482330ab2c47215272816"
          };
          this.serverSocketsRequestsService.joinRoom(body);
        });
    
    
        peer.on('call', (callEnter: any )  => {
          callEnter.answer(this.currentStream);
          callEnter.on('stream', (streamRemote: any) => {
            this.addVideoUser(streamRemote);
          });
        }, (err: any) => {
          console.log('*** ERROR *** Peer call ', err);
        });
      }
    
      initSocket = () => {


        this.serverSocketsRequestsService.getUser().subscribe((res: any) => {
            console.log("lleega res", res)
            if(res.idUser == "62c482330ab2c47215272816"){
                const {idPeer} = res.idPeer;
                this.sendCall(idPeer, this.currentStream);
            }

        })
      }
    
      checkMediaDevices = () => {
        console.log("checkeo de vices")
        if (navigator && navigator.mediaDevices) {
          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
          }).then(stream => {
            this.currentStream = stream;
            this.addVideoUser(stream);
    
          }).catch(() => {
            console.log('*** ERROR *** Not permissions');
          });
        } else {
          console.log('*** ERROR *** Not media devices');
        }
      }
    
      addVideoUser = (stream: any) => {
        this.listUser.push(stream);
        const unique = new Set(this.listUser);
        this.listUser = [...unique];
      }
    
      sendCall = (idPeer: any, stream: any) => {
        const newUserCall = this.videocallsService.peer.call(idPeer, stream);
        if (!!newUserCall) {
          newUserCall.on('stream', (userStream: any) => {
            this.addVideoUser(userStream);
          })
        }
      }


}
