import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
import { VideocallsService } from './videocalls.service';
import { Peer } from "peerjs";
import { UserService } from 'src/app/shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EntryCallDialogComponent } from './entry-call-dialog/entry-call-dialog.component';

@Component({
    selector: 'app-videocalls',
    templateUrl: './videocalls.component.html',
    styleUrls: ['./videocalls.component.scss']
})
export class VideocallsComponent implements OnInit {

    onCall!: boolean;
    stream: any;

    roomName: string = "test";
    currentStream: any;
    listUser: Array<any> = [];

    contacts: any = [];
    allContacts: any = [];
    usersBusy: any = [];
    peer = new Peer();
    idPeer: any;


    currentCall!: any;
    idUserOnCall!: string;
    constructor(
        private videocallsService: VideocallsService,
        private serverSocketsRequestsService: ServerSocketsRequestsService,
        private userService: UserService,
        public dialog: MatDialog
    ) { }


    ngOnInit(): void {


        this.peer = new Peer();
        this.initSocket();
        this.initPeer();
        this.serverSocketsRequestsService.loginUserSocket(sessionStorage.getItem("id") as string);
        this.getStatusOfUsers();
        this.getUserContactsAndStatus();

        this.serverSocketsRequestsService.endVideocall().subscribe((response: any) => {
            if (this.currentCall != undefined) {
                console.log("llega peticion cerrar llamada", this.currentCall.peer, response.idPeer)
                if (this.currentCall.peer == response.idPeer){
                    this.listUser = [];

                    this.currentCall.close();
                    this.onCall = false;
                    window.location.reload();
                }


            }
        });



    }

    getUserContactsAndStatus() {
        this.userService.getUserContacts(sessionStorage.getItem("id") as string).subscribe((contacts) => {
            this.allContacts = contacts.data;
            this.getStatusOfUsers();
        })
    }

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
                this.contacts = this.allContacts;

            }
        })
    }

    onSearch(event: any) {
        if (event.value == "") {
            this.contacts = this.allContacts;
        } else {
            this.contacts = this.allContacts.filter((contact: any) =>
                contact.name.startsWith(event.value)
            )
        }

    }
    initCall(userId: string) {


        console.log("init call")
        this.onCall = true;
        this.checkMediaDevices();

        const body = {
            idPeer: this.idPeer,
            roomName: this.roomName,
            idUserOrigin: sessionStorage.getItem("id") as string,
            userNameOrigin: sessionStorage.getItem("name") as string,
            idUserDestiny: userId

        };
        this.serverSocketsRequestsService.sendVideocallRequest(body)

        //emitir estado de "ocupado"
        // this.serverSocketsRequestsService.sendUserStateBusy({idUser: sessionStorage.getItem("id") as string, idPeer: this.idPeer})


    }



    initPeer = () => {
        this.peer.on('open', (id: any) => {
            this.idPeer = id;

        });

        this.peer.on('call', (callEnter: any) => {


            callEnter.answer(this.currentStream);
            this.currentCall = callEnter;

            callEnter.on('stream', (streamRemote: any) => {

                this.addVideoUser(streamRemote);
            });
        }, (err: any) => {
            console.log('*** ERROR *** Peer call ', err);
        });

    }
    initSocket = () => {


        this.serverSocketsRequestsService.getVideocallRequest().subscribe((res: any) => {

            if (res.idPeer != undefined && res.idPeer != this.idPeer && res.idUserDestiny == sessionStorage.getItem("id") as string) {
                this.dialog.open(EntryCallDialogComponent, {
                    data: "¡Estás recibiendo una llamada entrante de " + res.userNameOrigin + "!"
                }).afterClosed().subscribe((confirm: boolean) => {
                    if (confirm) {
                        if (this.currentStream == undefined) {
                            if (navigator && navigator.mediaDevices) {
                                navigator.mediaDevices.getUserMedia({
                                    audio: false,
                                    video: true
                                }).then(stream => {
                                    this.currentStream = stream;

                                    this.addVideoUser(stream);
                                    const idPeer = res.idPeer;
                                    this.idUserOnCall = res.idUserOrigin;
                                    this.sendCall(res.idUserDestiny, idPeer, this.currentStream);

                                }).catch(() => {
                                    console.log('*** ERROR *** Not permissions');
                                });
                            } else {
                                console.log('*** ERROR *** Not media devices');
                            }
                        }
                    } else {
                        this.onCall = false;

                        //emitir mensaje al otro usuario para cancelar la llamada que ha iniciado y dejar de compartir recursos.
                        const body = {
                            idPeer: this.idPeer,
                            idUserOrigin: res.idUserOrigin,
                            userNameOrigin: res.userNameOrigin,
                            idUserDestiny: res.idUserDestiny

                        };
                        this.serverSocketsRequestsService.sendEndVideocall(body);

                    }
                })
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
                console.log("activando la camara", this.currentStream)
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

    sendCall = (idUser: string, idPeer: any, stream: any) => {
        this.onCall = true;

        this.currentCall = this.peer.call(idPeer, stream).on('stream', (userStream: any) => {

            this.addVideoUser(userStream);
        });
    }

    endCall() {
        const body = {
            idPeer: this.idPeer
        }
        this.serverSocketsRequestsService.sendEndVideocall(body);
        this.listUser = [];
        this.currentCall.close();
        this.onCall = false;
        window.location.reload();

        /**/
        //this.serverSocketsRequestsService.sendEndVideocall(body);

    }



}
