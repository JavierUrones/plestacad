import { DatePipe, DOCUMENT } from '@angular/common';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { WorkCategory } from 'src/app/shared/models/category.enum';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkListService } from '../work-list.service';
import { map, Observable, startWith } from 'rxjs';
import { ModalAddUsers } from './modal-add-users/modal-add-users.component';

@Component({
    selector: 'app-info-work',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {

    dataWork!: FormGroup;
    disabled = true;
    categoryControl = new FormControl({ value: "", disabled: this.disabled });
    teachersList: any = [];
    studentsList: any = [];


    @ViewChild('inputTeacher') inputTeacher!: ElementRef;
    
    categories = [
        { viewValue: 'Trabajo Fin de Grado', value: 'tfg' },
        { viewValue: 'Trabajo Fin de Master', value: 'tfm' },
        { viewValue: 'Tésis Doctoral', value: 'tesis' }

    ];

    constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private workService: WorkListService, private route: ActivatedRoute, private userService: UserService) { }

    ngOnInit(): void {

        this.dataWork = new FormGroup({
            title: new FormControl({ value: '', disabled: this.disabled }, [Validators.required]),
            description: new FormControl({ value: '', disabled: this.disabled }, [Validators.required]),
            course: new FormControl({ value: '', disabled: this.disabled }, [Validators.required]),
        });

        this.workService.getWorkById(this.route.snapshot.params['idWork']).subscribe((res) => {
            this.dataWork.controls['title'].setValue(res.data.title);
            this.dataWork.controls['description'].setValue(res.data.description);
            this.dataWork.controls['course'].setValue(res.data.course);
            this.categoryControl.setValue(res.data.category);
            res.data.teachers.forEach((teacherId: any) => {
                this.userService.getUserById(teacherId).subscribe(res => {
                    this.teachersList.push(res.data.user)
                })
            });
            res.data.students.forEach((studentId: any) => {
                this.userService.getUserById(studentId).subscribe(res => {
                    this.studentsList.push(res.data.user)
                })
            });
        })



    }

    inviteNewUsers(){
        //abrir el modal
        const dialogRef = this.dialog.open(ModalAddUsers, {
            width: '1000px',
            data: this.route.snapshot.params['idWork']

          });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            //this.loadWorksByUserSession();
          });
    }
}
