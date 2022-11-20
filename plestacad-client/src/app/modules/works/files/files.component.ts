import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from './files.service';
import { DialogAddDirectory } from './modal-file/modal-add-directory';
import { DialogUploadFile } from './modal-file/modal-upload-file';

/** Interfaz que define los atributos de cada uno de los niveles de jerarquía dentro del árbol de directorios. */
interface TreeNode {
  /** Datos del nodo */
  data?: any;
  /** Lista de nodos hijos */
  children?: TreeNode[];
  /** Flag que indica si el nodo es una hoja y no tiene hijos */
  leaf?: boolean;
  /** Flag que comprueba si el nodo está expandido */
  expanded?: boolean;
}
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
/** Define el componente de archivos de un trabajo académico */
export class FilesComponent implements OnInit {
  /** id del trabajo académico */
  id!: string;
  /** Lista de los archivos del trabajo académico*/
  files: TreeNode[] = [];
  /** Atributo que indica si el componente está cargando datos */
  loading!: boolean;
  /** Columnas de la tabla que contiene el árbol de directorios. */
  cols: any[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private fileService: FilesService,
    public dialog: MatDialog,
    private _errorBar: MatSnackBar
  ) {
    this.cols = [
      { field: 'filename', header: 'Nombre' },
      { field: 'size', header: 'Tamaño' },
      { field: 'modification', header: 'Fecha de modificación' },
      { field: 'operations', header: 'Opciones' },
    ];
  }

  ngOnInit(): void {
    this.getFilesFromWork();
  }

  /** 
   * Expande los nodos de la tabla del árbol de directorios.
   * Se dispara cuando el usuario abre o cierra el árbol de directorios de la tabla.
   * @param nodes - nodos a expandir. */
  expandNodes(nodes: any) {
    nodes.forEach((node: any) => {
      if (node.children != undefined && node.children.length > 0) {
        node.expanded = true;
        this.expandNodes(node.children)
      }
    })
  }

  /** Obtiene los archivos del trabajo académico a partir del servicio de archivos. */
  getFilesFromWork() {
    this.loading = true;
    this.id = this.route.snapshot.params['idWork'];
    this.fileService.getFilesByWorkId(this.id).subscribe((response) => {
      this.files = response.data;
      this.files.forEach((node) => {
        if (node.children != undefined && node.children.length > 0) {
          node.expanded = true;
          this.expandNodes(node.children)
        }
        if (node) {
          this.loading = false;
        }

      })
    });


  }

  /** Convierte los bytes a la magnitud adecuada
   * @param bytes - bytes a convertir.
   */
  bytesToSize(bytes: number) {

    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = (Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];

  }
  /**
   * Se dispara cuando el usuario intenta borrar un archivo o un directorio.
   * @param path - ruta del archivo
   * @param isDirectory - flag que comprueba si el archivo es un directorio.
   */
  deleteFile(path: string, isDirectory: boolean) {
    if (isDirectory) {
      this.fileService.deleteDir(path, sessionStorage.getItem("id") as string, this.id).subscribe({
        next: (response) => {
          this.getFilesFromWork();

        },
        error: (e) => {
          this._errorBar.open("No se puede eliminar una carpeta que no está vacía.", 'X', { duration: 2000 })
        },
      });
    } else {
      this.fileService.deleteFile(this.id, path, sessionStorage.getItem("id") as string).subscribe({
        next: (response) => {
          this.getFilesFromWork();

        },
        error: (e) => {
          this._errorBar.open("No se puede eliminar el archivo.", 'X', { duration: 2000 })
        },
      });
    }
  }

/**
 * Permite al usuario descargase uno de los archivos. 
 * Llama al servicio de archivos enviandole los parámetros del archivo a descargar.
 * @param path - ruta del archivo.
 * @param filename - nombre del archivo.
 */
  downloadFile(path: string, filename: string) {
    this.fileService.downloadFile(this.id, path, filename).subscribe((response) => {
    })
  }


  /** 
   * Abre el diálogo de creación de directorios y recarga la lista de archivos una vez se ha cerrado el diálogo.
   * @param path - ruta del directorio a crear.
   */
  addDirectory(path: string) {
    const dialogRef = this.dialog.open(DialogAddDirectory, {
      width: '250px',
      data: { path: path, workId: this.id },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getFilesFromWork();
    });
  }

  /**
   * Abre el diálogo de subida de archivos. Recarga la lista de archivos una vez se ha cerrado el diálogo.
   * @param path - ruta del archivo.
   */
  addFile(path: string) {
    this.id = this.route.snapshot.params['idWork'];
    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      data: { path: path, id: this.id }
    }

    const dialogRef = this.dialog.open(DialogUploadFile, config,);
    dialogRef.afterClosed().subscribe(result => {
      this.getFilesFromWork();
    });
  }
}



