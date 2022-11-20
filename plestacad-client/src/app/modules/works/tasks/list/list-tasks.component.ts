import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { NotifyNewTaskService } from "src/app/shared/services/notify-new-task.service";
import { UserService } from "src/app/shared/services/user.service";
import { WorkService } from "../../../../shared/services/work.service";
import { DialogManageTask } from "../dialog-manage-task/dialog-manage-task";
import { TaskClassificator } from "../models/TaskClassificator.model";
import { TasksService } from "../tasks.service";
import { NotifyTaskChangesService } from "./notify-task-changes.service";

@Component({
    selector: 'app-list-tasks',
    templateUrl: './list-tasks.component.html',
    styleUrls: ['./list-tasks.component.scss'],
})
/** Define el componente de lista de tareas */
export class ListTasksComponent implements OnInit, AfterViewInit {
    /** Usuarios del trabajo académico */
    usersOfWork: any[] = [];
    /** Id del trabajo académico */
    idWork!: string;
    //tasks!: Task[];
    /** Lista de apartados de clasificación de tareas */
    taskClassificatorsSelector!: TaskClassificator[];
    /** Columnas de la tabla */
    definedColumns: string[] = ['title', 'start', 'end', 'taskClassificatorId', 'userAssignedId', '_id'];
    /** Tareas de la tabla */
    tasks: MatTableDataSource<Task> = new MatTableDataSource();
    /** Paginador de la tabla */
    @ViewChild('paginator') paginator!: MatPaginator;
    /** Posibles tamaños de cada página de la tabla */
    pageSizes = [5, 10, 15];
    /** Componente de ordenación de la tabla */
    @ViewChild('sortElements') sortElements = new MatSort();

    /** Setter paginador tareas */
    @ViewChild('paginator') set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.tasks.paginator = this.paginator;
    }

    /** Ordenacion tabla tareas */
    @ViewChild("sortElements") set matSort(ms: MatSort) {
        this.tasks.sort = ms;
    }

    /** Opciones de ordenación de la tabla */
    optionsOrder: any[] = [
        { value: 'classification', name: 'Clasificación' },
        { value: 'title', disabled: true, name: 'Título' },
        { value: 'dateStart', disabled: true, name: 'Fecha de inicio' },
        { value: 'dateEnd', disabled: true, name: 'Fecha de fin' },
    ];

    /** Opción seleccionada de ordenación */
    selectedOrderOption = this.optionsOrder[0].value;
    constructor(private route: ActivatedRoute, private userService: UserService, private workService: WorkService,
        private tasksService: TasksService, private dateAdapter: DateAdapter<Date>, public dialog: MatDialog, private notifyNewTaskService: NotifyNewTaskService, private notifyTaskChangeService: NotifyTaskChangesService) {
        this.dateAdapter.setLocale('es-Es');
    }

    /** Suscripción al servicio de notificación de nuevas tareas. */
    notifierSubscription: Subscription = this.notifyTaskChangeService.subjectNotifier.subscribe(notice => {
        //se ha producido cambios en las tareas, se debe recargar la lista de tareas y de apartados de clasificación
        this.getTasks();
        this.getTaskClassificators();
    });


    ngOnInit(): void {
        this.idWork = this.route.snapshot.params['idWork'];
        this.getTasks();
        this.getTaskClassificators();
        this.getUsersOfWork();
    }

    ngAfterViewInit() {
        this.tasks.sort = this.sortElements;
        this.tasks.paginator = this.paginator;
    }

    /** Evento que se dispara cuado se ordena una columna de la tabla. Define los distintos criterios de ordenación según la columna. */
    onOrderChange(event: any) {
        switch (event) {
            case "title":
                this.tasks.data.sort((a: any, b: any) => {
                    if (a.title < b.title) {
                        return -1;
                    } else if (a.title > b.title) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                break;
            case "dateStart":
                this.tasks.data.sort((a: any, b: any) => {
                    if (a.start < b.start) {
                        return -1;
                    } else if (a.start > b.start) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                break;
            case "dateEnd":
                break;
            case "classification":
                break;
        }
    }

    /** Obtiene la lista de tareas del trabajo académico. */
    getTasks() {
        this.tasksService.getTasksByWorkId(this.idWork).subscribe(res => {
            this.tasks.data = res;
        })
    }

    /** Obtiene los apartados de clasificación de un trabajo académico. */
    getTaskClassificators() {
        this.tasksService.getTaskClassificatorsByWorkId(this.idWork).subscribe(res1 => {
            this.taskClassificatorsSelector = res1;
            this.taskClassificatorsSelector.sort((a, b) => {
                return a.order - b.order
            })
        })
    }

    /** Abre el diálogo de creación de nuevas tareas y actualiza la lista de tareas cuando este se cierra. */
    newTask() {

        let config: MatDialogConfig = {
            height: "70%",
            width: "100%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: null, taskId: null, tasksClassificatorList: this.taskClassificatorsSelector, usersOfWork: this.usersOfWork }
        }

        const dialogRef = this.dialog.open(DialogManageTask, config);
        dialogRef.afterClosed().subscribe(result => {
            this.getUsersOfWork();
            this.getTasks();
            this.notifyTaskChangeService.notifyChangeTask();
            this.notifyNewTaskService.notifyChangeTask();
        });


    }

    /** Abre el diálogo de actualización de tareas y actualiza la lista de tareas cuando este se cierra.
     * @param _id - id de la tarea a actualizar.
     */
    updateTask(_id: string) {
        let config: MatDialogConfig = {
            height: "60%",
            width: "60%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: null, taskId: _id, tasksClassificatorList: this.taskClassificatorsSelector, usersOfWork: this.usersOfWork }
        }

        const dialogRef = this.dialog.open(DialogManageTask, config);
        dialogRef.afterClosed().subscribe(result => {
            this.getTasks();
            this.notifyTaskChangeService.notifyChangeTask();
            this.notifyNewTaskService.notifyChangeTask();

        });
    }


    /** Llama al servicio para actualizar la clasificación de una tarea. Se dispara cuando el usuario cambia la clasificación de una tarea desde el selector de la tabla.
     * @param taskClassificatorId - id del nuevo apartado de clasificación de la tarea
     * @param idTask - id de la tarea.
     */
    onTaskClassificatorChange(taskClassificatorId: string, idTask: string) {
        this.tasksService.updateTaskClassification(taskClassificatorId, idTask, sessionStorage.getItem("id") as string).subscribe((res => {
            this.getTasks();
            this.notifyTaskChangeService.notifyChangeTask();
            this.notifyNewTaskService.notifyChangeTask();

        }))
    }

    /**
     * Llama al servicio para obtener el nombre completo del usuario a partir de su id.
     * @param userId - id del usuario.
     */
    getUserName(userId: string) {
        this.userService.getFullNameById(userId).subscribe((res) => {
            return res.data.fullname;
        })
    }

    /** Llama al servicio para obtener la lista de usuarios del trabajo académico para poder asignarles una tarea. */
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