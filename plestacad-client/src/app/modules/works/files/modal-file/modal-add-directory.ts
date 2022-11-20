import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FilesService } from "../files.service";

/** Interfaz para el intercambio de datos con el diálogo modal de directorios. */
export interface DialogFilesData {
  /** Ruta del directorio */
  path: string;
  /** Id del trabajo académico */
  workId: string;
  id: string;
}



@Component({
  selector: 'modal-add-directory.html',
  templateUrl: 'modal-add-directory.html',

})
/** Define el diálogo para crear nuevos directorios. */
export class DialogAddDirectory {

  /** Nombre del directorio */
  filename!: string;
  /** Determina si ha habido o no un error al crear un directorio */
  invalidCreation!: boolean;
  /**
   *  Constructor
   * @param dialogRef - referencia del diálogo modal
   * @param filesService - servicio de archivos. 
   * @param data - datos pasados al diálogo modal
   */
  constructor(
    public dialogRef: MatDialogRef<DialogAddDirectory>, private filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogFilesData
  ) { }


  ngOnInit() {
    this.invalidCreation = false;

  }
  /**
   * Llama al servicio para crear nuevos directorios pasándole los datos requeridos luego cierra el diálogo modal.
   * Se dispara cuando el usuario pulsa el botón de crear. 
   * @param path - ruta del directorio a crear.
   * */
  onClick(path: string) {
    this.filesService.addDirectory(path + "/" + this.filename, sessionStorage.getItem("id") as string, this.data.workId).subscribe({
      next: (response) => {
        this.invalidCreation = false;

        this.dialogRef.close();
      },
      error: (e) => {
        this.invalidCreation = true;
      },

    })
  }

  /** Se dispara cuando el usuario pulsa el botón de cancelar. Cierra el diálogo modal. */
  onNoClick(): void {
    this.dialogRef.close();
  }
}

