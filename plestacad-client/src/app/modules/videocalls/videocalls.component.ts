import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
import { VideocallsService } from './videocalls.service';
import { Peer } from "peerjs";
import { UserService } from 'src/app/shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { EntryCallDialogComponent } from './entry-call-dialog/entry-call-dialog.component';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'app-videocalls',
    templateUrl: './videocalls.component.html',
    styleUrls: ['./videocalls.component.scss']
})
export class VideocallsComponent implements OnInit {

    contacts: any = [];
    allContacts: any = [];

    entryCallSubscription: any;
    constructor(
        public videocallsService: VideocallsService,
        private serverSocketsRequestsService: ServerSocketsRequestsService,
        private userService: UserService,
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute
    ) { }


    ngOnInit(): void {

        this.serverSocketsRequestsService.loginUserSocket(sessionStorage.getItem("id") as string);

        this.videocallsService.initializePeer();
        this.route.queryParamMap.subscribe((param) => {
            console.log("param", param)
            if (param.get("entryCall")) {
                let res = { idPeer: param.get("idPeer"), idUserOrigin: param.get("idUserOrigin"), idUserDestiny: param.get("idUserDestiny"), userNameOrigin: param.get("userNameOrigin") }
                this.initializeCallsEntry(res);
            }
        })

        //this.initializeCallsEntryListener();
        //this.serverSocketsRequestsService.loginUserSocket(sessionStorage.getItem("id") as string);
        this.getStatusOfUsers();
        this.getUserContactsAndStatus();
        this.initializeCallsEndListener();




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




    initializeCallsEntry(res: any) {
        if (res.idPeer != undefined && res.idPeer != this.videocallsService.idPeer && res.idUserDestiny == sessionStorage.getItem("id") as string) {
            this.dialog.open(EntryCallDialogComponent, {
                data: "¡Estás recibiendo una llamada entrante de " + res.userNameOrigin + "!"
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





    endCall() {
        const body = {
            idPeer: this.videocallsService.idPeer
        }
        this.serverSocketsRequestsService.sendEndVideocall(body);
        //window.location.reload();
        this.router.navigate(
            [], 
            {
              relativeTo: this.route,
              queryParams: {}
            });
            window.location.replace(location.pathname);


    }

    muteAudio() {
        if (this.videocallsService.userListStream[0].getAudioTracks()[0].enabled) {
            this.videocallsService.userListStream[0].getAudioTracks()[0].enabled = false;
        } else {
            this.videocallsService.userListStream[0].getAudioTracks()[0].enabled = true;

        }

    }

    stopVideo() {
        if (this.videocallsService.userListStream[0].getVideoTracks()[0].enabled) {
            this.videocallsService.userListStream[0].getVideoTracks()[0].enabled = false;
        } else {
            this.videocallsService.userListStream[0].getVideoTracks()[0].enabled = true;

        }
    }

    ngOnDestroy() {
        if (this.videocallsService.onCall) {
            this.endCall();
        }
        //this.entryCallSubscription.unsubscribe();

    }


}
