import { Injectable } from '@angular/core';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
import { environment } from 'src/environments/environment';
import { Peer } from "peerjs";

@Injectable({
    providedIn: 'root',
})
/** Servicio de gestión de videollamadas */
export class VideocallsService {

    /** Peer de la libreria peerjs */
    peer = new Peer();
    /** Id del peer en videollamada */
    idPeer: any;

    /** Stream que contiene los recursos de audio y video del usuario a compartir en la videollamada */
    myStream: any;
    /** Lista de streams de la videollamada que se visualizan, contiene el stream de ambos usuarios en videollamada. */
    userListStream: any = [];

    /** Videollamada en curso */
    currentCall: any;
    /** Atributo que comprueba si hay una videollamada en curso */
    onCall!: boolean;


    /** Id del usuario con el que se está en videollamada */
    idUserOnCall!: string;
    /** Nombre del usuario con el que se está en videollamada */
    userNameOnCall!: string;

    /** Listener que escucha las posibles llamadas entrantes del usuario */
    entryCallListener: any;


    constructor(private serverSocketsRequestsService: ServerSocketsRequestsService) {
        this.initializeEntryCallListener();
    }


    /** Inicializa la conexión (llamada) entre pares mediante las funciones de la libreria peerjs. */
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

    /**
     * Añade un stream a la lista de streams del usuario.
     * @param stream - stream del propio usuario o del usuario en llamada
     */
    addStreamToUserList(stream: any) {
        this.userListStream.push(stream);
        const uniqueList = new Set(this.userListStream); //Para evitar repetidos en la lista.
        this.userListStream = [...uniqueList];
    }

    /** Inicializa los recursos de audio y vídeo de videollamada solicitando los permisos necesarios al usuario */
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

    /**
     * Esta función pone en marcha la llamada entre los usuarios mediante la función call de peerjs.
     * @param idPeer - id del "par" con el que se establece la llamada
     * @param stream - recursos de audio y vídeo del "par" con el que se establece la llamada
     */
    sendCallToPeer(idPeer: any, stream: any) {
        this.onCall = true;
        this.currentCall = this.peer.call(idPeer, stream).on('stream', (userStream: any) => {
            this.addStreamToUserList(userStream);
        });
    }


    /**
     * Inicializa el atributo que escucha llamadas entrantes desde el servicio de sockets.
     */
    initializeEntryCallListener() {
        this.entryCallListener = this.serverSocketsRequestsService.getVideocallRequest();
    }


}




