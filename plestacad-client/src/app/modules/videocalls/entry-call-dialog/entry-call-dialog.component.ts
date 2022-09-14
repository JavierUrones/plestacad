import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-entry-call-dialog',
  templateUrl: './entry-call-dialog.component.html',
  styleUrls: ['./entry-call-dialog.component.scss']
})
export class EntryCallDialogComponent implements OnInit {


    audio : any;
constructor(
    public dialog: MatDialogRef<EntryCallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { 
        this.playAudio();

    }


    ngOnInit() {
    }


    playAudio(){
        this.audio = new Audio();
        this.audio.src = "assets/sounds/call.mp3";
        this.audio.load();
        this.audio.play();
    }



    close(): void {
        this.audio.pause();
      this.dialog.close(false);

    }

    confirm(): void {
        this.audio.pause();

      this.dialog.close(true);
    }

    ngOnDestroy(){
        this.audio.pause();

    }


}