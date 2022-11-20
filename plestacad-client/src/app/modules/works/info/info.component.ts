import { DatePipe, DOCUMENT } from '@angular/common';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { WorkCategory } from 'src/app/shared/models/category.enum';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkService } from '../../../shared/services/work.service';
import { map, Observable, startWith } from 'rxjs';
import { ModalAddUsers } from './modal-add-users/modal-add-users.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmDialog } from 'src/app/shared/components/confirm-dialog/confirm-dialog';

@Component({
    selector: 'app-info-work',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
//** Define el componente de información de un trabajo académico. */
export class InfoComponent implements OnInit {

    /** FormGroup con los datos del trabajo académico */
    dataWork!: FormGroup;
    /** Define si los valores del formulario se pueden modificar o no dependiendo de si el usuario está visualizando o editando un trbajo académico. */
    disabled = true;
    /** Contiene los posibles cursos a los que puede pertenecer un trabajo académico. */
    cursos: any = [];
    /** FormControl de la categoria del trabajo académico. */
    categoryControl = new FormControl({ value: "", disabled: this.disabled });
    /** FormControl del curso del trabajo académico. */
    courseControl = new FormControl({ value: '', disabled: this.disabled }, [Validators.required]);
    /** Lista de profesores del trabajo */
    teachersList: any = [];
    /** Lista de alumnos del trabajo */
    studentsList: any = [];
    /** id del autor del trabajo */
    authorId!: string;
    /** id del usuario en sesión */
    userId!: string;
    /** id del trabajo académico */
    workId!: string;
    /** Define si el usuario está editando o no el trabajo académico */
    editingWork!: boolean;
    /** Campo classified del trabajo académico que indica si está o no clasificado. */
    isClassified!: boolean;
    /** OPosibles categorías del trabajo académico */
    categories = [
        { viewValue: 'Trabajo Fin de Grado', value: 'tfg' },
        { viewValue: 'Trabajo Fin de Master', value: 'tfm' },
        { viewValue: 'Tésis Doctoral', value: 'tesis' }

    ];
    /* Modo administrador */
    isAdmin!: boolean;

    constructor(public confirmDialog: MatDialog, public router: Router, private sanitizer: DomSanitizer, public dialog: MatDialog, private formBuilder: FormBuilder, private workService: WorkService, private route: ActivatedRoute, private userService: UserService) { }

    ngOnInit(): void {
        this.userService.getUserById(sessionStorage.getItem("id") as string).subscribe((res) => {
            if(res.data.user.isAdmin) this.isAdmin = true; else this.isAdmin= false;
        })
        this.workId = this.route.snapshot.params['idWork'];
        this.dataWork = new FormGroup({
            title: new FormControl({ value: '', disabled: this.disabled }, [Validators.required]),
            description: new FormControl({ value: '', disabled: this.disabled }, [Validators.required]),
            course: this.courseControl,
            category: this.categoryControl
        });
        this.getWorkData();
        for (var i = 2000; i < 2050; i++) {
            this.cursos.push({ value: i })
        }
        this.editingWork = false;



    }

    /** Obtiene los datos del trabajo académico y los almacena en las variables requeridas */
    getWorkData() {
        this.teachersList = [];
        this.studentsList = [];
        this.userId = sessionStorage.getItem("id") as string;
        this.workService.getWorkById(this.workId).subscribe((res) => {
            this.isClassified = res.data.classified;
            this.dataWork.controls['title'].setValue(res.data.title);
            this.dataWork.controls['description'].setValue(res.data.description);
            this.dataWork.controls['course'].setValue(res.data.course);
            this.authorId = res.data.authorId;
            this.categoryControl.setValue(res.data.category);
            res.data.teachers.forEach((teacherId: any) => {
                this.userService.getUserById(teacherId).subscribe(res => {
                    this.userService.getProfilePhoto(teacherId).subscribe((photo) => {
                        if (photo.type == "image/jpeg") {
                            let objectURL = URL.createObjectURL(photo);
                            res.data.user.photo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                        } else {
                            res.data.user.photo = undefined;
                        }

                        this.teachersList.push(res.data.user)

                    })
                })
            });
            res.data.students.forEach((studentId: any) => {
                this.userService.getUserById(studentId).subscribe(res => {
                    this.userService.getProfilePhoto(studentId).subscribe((photo) => {
                        if (photo.type == "image/jpeg") {
                            let objectURL = URL.createObjectURL(photo);
                            res.data.user.photo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                        } else {
                            res.data.user.photo = undefined;
                        }

                        this.studentsList.push(res.data.user)

                    })


                })
            });
        })
    }

    /** Permite al usuario entrar y salir del modo edición de la información del trabajo académico */
    enableEdit() {
        if (!this.editingWork) {
            this.dataWork.controls['title'].enable()
            this.dataWork.controls['description'].enable()
            this.dataWork.controls['course'].enable()
            this.dataWork.controls['category'].enable();
            this.editingWork = true;
        } else {
            this.dataWork.controls['title'].disable()
            this.dataWork.controls['description'].disable()
            this.dataWork.controls['course'].disable()
            this.dataWork.controls['category'].disable();
            this.editingWork = false;

        }



    }

    /** Guarda la edición de un trabajo académico */
    saveEditWork() {
        this.workService.updateWork(this.workId, this.dataWork.controls['title'].value, this.dataWork.controls['description'].value, this.dataWork.controls['course'].value, this.dataWork.controls['category'].value).subscribe((res) => {
            this.getWorkData();
            this.editingWork = false;
            this.dataWork.controls['title'].disable()
            this.dataWork.controls['description'].disable()
            this.dataWork.controls['course'].disable()
            this.dataWork.controls['category'].disable();
        })
    }



    /** Abre el diálogo de añadir usuarios al trabajo académico */
    inviteNewUsers() {
        const dialogRef = this.dialog.open(ModalAddUsers, {
            width: '1000px',
            data: this.workId

        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    /** Elimina a un usuario del trabajo académico. */
    deleteUser(userId: string, type: string) {
        this.confirmDialog
            .open(ConfirmDialog, {
                data: '¿Estás seguro que quieres realizar esta acción?'
            }).afterClosed().subscribe((confirm: Boolean) => {
                if (confirm) {
                    if (userId == this.authorId)
                        this.workService.deleteUserFromWork(this.workId, userId, type).subscribe(res => {
                            this.dataWork.reset();
                            this.studentsList = [];
                            this.teachersList = [];
                            this.getWorkData();
                        })
                    else {
                        this.workService.leaveFromWork(this.workId, userId, type).subscribe(res => {
                            this.dataWork.reset();
                            this.studentsList = [];
                            this.teachersList = [];
                            this.getWorkData();
                        })
                        this.router.navigateByUrl("/trabajos");
                    }
                }

            })

    }

    /** Elimina el trabajo académico. */
    deleteWork() {
        this.confirmDialog
            .open(ConfirmDialog, {
                data: '¿Estás seguro que quieres eliminar este trabajo académico?'
            }).afterClosed().subscribe((confirm: Boolean) => {
                if (confirm) {
                    this.workService.deleteWork(this.workId).subscribe((res) => {
                        this.router.navigateByUrl('/trabajos');
                    })
                }

            })
    }


    /** Marca el trabajo académico como clasificado. */
    setWorkAsClassified() {
        this.confirmDialog
            .open(ConfirmDialog, {
                data: '¿Estás seguro que quieres archivar este trabajo académico?'
            }).afterClosed().subscribe((confirm: Boolean) => {
                if (confirm) {
                    this.workService.setWorkAsClassified(this.workId).subscribe((res) => {
                        this.dataWork.reset();
                        this.studentsList = [];
                        this.teachersList = [];
                        this.getWorkData();
                    })
                }
            })
    }

    /** Marca el trabajo académico como no clasificado. */
    setWorkAsDesclassified() {
        this.workService.setWorkAsDesclassified(this.workId).subscribe((res) => {
            this.dataWork.reset();
            this.studentsList = [];
            this.teachersList = [];
            this.getWorkData();
        })
    }


}
