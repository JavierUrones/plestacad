
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';

import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { DialogData } from '../../work-list.component';
import { WorkListService } from '../../work-list.service';



@Component({
    selector: 'modal-add-users',
    styleUrls: ['modal-add-users.component.scss'],
    templateUrl: 'modal-add-users.component.html',
})
export class ModalAddUsers implements OnInit {
    teachersCtrl!: FormControl;
    teachersFiltered!: Observable<User[]>;
    teachers!: User[];
    teachersInvited: User[] = [];


    studentsCtrl!: FormControl;
    studentsFiltered!: Observable<User[]>;
    students!: User[];
    studentsInvited: User[] = [];

    loading!: boolean;
    constructor(private userService: UserService,
        public dialogRef: MatDialogRef<ModalAddUsers>, private workService: WorkListService, private route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        this.teachersCtrl = new FormControl();
        this.studentsCtrl = new FormControl();

        console.log("DATA, ", data)


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
    private _filterTeachers(value: string): User[] {
        const filterValue = value.toLowerCase();

        return this.teachers.filter(teacher => teacher.email.toLowerCase().includes(filterValue));
    }

    private _filterStudents(value: string): User[] {
        const filterValue = value.toLowerCase();

        return this.students.filter(student => student.email.toLowerCase().includes(filterValue));
    }


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

    deleteTeacherInvited(teacher: any) {
        console.log("TEACHER", teacher)
        this.teachersInvited = this.teachersInvited.filter(t => t !== teacher);
    }

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

    deleteStudentInvited(student: any) {
        console.log("student", student)
        this.studentsInvited = this.studentsInvited.filter(e => e !== student);
    }


    onClick() {
        //Generar las solicitudes de invitación.
        this.workService.generateWorkRequests(this.data.toString(), sessionStorage.getItem("id") as string, this.teachersInvited, this.studentsInvited).subscribe((res) => {
            this.dialogRef.close();
        })
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}