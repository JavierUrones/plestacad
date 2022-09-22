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
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-info-work',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {

    dataWork!: FormGroup;
    disabled = true;
    cursos: any = [];
    categoryControl = new FormControl({ value: "", disabled: this.disabled });
    courseControl = new FormControl({ value: '', disabled: this.disabled }, [Validators.required]);
    teachersList: any = [];
    studentsList: any = [];
    authorId!: string;
    userId!: string;
    workId!: string;
    editingWork!: boolean;
    isClassified!: boolean;

    categories = [
        { viewValue: 'Trabajo Fin de Grado', value: 'tfg' },
        { viewValue: 'Trabajo Fin de Master', value: 'tfm' },
        { viewValue: 'Tésis Doctoral', value: 'tesis' }

    ];

    constructor(public router: Router, private sanitizer: DomSanitizer, public dialog: MatDialog, private formBuilder: FormBuilder, private workService: WorkListService, private route: ActivatedRoute, private userService: UserService) { }

    ngOnInit(): void {
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
                            console.log("photo",)
                        } else {
                            res.data.user.photo = undefined;
                        }

                        this.studentsList.push(res.data.user)

                    })


                })
            });
        })
    }

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

    saveEditWork() {
        console.log("values",this.dataWork.controls['title'].value, this.dataWork.controls['description'].value, this.dataWork.controls['course'].value, this.dataWork.controls['category'].value )
        this.workService.updateWork(this.workId, this.dataWork.controls['title'].value, this.dataWork.controls['description'].value, this.dataWork.controls['course'].value, this.dataWork.controls['category'].value).subscribe((res) => {
            this.getWorkData();
            this.editingWork = false;
            this.dataWork.controls['title'].disable()
            this.dataWork.controls['description'].disable()
            this.dataWork.controls['course'].disable()
            this.dataWork.controls['category'].disable();
        })
    }



    inviteNewUsers() {
        const dialogRef = this.dialog.open(ModalAddUsers, {
            width: '1000px',
            data: this.workId

        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    deleteUser(userId: string, type: string) {
        this.workService.deleteUserFromWork(this.workId, userId, type).subscribe(res => {
            this.dataWork.reset();
            this.studentsList = [];
            this.teachersList = [];
            this.getWorkData();
        })
    }

    deleteWork() {

        this.workService.deleteWork(this.workId).subscribe((res) => {
            this.router.navigateByUrl('/trabajos');
        })
    }

    setWorkAsClassified(){
        this.workService.setWorkAsClassified(this.workId).subscribe((res) => {
            this.dataWork.reset();
            this.studentsList = [];
            this.teachersList = [];
            this.getWorkData();

        })
    }

    setWorkAsDesclassified(){
        this.workService.setWorkAsDesclassified(this.workId).subscribe((res) => {
            this.dataWork.reset();
            this.studentsList = [];
            this.teachersList = [];
            this.getWorkData();
        })
    }


}
