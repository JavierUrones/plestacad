import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { DatePipe } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { User } from "src/app/shared/models/user.model";
import { NotifyNewTaskService } from "src/app/shared/services/notify-new-task.service";
import { TaskClassificator } from "../models/TaskClassificator.model";
import { TasksService } from "../tasks.service";


/** Interfaz para el intercambio de datos con el dialogo de creación/modificación de tareas */
export interface DialogManageTaskData {
    /** Id del trabajo académico */
    workId: string;
    /** Fecha de inicio */
    start: any;
    /** Id de la tarea */
    taskId: string;
    /** Lista de apartados de clasificación posibles para la tarea */
    tasksClassificatorList: TaskClassificator[]
    /** Lista de usuarios asignables a la tarea */
    usersOfWork: User[];
}

/** Define el diálogo de creación/modificación de tareas */
@Component({
    selector: 'dialog-manage-task.html',
    templateUrl: 'dialog-manage-task.html',
    styleUrls: ['dialog-manage-task.scss']

})
export class DialogManageTask {

    /** Formulario de datos de la tarea */
    form!: FormGroup;

    htmlContent!: any;
    /** FormControl del formulario de datos de la tarea */
    formControl!: FormControl;

    /** Atributo que determina si el título de la tarea es válido o no */
    invalidTitle!: boolean;
    /** Atributo que determina si una descripción es válida o no */
    invalidDescription!: boolean;

    /** Indica si la tarea se está actualizando o se está creando */
    updating!: boolean;

    /** Determina si el formulario tiene errores o no */
    hasErrors: boolean = false;


    constructor(private fb: FormBuilder, private _errorBar: MatSnackBar,
        public dialogRef: MatDialogRef<DialogManageTask>, private route: ActivatedRoute, private tasksService: TasksService, private notifyNewTaskService: NotifyNewTaskService
        , @Inject(MAT_DIALOG_DATA) public data: DialogManageTaskData
    ) {

        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(60)]],
            description: ['', []],
            start: ['', []],
            end: ['', []],
            taskClassificatorId: ['', []],
            userAssignedId: ['', []]
        });

        if (this.data.taskId != null) {  //el usuario esta modificando un evento.                  
            this.updating = true;
            //llamar al servicio de tareas y cargar los datos de la tarea
            this.tasksService.getTaskById(this.data.taskId).subscribe(task => {
                this.form.controls["title"].setValue(task.title);
                this.form.controls["description"].setValue(task.description);
                var pipe = new DatePipe('es-ES');

                if (task.start != null) {
                    var startDateTime = (new Date(task.start));
                    this.form.controls["start"].setValue(pipe.transform(startDateTime, 'yyyy-MM-ddTHH:mm')); //se formatea la fecha del datepicker    
                }

                if (task.end != null) {
                    var endDateTime = (new Date(task.end));
                    this.form.controls["end"].setValue(pipe.transform(endDateTime, 'yyyy-MM-ddTHH:mm'));
                }

                this.form.controls["taskClassificatorId"].setValue(task.taskClassificatorId);
                this.form.controls["userAssignedId"].setValue(task.userAssignedId);



            })
        } else {
            this.form.controls['taskClassificatorId'].setValue(this.data.tasksClassificatorList[0]._id);
        }
        this.form.controls["end"].valueChanges.subscribe((form) => {
            this.dateValidator();
        })
    }
    ngOnInit() {

    }

    /** Validador de fechas, comprueba que la fecha de inicio sea anterior a la fecha de fin. */
    private dateValidator() {
        var endDate = new Date(this.form.controls["end"].value)
        var startDate = new Date(this.form.controls["start"].value)

        if (endDate.getTime() < startDate.getTime()) {
            this.hasErrors = true;

        } else {
            this.hasErrors = false;

        }
    }

    /** Se dispara cuando el usuario pulsa el botón de eliminar cuando está actualizando una tarea. Llama al servicio se borrar tareas pasándole los datos de la tarea a borrar. */
    deleteTask() {
        this.tasksService.deleteTask(this.data.taskId, sessionStorage.getItem("id") as string).subscribe(task => {
            this.notifyNewTaskService.notifyChangeTask();
            this.dialogRef.close();

        })
    }

    /** 
     * Se dispara cuando el usuario pulsa el botón de crear/actualizar una tarea
     * Valida los datos del formulario y posteriormente llama al servicio de crear o actualizar la tarea con los datos del formulario.
     */
    onClick() {
        if (this.form.valid && !this.hasErrors) {
            const title = this.form.get("title")?.value;
            const description = this.form.get("description")?.value;
            const start = this.form.get("start")?.value;
            const end = this.form.get("end")?.value;
            const taskClassificatorId = this.form.get("taskClassificatorId")?.value;
            const userAssignedId = this.form.get("userAssignedId")?.value; //Cambiar más adelante cuando se implementen los miembros del trabajo.

            if (!this.updating) {
                this.tasksService.createTask(this.data.workId, title, description, start, end, taskClassificatorId, userAssignedId, sessionStorage.getItem("id") as string).subscribe({
                    next: (response) => {

                    },
                    error: (e) => {
                        this._errorBar.open("Ha ocurrido un error al crear la tarea.", "X", { duration: 2000 })
                    },
                });
            } else {
                this.tasksService.updateTask(this.data.taskId, title, description, start, end, taskClassificatorId, userAssignedId, sessionStorage.getItem("id") as string).subscribe({
                    next: (response) => {

                    },
                    error: (e) => {
                        this._errorBar.open("Ha ocurrido un error al modificar la tarea.", "X", { duration: 2000 })
                    },
                });
            }

            this.dialogRef.close();
        } 
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

}

