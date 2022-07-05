import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from './files.service';
import { MyFile } from './models/file.model';

interface TreeNode {
  data?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
}
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  id!: string;
  files: TreeNode[] = [];
  loading!: boolean;
  cols: any[] | undefined;


  constructor(
    private route: ActivatedRoute,
    private fileService: FilesService,
    public dialog: MatDialog
  ) {
    this.cols = [
      { field: 'filename', header: 'Nombre' },
      { field: 'size', header: 'Tamaño' },
      { field: 'modification', header: 'Fecha de modificación' },
      { field: 'operations', header: '' },
    ];
  }

  ngOnInit(): void {
    this.getFilesFromWork();
  }

  expandNodes(nodes:any){
    nodes.forEach((node:any) => {
      if(node.children!= undefined && node.children.length > 0){
        node.expanded = true;
        this.expandNodes(node.children)
      } 
    })
  }
  getFilesFromWork() {

    this.loading = true;
    this.id = this.route.snapshot.params['idWork'];
    this.fileService.getFilesByWorkId(this.id).subscribe((response) => {
      this.files = response.data;
      this.files.forEach((node) => {
        if(node.children!= undefined && node.children.length > 0){
          node.expanded = true;
          this.expandNodes(node.children)
        } 
        if(node){
          this.loading = false;
        }

      })
    });

    
  }


   bytesToSize(bytes:number) {

    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = (Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    
 }






  deleteFile(path: string, isDirectory: boolean) {
    if (isDirectory) {
      this.fileService.deleteDir(this.id, path).subscribe((response) => {
        this.getFilesFromWork();
      });
    } else {
      this.fileService.deleteFile(this.id, path).subscribe((response) => {
        this.getFilesFromWork();
      });
    }
  }


  downloadFile(path: string, filename: string){
    this.fileService.downloadFile(this.id, path, filename).subscribe((response) => {
    })
  }

  path!: string;
  addDirectory(path:string){
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {path: path},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getFilesFromWork();
    });  }

  addFile(path: string){
    this.id = this.route.snapshot.params['idWork'];
    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      data: {path: path, id: this.id}
    }
    
    const dialogRef = this.dialog.open(DialogAddFile, config, );
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getFilesFromWork();
    }); 
  }
}


export interface DialogData {
  path: string;
  id:string;
}



@Component({
  selector: 'modal-file.html',
  templateUrl: './modal-file/modal-file.html',
})
export class DialogOverviewExampleDialog {

  filename!: string;
  invalidCreation!: boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>, private filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}


  ngOnInit(){
    this.invalidCreation = false;

  }
  onClick(path: string){
    this.filesService.addDirectory(path+ "/" + this.filename).subscribe({
        next: (response) => {
          console.log("RES STATUS", response.status)
          this.invalidCreation = false;
    
          this.dialogRef.close();
        },
        error: (e) => {
          this.invalidCreation = true;
        },
      
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'modal-upload-file.html',
  templateUrl: './modal-file/modal-upload-file.html',
})
export class DialogAddFile {

  filename!: string;

  fileControl!: FormControl ;

  invalidUpload!: boolean;
  public uploadFiles: any;
  
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>, private filesService: FilesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.fileControl = new FormControl(this.uploadFiles, [
      Validators.required
    ])
  }

  ngOnInit(){
    this.fileControl.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.uploadFiles = [files];
        console.log(this.uploadFiles)
        this.invalidUpload = false;

      } else {
        this.uploadFiles = files;
        console.log(this.uploadFiles)
        this.invalidUpload = false;

      }
    })
  }

  onClick(path: string, id:string){
    if (this.fileControl.valid) {
      console.log(this.uploadFiles)


      this.uploadFiles.forEach((element: any) => {
        this.filesService.addFile(id, path, element).subscribe(res => {
          console.log(res);
        })
      })

      this.dialogRef.close();

      
    } else{
      console.log("INVALID", this.uploadFiles)
      this.invalidUpload = true;
    }


  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
