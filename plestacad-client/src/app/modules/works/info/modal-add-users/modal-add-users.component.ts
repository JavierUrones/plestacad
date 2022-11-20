
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';

import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkService } from '../../../../shared/services/work.service';
import { DialogDataAddWork } from '../../manage-work/manage-work/add-work-dialog/add-work.dialog';



@Component({
    selector: 'modal-add-users',
    styleUrls: ['modal-add-users.component.scss'],
    templateUrl: 'modal-add-users.component.html',
})
/** Define el dialogo para añadir nuevos miembros al trabajo académico */
export class ModalAddUsers implements OnInit {
    /** FormControl de los profesores */
    teachersCtrl!: FormControl;
    /** Lista de profesores filtrados a partir de la variable teachers cuando el usuario escribe sobre el componente de selección de profesores */
    teachersFiltered!: Observable<User[]>;
    /** Lista de profesores invitables al trabajo académico. */
    teachers!: User[];
    /** Lista de profesores invitados. */
    teachersInvited: User[] = [];

    /** FormControl de los estudiantes */
    studentsCtrl!: FormControl;
    /** Lista de estudiantes filtrados a partir de la variable students cuando el usuario escribe sobre el componente de selección de estudiantes */
    studentsFiltered!: Observable<User[]>;
    /** Lista de estudiantes invitables al trabajo académico. */
    students!: User[];
    /** Lista de estudiantes invitados. */
    studentsInvited: User[] = [];

    /** Atributo que indica si el diálogo está cargando datos. */
    loading!: boolean;
    constructor(private userService: UserService,
        public dialogRef: MatDialogRef<ModalAddUsers>, private workService: WorkService, private route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: DialogDataAddWork
    ) {
        this.teachersCtrl = new FormControl();
        this.studentsCtrl = new FormControl();
        this.loading = true;
        this.userService.getUsersForInvitationByRole(data.toString()).subscribe((dataUsers: User[]) => {
            this.teachers = dataUsers;
            this.students = dataUsers;
            this.teachersFiltered = this.teachersCtrl.valueChanges.pipe(
                startWith(''),
                map(teacher => (teacher ? this._filterTeachers(teacher) : this.teachers.slice()))
            );
            this.studentsFiltered = this.studentsCtrl.valueChanges.pipe(
                startWith(''),
                map(student => (student ? this._filterStudents(student) : this.students.slice()))
            );
            this.loading = false;
        });
    }

    ngOnInit() {

    }
    /** Filtra la lista de profesores invitables a partir del contenido del parámetro value.
   * @param value - input escrito por el usuario para filtrar la lista de profesores.
   */
    private _filterTeachers(value: string): User[] {
        const filterValue = value.toLowerCase();
        return this.teachers.filter(teacher => teacher.email.toLowerCase().includes(filterValue));
    }

    /** Filtra la lista de estudiantes invitables a partir del contenido del parámetro value.
   * @param value - input escrito por el usuario para filtrar la lista de estudiantes.
   */
    private _filterStudents(value: string): User[] {
        const filterValue = value.toLowerCase();
        return this.students.filter(student => student.email.toLowerCase().includes(filterValue));
    }

    /** 
     * Añade a un usuario a la lista de profesores invitados.
   */
    addTeacherToList() {
        var teacherValue = this.teachersCtrl.value;
        if (teacherValue != undefined && teacherValue.trim() != ""
            && this.teachers.filter(teacher => teacher.email == this.teachersCtrl.value).length > 0
            && this.teachersInvited.filter(teacher => teacher == teacherValue).length == 0) {
            this.teachersInvited.push(teacherValue);
            this.teachersCtrl.setValue("");
            if (this.studentsInvited.filter(student => student == teacherValue).length > 0) {
                this.deleteStudentInvited(teacherValue)
            }
        }
    }

    /** 
     * Elimina a un profesor invitado.
   */
    deleteTeacherInvited(teacher: any) {
        this.teachersInvited = this.teachersInvited.filter(t => t !== teacher);
    }

    /**
     * Añade a un usuario a la lista de estudiantes invitados.
     */
    addStudentToList() {
        var studentValue = this.studentsCtrl.value;
        if (studentValue != undefined && studentValue.trim() != ""
            && this.students.filter(student => student.email == this.studentsCtrl.value).length > 0
            && this.studentsInvited.filter(student => student == studentValue).length == 0) {
            this.studentsInvited.push(studentValue);
            this.studentsCtrl.setValue("");
            if (this.teachersInvited.filter(teacher => teacher == studentValue).length > 0) {
                this.deleteTeacherInvited(studentValue)
            }
        }


    }

    /** Elimina a un estudiante invitado. */
    deleteStudentInvited(student: any) {
        this.studentsInvited = this.studentsInvited.filter(e => e !== student);
    }


    /** Cierra el diálogo llamando previamente al servicio que genera las solicitudes de incorporación para los usuarios invitados. */
    onClick() {
        //Generar las solicitudes de invitación.
        this.workService.generateWorkRequests(this.data.toString(), sessionStorage.getItem("id") as string, this.teachersInvited, this.studentsInvited).subscribe((res) => {
            this.dialogRef.close();
        })
    }

    /** Cierra el diálogo cuando se pulsa el botón "Cancelar" */
    onNoClick(): void {
        this.dialogRef.close();
    }

}