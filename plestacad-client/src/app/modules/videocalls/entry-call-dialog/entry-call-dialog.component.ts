import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-entry-call-dialog',
  templateUrl: './entry-call-dialog.component.html',
  styleUrls: ['./entry-call-dialog.component.scss']
})
export class EntryCallDialogComponent implements OnInit {


    audio : any;
    photoProfile: any;
constructor(
    public dialog: MatDialogRef<EntryCallDialogComponent>,  private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService) { 
        this.playAudio();
        this.getProfilePhoto();
    }


    ngOnInit() {
    }

    getProfilePhoto(){
      this.userService.getProfilePhoto(this.data.idUser).subscribe((photo) => {
        if(photo.type=="image/jpeg"){
          let objectURL = URL.createObjectURL(photo);       
          this.photoProfile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        } else{
          this.photoProfile = undefined;
        }
  
      })
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