import { Component, Inject } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FilesService } from "../files.service";
import { DialogFilesData } from "./modal-add-directory";


@Component({
    selector: 'modal-upload-file.html',
    templateUrl: 'modal-upload-file.html',
  })
  /** Diálogo de subida de archivos */
  export class DialogUploadFile {
    /** Nombre del archivo a subir */
    filename!: string;
  
    /** FormControl del formulario de subida. */
    fileControl!: FormControl ;
  
    /** Determina si se ha podido subir o no el archivo. */
    invalidUpload!: boolean;

    /** Archivos a subir. */
    public uploadFiles: any;
    
    constructor(
      public dialogRef: MatDialogRef<DialogUploadFile>, private filesService: FilesService, private _errorBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: DialogFilesData
    ) {
      this.fileControl = new FormControl(this.uploadFiles, [
        Validators.required
      ])
    }
  
    /** Comprueba si el usuario ha subido un archivo o una lista de archivos simultáneamente. */
    ngOnInit(){
      this.fileControl.valueChanges.subscribe((files: any) => {
        if (!Array.isArray(files)) {
          this.uploadFiles = [files];
          this.invalidUpload = false;
  
        } else {
          this.uploadFiles = files;
          this.invalidUpload = false;
  
        }
      })
    }
  
    /**
     * Comprueba si el archivo subido es válido y llama al servicio para subir el archivo, luego cierra el diálogo modal. 
     * Se dispara cuando el usuario pulsa el botón de subir. */
    onClick(path: string, id:string){
      if (this.fileControl.valid) {
        this.uploadFiles.forEach((element: any) => {
          this.filesService.addFile(sessionStorage.getItem("id") as string, path, element, this.data.id).subscribe({
            next: (response) => {
    
            },
            error: (e) => {
              this._errorBar.open("El tamaño del archivo seleccionado supera el limite de 20MB.", 'X',  {duration: 2000})
            },
          });
        })
          this.dialogRef.close();    
      } else{
        this.invalidUpload = true;
      }
    }

    /** Se dispara cuando el usuario pulsa el botón de cancelar. Cierra el diálogo modal. */
    onNoClick(): void {
      this.dialogRef.close();
    }
  }