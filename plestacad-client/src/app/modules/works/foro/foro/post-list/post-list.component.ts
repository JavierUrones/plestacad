import { DOCUMENT } from '@angular/common';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Post } from '../models/post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts!: Post[];
  public options!: any[] | null;
  public selected!: string;
  public pageSizeOptions!: number[];
  pageSize!: number;
  length!: number;

  idWork!: string;
  loading!: boolean;
  pageIndex!: number;
  navigation!: boolean;
  constructor(
    private userService: UserService,
    private postService: PostService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    @Inject(DOCUMENT) document: any

  ) { }

  ngOnInit(): void {
    this.idWork = document.location.href.split("/")[4]
    console.log("AKI", )

    this.loading = false;
    this.navigation = false;
    
    this.postService.getTotalPostByWorkId(this.idWork).subscribe((response) => {
      this.length = response.data.length;
      this.pageSize = this.length;
      console.log("LOGNITUS", this.length)
      this.options = [
        { value: 'desc', name: 'Más recientes' },
        { value: 'asc', name: 'Menos recientes' },
        { value: 'favorites', name: 'Favoritos' },
      ];
      this.selected = this.options[0].value;
      var nullEvent = {
        pageIndex: 0,
        pageSize: this.pageSize
      }
      this.getServerData(nullEvent)
      console.log("LONG", this.length)
    });
  }


  markAsFavorite(postId: string, isFavorite: boolean){
    this.postService.markPostAsFavorite(postId, isFavorite).subscribe((response) => {
      var nullEvent = {
        pageIndex: 0,
        pageSize: this.pageSize
      }
      this.getServerData(nullEvent);
    }
    );

    
  }

  getServerData(event: any) {
    //En el evento viene el numero de pagina.
    //El pageSize (elementos por pagina) se especifica al inicio y cambia con el evento.
    //El Length se carga de la respuesta.
    console.log("EVENT", event)
    console.log("Page Size", this.pageSize, "page index", this.pageIndex)
    if (event != null) {
      this.pageIndex = event.pageIndex + 1;
      this.pageSize = event.pageSize;
    }

    this.loading = true;

    this.postService
      .getPostsByWorkId(this.idWork, this.selected, this.pageSize, this.pageIndex)
      .subscribe((posts) => {

        console.log("LIST POST", posts)
        this.posts = posts.data.elementsInPage;
        this.length = posts.data.numElems;

        console.log("LENGTH", this.length)
        if (this.length <= 3) {
          this.pageSizeOptions = [this.length]
        } else {
          this.pageSizeOptions = [this.length / this.length, Math.floor(this.length / 2), this.length]
        }

        this.posts.forEach((post) => {
          this.userService
            .getFullNameById(post.authorId)
            .subscribe((fullname) => {
              console.log('FULLNAME', fullname.data.fullname);
              post.authorFullName = fullname.data.fullname;
            });
        });

        
        if(posts){
          this.loading = false;
        }

      });

  }

  onFilterChange(option: any) {
    var nullEvent = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    this.selected = option;
    this.getServerData(null)
  }

  checkOwner(authorId: string){
    if(authorId == sessionStorage.getItem("id")) return true;
    else return false;
  }

  deletePost(id: string){
    this.postService.deletePost(id).subscribe((response) => {
      console.log(response);

      var nullEvent = {
        pageIndex: 0,
        pageSize: this.pageSize
      }
      this.getServerData(nullEvent);
    })
  }
  newPost() {

    let config: MatDialogConfig = {
      height: "70%",
      width: "100%",
      panelClass: "dialog-responsive",
      data: { workId: this.idWork }
    }

    const dialogRef = this.dialog.open(DialogAddPost, config);
    dialogRef.afterClosed().subscribe(result => {
      var nullEvent = {
        pageIndex: 0,
        pageSize: this.pageSize
      }
      this.getServerData(nullEvent)
        });
  }



  navigateToPost(id:string){
    console.log(id)
    this.navigation = true;

    this.router.navigate(["/trabajos/"+this.idWork+"/posts/",id]);
  }



}


export interface DialogData {
  workId: string
}

@Component({
  selector: 'modal-add-post.html',
  templateUrl: '../modal-foro/modal-add-post.html',
  styleUrls: ['../modal-foro/modal-add-post.scss'],

})
export class DialogAddPost {

  filename!: string;
  form!: FormGroup;

  htmlContent!: any;
  formControl!: FormControl;

  invalidTitle!: boolean;
  public uploadFiles: any;

  public modulesQuill = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ font: [] }],
      [{ color: [] }, { background: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ]
  };



  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddPost>, private postService: PostService, private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required,Validators.maxLength(100) ]]
    });
  }

  ngOnInit() {

  }

  onClick() {
    if (this.form.valid) {
      this.invalidTitle = false;

      //Llamar al servicio para crear posts.
      const title = this.form.get('title')?.value;
      const message = this.htmlContent;
      const creationDate = new Date();
      const lastMessageDate = creationDate;
      const authorId = sessionStorage.getItem('id') as string;
      const isFavorite = false;
      console.log("author id", authorId)


      this.postService.createPost(this.data.workId, authorId, lastMessageDate, creationDate, message, title, isFavorite).subscribe((response) => {
        console.log("POST CREATED", response)
      })
      this.dialogRef.close();
    } else{
      this.invalidTitle = true;
    }

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangedEditor(event: any): void {
    if (event.html) {
      this.htmlContent = event.html;
      console.log(this.htmlContent)
    }
  }



}
