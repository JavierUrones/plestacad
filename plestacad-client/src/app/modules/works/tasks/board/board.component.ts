import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, ElementRef, HostListener, Inject, Input, OnInit, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Task } from "../models/Task.model";
import { TaskClassificator } from "../models/TaskClassificator.model"
import { MatMenuTrigger } from '@angular/material/menu';
import { NotifyTaskChangesService } from '../list/notify-task-changes.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogManageTask } from '../dialog-manage-task/dialog-manage-task';
import { WorkListService } from '../../work-list.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
    idWork!: string;
    largeScreen!: boolean;
    taskClassificators!: TaskClassificator[];
    usersOfWork: any[] = [];
    @ViewChild('moveMenuButton') moveMenuButton: any;

    notifierSubscription: Subscription = this.notifyTaskChangeService.subjectNotifier.subscribe(notice => {
        //se ha producido cambios en las tareas, se debe recargar la lista de apartados de clasificación con sus tareas.
        this.getTaskClassificators();
        this.getUsersOfWork();
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private tasksService: TasksService,
        private notifyTaskChangeService: NotifyTaskChangesService,
        public dialog: MatDialog,
        private workService: WorkListService,
        private userService: UserService
    ) {

    }

    ngOnInit(): void {
        this.idWork = this.route.snapshot.params['idWork'];
        this.getTaskClassificators();
        this.getUsersOfWork()

        this.onResize(null);


    }

    getTaskClassificators() {
        this.tasksService.getTaskClassificatorsByWorkId(this.idWork).subscribe(res1 => {
            this.taskClassificators = res1;
            this.taskClassificators.sort((a, b) => {
                return a.order - b.order
            })
        })
    }



    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.taskClassificators, event.previousIndex, event.currentIndex);
    }

    dropTask(event: CdkDragDrop<Task[]>, taskClassificator: TaskClassificator) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex)
            var taskMoved = event.container.data[event.currentIndex.valueOf()];

            this.tasksService.updateTaskClassification(taskClassificator._id, taskMoved._id, sessionStorage.getItem("id") as string).subscribe(updated => {
                console.log(updated)
                this.notifyTaskChangeService.notifyChangeTask();

            })
        }

    }

    newTaskClassificator() {
        //Crea el nuevo clasificador.
        this.tasksService.createTaskClassificator(this.idWork, sessionStorage.getItem("id") as string).subscribe(response => {
            this.getTaskClassificators();
            this.notifyTaskChangeService.notifyChangeTask();


        });

    }

    deleteTaskClassificator(id: string) {
        this.tasksService.deleteTaskClassificator(this.idWork, id, sessionStorage.getItem("id") as string).subscribe(response => {
            this.getTaskClassificators();
            this.notifyTaskChangeService.notifyChangeTask();

        });

    }


    checkTitle(event: any, title: string, id: string) {

        if (title.trim().length <= 30 && title.trim().length > 0) {
            +

                this.updateTaskClassificator(title, id)
        }
        else {
            this.getTaskClassificators();
        }
    }


    updateTaskClassificator(title: string, id: string) {
        this.tasksService.updateTaskClassificator(title, id, sessionStorage.getItem("id") as string).subscribe(res => {
            this.getTaskClassificators();
            this.notifyTaskChangeService.notifyChangeTask();


        })

    }
    updateTask(task: any) {
        let config: MatDialogConfig = {
            height: "60%",
            width: "60%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: null, taskId: task._id, tasksClassificatorList: this.taskClassificators, usersOfWork: this.usersOfWork }
        }

        const dialogRef = this.dialog.open(DialogManageTask, config);
        dialogRef.afterClosed().subscribe(result => {
            this.getUsersOfWork();
            this.getTaskClassificators();
            this.notifyTaskChangeService.notifyChangeTask();

        });
    }

    closeMenu(menuTrigger: MatMenuTrigger) {
        menuTrigger.closeMenu();
    }

    onOrderChange(event: any) {
        this.tasksService.updateTaskClassificatorsOrder(this.idWork, event.value[1], event.value[0]).subscribe(res => {
            this.getTaskClassificators();
            this.notifyTaskChangeService.notifyChangeTask();

        })


    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (window.innerWidth < 800) {
            this.largeScreen = false;
        } else {
            this.largeScreen = true;

        }
    }

    getUsersOfWork() {
        this.usersOfWork = [];
        this.workService.getWorkById(this.idWork).subscribe((res) => {
            res.data.teachers.forEach((teacher: any) => {
                this.userService.getUserById(teacher).subscribe(res => {
                    this.usersOfWork.push(res.data.user)
                })
            })
            res.data.students.forEach((student: any) => {
                this.userService.getUserById(student).subscribe(res => {
                    this.usersOfWork.push(res.data.user)
                })
            })
        })
    }

}


