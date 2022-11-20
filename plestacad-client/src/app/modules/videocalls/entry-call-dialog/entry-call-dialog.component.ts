import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-entry-call-dialog',
  templateUrl: './entry-call-dialog.component.html',
  styleUrls: ['./entry-call-dialog.component.scss']
})
/** Define el diálogo que notifica llamadas entrantes */
export class EntryCallDialogComponent implements OnInit {
  /** Audio que se reproduce cuando entra una llamada */
  audio: any;
  /** Foto de perfil del usuario que está llamando */
  photoProfile: any;
  constructor(
    public dialog: MatDialogRef<EntryCallDialogComponent>, private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService) {
    this.playAudio();
    this.getProfilePhoto();
  }


  ngOnInit() {
  }

  /** Obtiene la foto de perfil del usuario que está llamando. */
  getProfilePhoto() {
    this.userService.getProfilePhoto(this.data.idUser).subscribe((photo) => {
      if (photo.type == "image/jpeg") {
        let objectURL = URL.createObjectURL(photo);
        this.photoProfile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      } else {
        this.photoProfile = undefined;
      }

    })
  }

  /** Reproduce el audio de llamada entrante */
  playAudio() {
    this.audio = new Audio();
    this.audio.src = "assets/sounds/call.mp3";
    this.audio.load();
    this.audio.play();
  }

  /** Se dispara cuando el usuario rechaza una llamada entrante. Finaliza la reproducción del audio y cierra el diálogo. */
  close(): void {
    this.audio.pause();
    this.dialog.close(false);

  }

  /** Acepta la llamada entrante. Finaliza la reproducción del audio y cierra el diálogo. */
  confirm(): void {
    this.audio.pause();

    this.dialog.close(true);
  }

  /** Detiene la reproducción del audio cuando se destruye el diálogo de llamada entrante. */
  ngOnDestroy() {
    this.audio.pause();

  }


}