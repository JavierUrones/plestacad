import { AutofillMonitor } from '@angular/cdk/text-field';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialog } from 'src/app/shared/components/confirm-dialog/confirm-dialog';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkService } from 'src/app/shared/services/work.service';
import { PostInteraction } from '../models/post.interaction';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-management',
    templateUrl: './post-management.component.html',
    styleUrls: ['./post-management.component.scss']
})

/** Define el componente de gestión de un tema del foro. */
export class PostManagementComponent implements OnInit {

    /** Id del trabajo académico */
    id!: string;
    /** Contenido del tema */
    message!: string;
    /** Fecha de creación del tema */
    creationDate!: Date;
    /** Atributo que determina si un tema es favorito */
    isFavorite!: boolean;
    /** Título del tema */
    title!: string;
    /** Nombre completo del autor del tema. */
    authorFullName!: string;
    /** Lista de id de respuestas del tema */
    interactions!: string[];
    /** Id del usuario autor del tema. */
    authorId!: string;
    /** Foto de perfil del autor del tema */
    authorPhotoProfile!: any | undefined;
    /** Lista de los objetos respuestas al tema junto a sus datos. */
    interactionsObjects: PostInteraction[] = [];
    /** Formulario */
    form!: FormGroup;
    /** FormControl del formulario */
    formControl!: FormControl;
    /** Contenido del editor de texto */
    htmlContentEditor!: string | undefined;
    /** Atributo que determina si la aplicación está cargando datos */
    loading!: boolean;
    /** Atributo que contiene el id del usuario que ha creado el trabajo académico */
    workOwnerId!: string;
    /** Determina si el usuario es administrador del sistema */
    isAdmin: boolean = false;

    constructor(private workService: WorkService, private confirmDialog: MatDialog, private sanitizer: DomSanitizer, private userService: UserService, private route: ActivatedRoute, private router: Router, private postService: PostService, private fb: FormBuilder) {
        this.form = this.fb.group({
            editorContent: ['', Validators.required]
        });

    }


    /** Módulos del componente editor de texto. */
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

    ngOnInit(): void {
        this.userService.getUserById(sessionStorage.getItem("id") as string).subscribe((res) => {
            if(res.data.user.isAdmin)
              this.isAdmin = true;
            else
              this.isAdmin = false;
          })
        this.loadPostData();


    }

    /** Carga los datos del tema y los almacena en las variables necesarias. */
    loadPostData() {
        this.loading = true;

        this.id = this.route.snapshot.params['id']
        this.postService.getPostById(this.id).subscribe((res) => {
            this.workService.getWorkById(res.data.workId).subscribe((responseWork) => {
                this.workOwnerId = responseWork.data.authorId;
            })
          })
        //Recuperar datos del post.
        this.postService.getPostById(this.id).subscribe((post) => {
            this.message = post.data.message;
            this.creationDate = post.data.creationDate;
            this.isFavorite = post.data.isFavorite;
            this.title = post.data.title;
            this.authorId = post.data.authorId;
            this.userService.getFullNameById(this.authorId).subscribe((res) => {
                this.authorFullName = res.data.fullname;
            })
            this.userService.getProfilePhoto(this.authorId).subscribe((photo) => {
                if (photo.type == "image/jpeg") {
                    let objectURL = URL.createObjectURL(photo);
                    this.authorPhotoProfile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                } else {
                    this.authorPhotoProfile = undefined;
                }
            })
            this.interactions = post.data.interactions;
            this.interactionsObjects = []

            this.postService.getListInteractionsByPostId(this.id).subscribe(response => {
                this.interactionsObjects = response.values;
                this.interactionsObjects.forEach((interaction) => {
                    this.userService.getProfilePhoto(interaction.authorId).subscribe((photo) => {
                        if (photo.type == "image/jpeg") {
                            let objectURL = URL.createObjectURL(photo);
                            interaction.photo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                        } else {
                            interaction.photo = undefined;
                        }
                    })
                })


            });

            this.loading = false;

        });
    }

    /**
     * Esta función se llama cuando el usuario envía una nueva respuesta al tema.
     * Obtiene el contenido del editor de texto y llama al servicio del foro para crear una nueva respuesta
     * */
    sendInteraction() {
        if (this.htmlContentEditor != undefined && this.htmlContentEditor!.substring(3, this.htmlContentEditor!.length - 4).trim().length > 0) {
            this.id = this.route.snapshot.params['id']

            const message = this.htmlContentEditor;
            const interaction = new Interaction(message,
                sessionStorage.getItem("id") || '{}',
                new Date(),
                sessionStorage.getItem("name") + " " + sessionStorage.getItem("surname"));

            this.postService.createNewInteraction(this.id, interaction).subscribe(response => {
                this.loadPostData();

                this.htmlContentEditor = undefined;

            });
            this.form.get("editorContent")?.setValue("");

        }

    }

    /**
     * Comprueba si el usuario en sesión es autor del recurso o el usuario en sesión es el autor del trabajo académico.
     * @param authorId - id del author a comprobar
     * @returns true si el usuario es el autor
     * @returns false si el usuario no es el autor
     */
    checkOwner(authorId: string) {
        if (authorId == sessionStorage.getItem("id") || this.workOwnerId == sessionStorage.getItem("id") || this.isAdmin) return true;
        else return false;
    }

    /**
     * Evento que se dispara cuando el usuario escribe en el editor de texto.
     * @param event - evento del editor.
     */
    onChangedEditor(event: any) {
        if (event.html) {
            this.htmlContentEditor = event.html;
        }
    }

    /**
     * Esta función se dispará cuando el usuario elimina una respuesta al tema.
     * Abre el diálogo de confirmación de eliminación, si el usuario acepta, se llama al servicio para eliminar la respuesta con el id indicado.
     * @param id - id de la respuesta al tema que se quiere borrar.
     */
    deleteInteraction(id: string | undefined) {
        this.confirmDialog.open(ConfirmDialog, {
            data: '¿Estás seguro que quieres eliminar esta respuesta?'
        }).afterClosed().subscribe((confirm: Boolean) => {
            if (confirm) {
                this.postService.deleteInteraction(id, this.id).subscribe((response: any) => {
                    this.loadPostData();
                })
            }
        });
    }



}

/**
 * Clase que define el contenido de las respuestas al tema junto a datos extra como la foto del usuario que ha creado la respuesta.
 */
class Interaction implements PostInteraction {
    /** Contenido de la respuesta */
    message!: string;
    /** Id del autor de la respuesta */
    authorId!: string;
    /** Fecha de la respuesta */
    date!: Date;
    /** Nombre completo del autor de la respuesta */
    authorFullName!: string;
    constructor(message: string, authorId: string, date: Date, authorFullName: string) {
        this.message = message;
        this.authorId = authorId;
        this.date = date;
        this.authorFullName = authorFullName;
    }
    /** Foto de perfil del autor de la respuesta */
    photo: any;

}