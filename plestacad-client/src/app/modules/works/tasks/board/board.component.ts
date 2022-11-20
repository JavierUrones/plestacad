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
import { WorkService } from '../../../../shared/services/work.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})

/** Define el componente de tablero kanban de tareas */
export class BoardComponent implements OnInit {
    /** Id del trabajo académico */
    idWork!: string;
    /** Atributo que comprueba el tamaño de pantalla del cliente */
    largeScreen!: boolean;
    /** Apartados de clasificación de tareas */
    taskClassificators!: TaskClassificator[];
    /** Usuarios del trabajo académico */
    usersOfWork: any[] = [];
    /** Atributo que coloca el foco en el nuevo apartado de clasificación de tareas creado. */
    focusClassificator =  false;

    /** Suscripción al servicio de notificación de creación/actualización de tareas */
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
        private workService: WorkService,
        private userService: UserService
    ) {

    }


    ngOnInit(): void {
        this.idWork = this.route.snapshot.params['idWork'];
        this.getTaskClassificators();
        this.getUsersOfWork()

        this.onResize(null);


    }

    /** Obtiene los apartados de clasificación de tareas del trabajo académico */
    getTaskClassificators() {
        this.focusClassificator = false;
        this.tasksService.getTaskClassificatorsByWorkId(this.idWork).subscribe(res1 => {
            this.taskClassificators = res1;
            this.taskClassificators.sort((a, b) => {
                return a.order - b.order
            })
        })
    }

      /**
     * Mueve una tarea entre los distintos apartados de clasificacion. Se dispara cuando usuario suelta con el ratón la tarea en un apartado.
     * @param event - datos de la tarea arrastrada que se acaba de soltar.
     * @param taskClassificator - nuevo apartado de clasificación de la tarea.
     */
    dropTask(event: CdkDragDrop<Task[]>, taskClassificator: TaskClassificator) {
        this.focusClassificator = false;
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex)
            var taskMoved = event.container.data[event.currentIndex.valueOf()];

            this.tasksService.updateTaskClassification(taskClassificator._id, taskMoved._id, sessionStorage.getItem("id") as string).subscribe(updated => {
                this.notifyTaskChangeService.notifyChangeTask();

            })
        }

    }

    /** Llama al servicio de creación de nuevos apartados de clasificación de tareas pasándole los atributos requeridos. Se dispara cuando el usuario pulsa el botón de crear nuevo apartado de clasificación. */
    newTaskClassificator() {
        //Crea el nuevo clasificador.
        this.tasksService.createTaskClassificator(this.idWork, sessionStorage.getItem("id") as string).subscribe(response => {
            this.getTaskClassificators();
            this.notifyTaskChangeService.notifyChangeTask();
            this.focusClassificator = true;

        });

    }

    /**
     * Elimina un apartado de clasificación de tareas a partir de su id llamando al servicio de tareas.
     * @param id - id del apartado de clasificación
     */
    deleteTaskClassificator(id: string) {
        this.tasksService.deleteTaskClassificator(this.idWork, id, sessionStorage.getItem("id") as string).subscribe(response => {
            this.getTaskClassificators();
            this.notifyTaskChangeService.notifyChangeTask();

        });

    }

    /**
     * Comprueba si un título introducido es válido para un apartado de clasificación de tareas.
     * Si el título es válido llama a la función para actualizar el apartado de clasificación, en caso contrario recarga los apartados de clasificación del trabajo académico.
     * @param event - evento que se dispara al cambiar el título
     * @param title - nuevo título introducido
     * @param id - id del apartado de clasificación de tareas
     */
    checkTitle(event: any, title: string, id: string) {

        if (title.trim().length <= 30 && title.trim().length > 0) {
            this.updateTaskClassificator(title, id)
        }
        else {
            this.getTaskClassificators();
        }
    }


    /** Llama al servicio para actualizar el título de un apartado de clasificación de tareas pasándole los atributos requeridos.
     *  Luego recarga la lista de apartados de clasificación.
     *  @param title - nuevo título del apartado de clasificación
     *  @param id - id del apartado de clasificación
     *   */
    updateTaskClassificator(title: string, id: string) {
        this.focusClassificator = false;
        this.tasksService.updateTaskClassificator(title, id, sessionStorage.getItem("id") as string).subscribe(res => {
            this.getTaskClassificators();
            this.notifyTaskChangeService.notifyChangeTask();


        })

    }

    /**
     * Abre el diálogo para actualizar una tarea. Se dispara cuando el usuario pulsa sobre una tarea en el tablero.
     * @param task - datos de la tarea.
     */
    updateTask(task: any) {
        this.focusClassificator = false;
        let config: MatDialogConfig = {
            height: "60%",
            width: "60%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: null, taskId: task._id, tasksClassificatorList: this.taskClassificators, usersOfWork: this.usersOfWork }
        }

        const dialogRef = this.dialog.open(DialogManageTask, config);
        dialogRef.afterClosed().subscribe(result => {

            this.notifyTaskChangeService.notifyChangeTask();

        });
    }

    /**
     * Cierra el menú lateral de opciones de un apartado de clasificación de tareas.
     * @param menuTrigger - permite cerrar el menú del apartado de clasificación.
     */
    closeMenu(menuTrigger: MatMenuTrigger) {
        this.focusClassificator = false;
        menuTrigger.closeMenu();
    }

    /**
     * Se dispara cuando el usuario cambia el orden de un apartado de clasificación de tareas en el tablero.
     * @param event - evento que se dispara cuando el usuario cambia el orden.
     */
    onOrderChange(event: any) {
        this.focusClassificator = false;
        this.tasksService.updateTaskClassificatorsOrder(this.idWork, event.value[1], event.value[0]).subscribe(res => {
            this.getTaskClassificators();
            this.notifyTaskChangeService.notifyChangeTask();

        })


    }

    /**
     * Se dispara cuando el usuario cambia el tamaño de la pantalla y dependiendo del tamaño de esta cambia el valor del atributo largeScreen.
     * @param event - datos del evento disparado.
     */
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (window.innerWidth < 800) {
            this.largeScreen = false;
        } else {
            this.largeScreen = true;

        }
    }

    /**
     * Obtiene la lista de usuarios que son asignables a una tarea a partir de los servicios de trabajos y de usuarios. Almacena este valor en la variable usersOfWork.
     */
    getUsersOfWork() {
        this.focusClassificator = false;
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


