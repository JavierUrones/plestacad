import { DOCUMENT } from '@angular/common';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialog } from 'src/app/shared/components/confirm-dialog/confirm-dialog';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkService } from 'src/app/shared/services/work.service';
import { Post } from '../models/post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
/** Define el componente que muestra la lista de temas de un trabajo académico */
export class PostListComponent implements OnInit {
  /** Lista de temas del trabajo */
  posts: Post[] = [];
  /** Opciones  de filtrado de los temas*/
  public options!: any[] | null;
  /** Opción seleccionada de filtrado de temas */
  public selected!: string;
  /** Tamaño de las páginas del paginador. */
  public pageSizeOptions!: number[];

  /** Número de elementos por página del paginador. */
  pageSize!: number;
  /* Número total de temas del trabajo académico */
  length!: number;

  /** Id del trabajo académico */
  idWork!: string;
  /** Id del propietario del trabajo académico */
  workOwnerId!: string;
  /** Atributo que determina cuando el componente está cargando datos */
  loading!: boolean;
  /** Índice seleccionado del paginador */
  pageIndex!: number;
  /** Determina si el usuario está dentro de un tema o no */
  navigation!: boolean;
  /** Determina si el usuario es administrador del sistema*/
  isAdmin: boolean = false;
  constructor(
    private confirmDialog: MatDialog,
    private userService: UserService,
    private postService: PostService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private paginator: MatPaginatorIntl,
    private workService: WorkService,
    @Inject(DOCUMENT) document: any

  ) {
    this.paginator.firstPageLabel = 'Primera página';
    this.paginator.itemsPerPageLabel = "Elementos por página";
    this.paginator.lastPageLabel = "Última página";
    this.paginator.nextPageLabel = "Siguiente página";
    this.paginator.previousPageLabel = "Anterior página"
    this.paginator.getRangeLabel = this.getRangeLabel;

  }
  /** Determina el texto del paginador. */
  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return "Página 1 de 1";
    }
    const amountPages = Math.ceil(length / pageSize);
    return "Página " + page + 1 + " de " + amountPages;
  }

  /** Establece los atributos del paginador y las opciones del selector de filtrado de temas.
   * Luego llama a la función que se encarga de cargar los datos de los temas desde el servidor.
   */
  ngOnInit(): void {
    this.idWork = document.location.href.split("/")[4]
    this.userService.getUserById(sessionStorage.getItem("id") as string).subscribe((res) => {
      if(res.data.user.isAdmin)
        this.isAdmin = true;
      else
        this.isAdmin = false;
    })
    this.loading = false;
    this.navigation = false;

    this.postService.getTotalPostByWorkId(this.idWork).subscribe((response) => {
      this.length = response.data.length;
      this.pageSize = this.length;
      this.options = [
        { value: 'desc', name: 'Más recientes' },
        { value: 'asc', name: 'Menos recientes' },
        { value: 'favorites', name: 'Favoritos' },
      ];
      this.selected = this.options[0].value;
      var nullEvent = {
        pageIndex: 0,
        pageSize: 10
      }

      this.getServerData(nullEvent)
    });
  }


  /** Llama al servicio para marcar un tema como favorito. Se dispará cuando un usuario pulsa el botón con forma de corazón de un tema. */
  markAsFavorite(postId: string, isFavorite: boolean) {
    this.postService.markPostAsFavorite(postId, isFavorite).subscribe((response) => {
      var nullEvent = {
        pageIndex: 0,
        pageSize: this.pageSize
      }
      this.getServerData(nullEvent);
    }
    );


  }

  /** Obtiene los datos de la lista de temas del trabajo académico a partir de la página en la que se encuentre el paginador.
   * @param event - evento con el contenido del número de página del paginador.
   */
  getServerData(event: any) {
    //En el evento viene el numero de pagina.
    //El pageSize (elementos por pagina) se especifica al inicio y cambia con el evento.
    //El Length se carga de la respuesta.

    this.workService.getWorkById(this.idWork).subscribe((res) => {
      this.workOwnerId = res.data.authorId;
    })
    if (event != null) {
      this.pageIndex = event.pageIndex + 1;
      this.pageSize = event.pageSize;
    }

    this.loading = true;

    this.postService
      .getPostsByWorkId(this.idWork, this.selected, this.pageSize, this.pageIndex)
      .subscribe((posts) => {

        this.posts = posts.data.elementsInPage;
        this.length = posts.data.numElems;

        if (this.length <= 10) {
          this.pageSizeOptions = [10]
          this.pageIndex = 1;
        } else {
          this.pageSizeOptions = [this.length / this.length, Math.floor(this.length / 2), this.length]
        }

        this.posts.forEach((post) => {
          this.userService
            .getFullNameById(post.authorId)
            .subscribe((fullname) => {
              post.authorFullName = fullname.data.fullname;
            });
        });


        if (posts) {
          this.loading = false;
        }

      });

  }
  /*
    /** Se dispara cuando el usuario ordena la lista de temas con el componente selector.
     * @param option - opción seleccionada en el selector.
     */
  onFilterChange(option: any) {
    var nullEvent = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    this.selected = option;
    this.getServerData(null)
  }

  /** Comprueba los permisos del usuario indicado: si el usuario pasado por parámetro es el usuario en sesión o si el author del trabajo académico es el usuario en sesión.
   * @param authorId - id del autor del tema.
   * @returns true - si es el usuario en sesión o si el usuario en sesión es el autor del trabajo académico.
   * @returns false - en caso contrario
  */
  checkPermissions(authorId: string) {
    if (authorId == sessionStorage.getItem("id") || this.workOwnerId == sessionStorage.getItem("id") || this.isAdmin) return true;
    else return false;
  }

  /** 
   * Abre el diálogo de confirmación de borrado, si se acepta llama al servicio para eliminar el tema.
   * Esta función se dispara cuando el usuario pulsa el botón de borrar un tema.
   * @param id - id del tema a borrar
   */
  deletePost(id: string) {
    this.confirmDialog
      .open(ConfirmDialog, {
        data: '¿Estás seguro que quieres eliminar este tema?'
      }).afterClosed().subscribe((confirm: Boolean) => {
        if (confirm) {
          this.postService.deletePost(id).subscribe((response) => {
            var nullEvent = {
              pageIndex: 0,
              pageSize: this.pageSize
            }
            this.getServerData(nullEvent);
          })
        }
      });

  }
  /**
   * Abre el diálogo modal para crear un tema y recarga la lista de temas cuando este se cierra.
   * Esta función se dispara cuando el usuario pulsa el botón de crear un nuevo tema.
   */
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


  /** Accede al tema indicado
   * @param id - id del tema a acceder.
   */
  navigateToPost(id: string) {
    this.navigation = true;

    this.router.navigate(["/trabajos/" + this.idWork + "/posts/", id]);
  }



}

/**
 * Define la interfaz para el intercambio de datos con el diálogo de creación de un nuevo tema.
 */
export interface DialogDataAddPost {
  /** Id del trabajo académico */
  workId: string
}

@Component({
  selector: 'modal-add-post.html',
  templateUrl: '../modal-foro/modal-add-post.html',
  styleUrls: ['../modal-foro/modal-add-post.scss'],

})
/** Define el diálogo para la creación de un nuevo tema  */
export class DialogAddPost {

  /** Formulario con los datos del tema */
  form!: FormGroup;

  /** Contenido del editor de texto */
  htmlContent!: any;

  /** FormControl del formulario */
  formControl!: FormControl;

  /** Atributo que comprueba si el título especificado es correcto */
  invalidTitle!: boolean;


  /** Opciones de configuración del componente editor de texto. */
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
    public dialogRef: MatDialogRef<DialogAddPost>, private postService: PostService, private route: ActivatedRoute, private _errorBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataAddPost
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit() {

  }

  /**
   * Comprueba que los datos del tema creado sean válidos y llama al servicio de temas para crear un nuevo tema a partir de dichos datos. 
   * Se dispara cuando el usuario pulsa el botón de crear.
   * Cierra el diálogo modal. */
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


      this.postService.createPost(this.data.workId, authorId, lastMessageDate, creationDate, message, title, isFavorite).subscribe({
        next: (response) => {

        },
        error: (e) => {
          this._errorBar.open("El título o la descripción indicada al crear el tema son inválidos.", "X", { duration: 2000 })
        },
      });
      this.dialogRef.close();
    } else {
      this.invalidTitle = true;
    }

  }
  /** Se dispara cuando el usuario pulsa el botón de "Cancelar". Cierra el diálogo modal. */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /** Evento que se dispara cuando el usuario escribe en el componente de editor de textos. */
  onChangedEditor(event: any): void {
    if (event.html) {
      this.htmlContent = event.html;
    }
  }



}
