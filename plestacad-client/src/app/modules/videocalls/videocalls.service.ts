import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VideocallsService {
  uri = environment.apiURL;
  configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  connection!: any;
  constructor(private http: HttpClient, private serverSocketsRequestsService: ServerSocketsRequestsService) {}

  private async startConnection(remoteVideo: ElementRef): Promise<void> {
    this.connection = new RTCPeerConnection(this.configuration);

    await this._getStreams(remoteVideo);

    this._registerConnectionListeners();
  }

  private async _getStreams(remoteVideo: ElementRef): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    remoteVideo.nativeElement.srcObject = remoteStream;

    this.connection.ontrack = (event: any) => {
      event.streams[0].getTracks().forEach((track: any) => {
        remoteStream.addTrack(track);
      });
    };

    stream.getTracks().forEach((track) => {
      this.connection.addTrack(track, stream);
    });
  }

  private _registerConnectionListeners(): void {
    this.connection.onicegatheringstatechange = (ev: Event) => {
      console.log(
        `ICE gathering state changed: ${this.connection.iceGatheringState}`
      );
    };

    this.connection.onconnectionstatechange = () => {
      console.log(
        `Connection state change: ${this.connection.connectionState}`
      );
    };

    this.connection.onsignalingstatechange = () => {
      console.log(`Signaling state change: ${this.connection.signalingState}`);
    };

    this.connection.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state change: ${this.connection.iceConnectionState}`
      );
    };
    this.connection.onicecandidate = (event: any) => {
      if (event.candidate) {
        const payload = {
          type: 'candidate',
          candidate: event.candidate.toJSON(),
          userId: "6316800f3eee9f0b42863415"
        };
        //this.serverSocketsRequestsService.sendVideocallRequest(payload);
      }
    };
  }

  public async makeCall(remoteVideo: ElementRef): Promise<void> {
    await this.startConnection(remoteVideo);

    const offer = await this.connection.createOffer();

    await this.connection.setLocalDescription(offer);

    this.serverSocketsRequestsService.sendVideocallRequest({ userId: "6316800f3eee9f0b42863415", offer: offer});
  }

  public async handleOffer(
    offer: RTCSessionDescription,
    remoteVideo: ElementRef
  ): Promise<void> {
    await this.startConnection(remoteVideo);

    await this.connection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await this.connection.createAnswer();

    await this.connection.setLocalDescription(answer);



    this.serverSocketsRequestsService.sendVideocallRequest({ type: 'answer', answer });
  }

  public async handleAnswer(answer: RTCSessionDescription): Promise<void> {
    await this.connection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  public async handleCandidate(candidate: RTCIceCandidate): Promise<void> {
    if (candidate) {
      await this.connection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }


  
}
