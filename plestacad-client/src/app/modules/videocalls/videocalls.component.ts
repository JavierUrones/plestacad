import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
import { VideocallsService } from './videocalls.service';

@Component({
  selector: 'app-videocalls',
  templateUrl: './videocalls.component.html',
  styleUrls: ['./videocalls.component.scss']
})
export class VideocallsComponent implements OnInit {

    @ViewChild('remoteVideo') remoteVideo!: ElementRef;

    constructor(
      private videocallsService: VideocallsService,
      private serverSocketsRequestsService: ServerSocketsRequestsService
    ) {}
  
    ngOnInit(): void {
      this.serverSocketsRequestsService.getVideocallRequest().subscribe((message: any) => {
        console.log("llega al cliente la llamada final", message.offer);
        this._handleMessage(message.offer);
      })
    }
  
    public async makeCall(): Promise<void> {
      await this.videocallsService.makeCall(this.remoteVideo);
    }
  
    private async _handleMessage(data: any): Promise<void> {
      switch (data.type) {
        case 'offer':
          await this.videocallsService.handleOffer(data.offer, this.remoteVideo);
          break;
  
        case 'answer':
          await this.videocallsService.handleAnswer(data.answer);
          break;
  
        case 'candidate':
          this.videocallsService.handleCandidate(data.candidate);
          break;
  
        default:
          break;
      }
    }
}
