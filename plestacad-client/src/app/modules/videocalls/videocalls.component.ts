import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
import { VideocallsService } from './videocalls.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EntryCallDialogComponent } from './entry-call-dialog/entry-call-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-videocalls',
    templateUrl: './videocalls.component.html',
    styleUrls: ['./videocalls.component.scss']
})
/** Componente de gestión de las videollamadas */
export class VideocallsComponent implements OnInit {
    /** Lista de contactos del usuario, su contenido es sensible al buscador por nombre del componente. */
    contacts: any = [];
    /** Lista de todos los contactos del usuario, su contenido no varía. */
    allContacts: any = [];

    /** Suscripción para notificar llamadas entrantes. */
    entryCallSubscription: any;
    /**
     * Constructor
     * @param videocallsService - servicio de videollamadas
     * @param serverSocketsRequestsService - servicio de sockets
     * @param userService - servicio de usuarios
     * @param dialog  - dialogo de llamada entrante
     * @param router 
     * @param route 
     * @param sanitizer 
     */
    constructor(
        public videocallsService: VideocallsService,
        private serverSocketsRequestsService: ServerSocketsRequestsService,
        private userService: UserService,
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) { }
    ngOnInit(): void {

        this.serverSocketsRequestsService.loginUserSocket(sessionStorage.getItem("id") as string);
        //this.videocallsService.initializePeer();
        this.route.queryParamMap.subscribe((param) => {
            if (param.get("entryCall")) {
                let res = { idPeer: param.get("idPeer"), idUserOrigin: param.get("idUserOrigin"), idUserDestiny: param.get("idUserDestiny"), userNameOrigin: param.get("userNameOrigin") }
                this.initializeCallsEntry(res);
            }
        })
        this.getStatusOfUsers();
        this.getUserContactsAndStatus();
        this.initializeCallsEndListener();
    }

    /** Obtiene los contactos del usuario junto a su estado (en línea o desconectado) */
    getUserContactsAndStatus() {
        this.userService.getUserContacts(sessionStorage.getItem("id") as string).subscribe((contacts) => {
            this.allContacts = contacts.data;
            this.getStatusOfUsers();
        })
    }

    /** Obtiene el estado de los usuarios de la aplicación. */
    getStatusOfUsers() {
        this.serverSocketsRequestsService.getUsersOnline().subscribe((response: any) => {
            let usersOnline: any = [];
            if (Symbol.iterator in Object(response)) {
                for (let user of (new Map(response))) {
                    usersOnline.push(user[1]); //el id del usuario
                }
                this.allContacts.forEach((contact: any) => {
                    if (usersOnline.includes(contact._id)) {
                        contact.isOnline = true;
                    } else {
                        contact.isOnline = false;
                    }
                })
                this.allContacts.sort((a: any, b: any) => b.isOnline - a.isOnline);
                this.allContacts.forEach((contact: any) => {
                    this.userService.getProfilePhoto(contact._id).subscribe((photo) => {
                        if (photo.type == "image/jpeg") {
                            let objectURL = URL.createObjectURL(photo);
                            contact.photo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                        } else {
                            contact.photo = undefined;
                        }
                    })
                })
                this.contacts = this.allContacts;


            }
        })
    }

    /**
     * Se dispara cuando el usuario usa el filtro de buscar por nombre sus contactos.
     * @param event - datos del evento de búsqueda
     */
    onSearch(event: any) {
        if (event.value == "") {
            this.contacts = this.allContacts;
        } else {
            this.contacts = this.allContacts.filter((contact: any) =>
                contact.name.startsWith(event.value)
            )
        }

    }

    /**
     * Se dispara cuando el usuario intenta llamar a uno de sus contactos en línea.
     * Se encarga de inicializar los dispositivos de audio y video del usuario y de, mediante sockets, enviar la notificación de llamada entrante a su contacto. 
     * @param userId - id del usuario que se va a llamar
     */
    initCall(userId: string) {

        this.videocallsService.onCall = true;
        this.videocallsService.initializeVideoAudioDevices();
        this.videocallsService.idUserOnCall = userId;
        const body = {
            idPeer: this.videocallsService.idPeer,
            idUserOrigin: sessionStorage.getItem("id") as string,
            userNameOrigin: sessionStorage.getItem("name") as string,
            idUserDestiny: userId
        };
        this.userService.getFullNameById(userId).subscribe((response: any) => {
            this.videocallsService.userNameOnCall = response.data.fullname;
        })
        this.serverSocketsRequestsService.sendVideocallRequest(body)
    }

    /** Esta función gestiona una llamada entrante. Se encarga de determinar si la llamada va dirigida al usuario y de abrir el diálogo de llamada entrante.
     * Si el usuario acepta la llamada, se inicializan sus recuros de audio y video y el resto de atributos necesarios de la llamada y se notifica la respuesta a la llamada mediante el servicio de videollamadas.
     * @param res - contiene los datos de la llamada entrante.
     */

     initializeCallsEntry(res: any) {
        if (res.idPeer != undefined && res.idPeer != this.videocallsService.idPeer && res.idUserDestiny == sessionStorage.getItem("id") as string) {
            this.dialog.open(EntryCallDialogComponent, {
                data: {message: "¡Estás recibiendo una llamada entrante de " + res.userNameOrigin + "!", idUser: res.idUserOrigin
            },
            }).afterClosed().subscribe((confirm: boolean) => {
                if (confirm) {

                    if (this.videocallsService.myStream == undefined) {
                        if (navigator && navigator.mediaDevices) {
                            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                                this.videocallsService.myStream = stream;
                                this.videocallsService.addStreamToUserList(stream);
                                this.videocallsService.idUserOnCall = res.idUserOrigin;
                                this.videocallsService.onCall = true;
                                this.userService.getFullNameById(res.idUserOrigin).subscribe((response: any) => {
                                    this.videocallsService.userNameOnCall = response.data.fullname;
                                });
                                this.videocallsService.sendCallToPeer(res.idPeer, this.videocallsService.myStream);

                            }).catch(() => {
                                console.log('No permissions to access audio/video devices.');
                            });
                        } else {
                            console.log('Not exists audio/video devices.');
                        }

                    }
                }
                else {
                    const body = {
                        idPeer: this.videocallsService.idPeer,
                        idUser: sessionStorage.getItem("id") as string
                    }
                    this.serverSocketsRequestsService.sendEndVideocall(body);
                    
                    this.router.navigate(
                        [], 
                        {
                          relativeTo: this.route,
                          queryParams: {}
                        });
                        window.location.replace(location.pathname);
                }
            })
        }

    }

    /** Esta función se dispara cuando el contacto con el que el usuario está en llamada la finaliza. Se encarga de cerrar la llamada actual y de reiniciar todos los atributos necesraios. */
    initializeCallsEndListener() {
        this.serverSocketsRequestsService.endVideocall().subscribe((response: any) => {
            if (this.videocallsService.currentCall != undefined) {
                if (this.videocallsService.currentCall.peer == response.idPeer) {
                    this.videocallsService.currentCall.close();
                    this.router.navigate(
                        [],
                        {
                            relativeTo: this.route,
                            queryParams: {}
                        });
                    window.location.replace(location.pathname);

                }
            }
            if (this.videocallsService.currentCall == undefined && response[1] != undefined && response[1][1] == this.videocallsService.idUserOnCall) {
                this.router.navigate(
                    [],
                    {
                        relativeTo: this.route,
                        queryParams: {}
                    });
                window.location.replace(location.pathname);

            }



        });
    }

    /** Esta función se dispara cuando el usuario termina la llamada en curso. Se encarga de enviar el socket de llamada finalizada al otro usuario y de reniciar los atributos necesarios. */
    endCall() {
        const body = {
            idPeer: this.videocallsService.idPeer
        }
        this.serverSocketsRequestsService.sendEndVideocall(body);
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: {}
            });
        window.location.replace(location.pathname);


    }

    /** Deja de compartir audio en la videollamada en curso. */
    muteAudio() {
        if (this.videocallsService.userListStream[0].getAudioTracks()[0].enabled) {
            this.videocallsService.userListStream[0].getAudioTracks()[0].enabled = false;
        } else {
            this.videocallsService.userListStream[0].getAudioTracks()[0].enabled = true;

        }

    }

    /** Deja de compartir la señal de vídeo en la videollamda en curso. */
    stopVideo() {
        if (this.videocallsService.userListStream[0].getVideoTracks()[0].enabled) {
            this.videocallsService.userListStream[0].getVideoTracks()[0].enabled = false;
        } else {
            this.videocallsService.userListStream[0].getVideoTracks()[0].enabled = true;

        }
    }

    /** Se ejecuta cunado se destruye el componente de videollamada. Cuelga la videollamada en curso si el usuario navega a otra parte de la aplicación. */
    ngOnDestroy() {
        if (this.videocallsService.onCall) {
            this.endCall();
        }
    }


}
