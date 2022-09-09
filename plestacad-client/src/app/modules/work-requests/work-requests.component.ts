import { M } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkRequestService } from 'src/app/shared/services/work.request.service';
import { WorkListService } from '../works/work-list.service';

@Component({
  selector: 'app-work-requests',
  templateUrl: './work-requests.component.html',
  styleUrls: ['./work-requests.component.scss']
})
export class WorkRequestsComponent implements OnInit {

    workRequests: MatTableDataSource<any> = new MatTableDataSource();
    definedColumns: string[] = ['description', 'title', 'userSenderFullname', 'date', "options"];
    descriptionWork! : string;
    loading!: boolean;
  constructor(private workRequestsService: WorkRequestService) { }

  ngOnInit(): void {

    this.loading=true;
    this.workRequestsService.getWorkRequestsWithInfoByUserReceiverId(sessionStorage.getItem("id") as string).subscribe(workRequests => {

       this.workRequests.data = workRequests.data;
       this.loading=false;
    })
  }

  ngAfterViewInit(){

  }

  acceptWorkRequest(element: any){
    this.workRequestsService.acceptWorkRequest(element._id, element.userIdReceiver, element.workId, element.description).subscribe(res => {
        console.log(res);
        this.ngOnInit();

    })
  }

  denyWorkRequest(element : any){
    this.workRequestsService.denyWorkRequest(element._id, element.userIdReceiver).subscribe(res => { 
        console.log(res);
        this.ngOnInit();
    })
    
  }

}
