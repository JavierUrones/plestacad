import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
import { environment } from 'src/environments/environment';
import { Peer } from "peerjs";
import { EntryCallDialogComponent } from './entry-call-dialog/entry-call-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class VideocallsService {
    uri = environment.apiURL;

    peer = new Peer();
    idPeer: any;

    myStream: any;
    userListStream: any = [];

    currentCall: any;
    onCall!: boolean;


    idUserOnCall!: string;
    userNameOnCall!: string;


    entryCallListener: any;


    constructor(private http: HttpClient, private serverSocketsRequestsService: ServerSocketsRequestsService) {
        this.initializeEntryCallListener();
    }


    initializePeer() {
        this.peer.on('open', (id: any) => {
            this.idPeer = id;

        });

        this.peer.on('call', (entryCall: any) => {


            entryCall.answer(this.myStream);
            this.currentCall = entryCall;

            entryCall.on('stream', (remoteStream: any) => {

                this.addStreamToUserList(remoteStream);
            });
        }, (error: any) => {
            console.log('Error', error);
        });

    }

    addStreamToUserList(stream: any) {
        this.userListStream.push(stream);
        const uniqueList = new Set(this.userListStream); //Para evitar repetidos en la lista.
        this.userListStream = [...uniqueList];
    }

    initializeVideoAudioDevices() {

        if (navigator && navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                this.myStream = stream;
                this.addStreamToUserList(stream);

            }).catch(() => {
                console.log('No permissions to access audio/video devices.');
            });
        } else {
            console.log('Not exists audio/video devices.');
        }
    }

    sendCallToPeer(idPeer: any, stream: any){
        this.onCall = true;
        this.currentCall = this.peer.call(idPeer, stream).on('stream', (userStream: any) => {
            this.addStreamToUserList(userStream);
        });
    }


    initializeEntryCallListener(){
        this.entryCallListener =  this.serverSocketsRequestsService.getVideocallRequest();
    }


}




