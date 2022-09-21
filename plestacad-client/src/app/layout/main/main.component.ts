import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryCallDialogComponent } from 'src/app/modules/videocalls/entry-call-dialog/entry-call-dialog.component';
import { VideocallsComponent } from 'src/app/modules/videocalls/videocalls.component';
import { VideocallsService } from 'src/app/modules/videocalls/videocalls.service';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  sideBarOpen = true;
  showContent = true;

  entryCallSubscription : any;

  @ViewChild(VideocallsComponent) videocallsComponent: any;

  constructor(public dialog: MatDialog, private serverSocketsRequestsService: ServerSocketsRequestsService, private router: Router, private route: ActivatedRoute, private videocallsService: VideocallsService) {

  }

  ngOnInit(): void {
    this.showContent = true;
    this.serverSocketsRequestsService.loginUserSocket(sessionStorage.getItem("id") as string);

    this.entryCallSubscription = this.videocallsService.entryCallListener.subscribe((res: any) => { 
      console.log("LLEGA PETICION", res)
      if(res.idPeer != undefined && res.idUserDestiny == sessionStorage.getItem("id") as string){
        console.log("se navegaN", res)

        this.router.navigateByUrl('/videollamadas?entryCall=true&idPeer=' + res.idPeer + "&idUserOrigin="+ res.idUserOrigin + "&idUserDestiny="+ res.idUserDestiny + "&userNameOrigin=" + res.userNameOrigin);
      }
    })
  }




  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }


  onClickedMenuItem(event: any) {
    this.sideBarOpen = false;
    this.showContent = true;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 800) {
      if (this.sideBarOpen) {
        this.showContent = false;
      } else {
        this.showContent = true;
      }
    } else {
      this.showContent = true;
    }
  }

  ngOnDestroy(){
    this.entryCallSubscription.unsubscribe();
  }




}
