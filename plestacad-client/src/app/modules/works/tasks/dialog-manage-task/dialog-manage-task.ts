import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { DatePipe } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { NotifyNewTaskService } from "src/app/shared/services/notify-new-task.service";
import { TaskClassificator } from "../models/TaskClassificator.model";
import { TasksService } from "../tasks.service";


export interface DialogManageTaskData {
    workId: string;
    start: any;
    taskId: string;
    tasksClassificatorList: TaskClassificator[]

}

@Component({
    selector: 'dialog-manage-task.html',
    templateUrl: 'dialog-manage-task.html',
    styleUrls: ['dialog-manage-task.scss']

})
export class DialogManageTask {

    form!: FormGroup;

    htmlContent!: any;
    formControl!: FormControl;

    invalidTitle!: boolean;
    invalidDescription!: boolean;

    updating!: boolean;

    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    hasErrors: boolean = false;


    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogManageTask>, private route: ActivatedRoute, private tasksService: TasksService, private notifyNewTaskService: NotifyNewTaskService
        ,@Inject(MAT_DIALOG_DATA) public data: DialogManageTaskData
    ) {

        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(60)]],
            description: ['', []],
            start: ['', []],
            end: ['', []],
            taskClassificatorId: ['', []]
        });

        if (this.data.taskId != null) {  //el usuario esta modificando un evento.                  
            this.updating = true;
            console.log("taskId", this.data.taskId);
            //llamar al servicio de tareas y cargar los datos de la tarea
            this.tasksService.getTaskById(this.data.taskId).subscribe(task => {
                this.form.controls["title"].setValue(task.title);
                this.form.controls["description"].setValue(task.description);
                var pipe = new DatePipe('es-ES');

                if(task.start!=null){
                    var startDateTime = (new Date(task.start));
                    this.form.controls["start"].setValue(pipe.transform(startDateTime, 'yyyy-MM-ddTHH:mm')); //se formatea la fecha del datepicker    
                }

                if(task.end!=null){
                    var endDateTime = (new Date(task.end));
                    this.form.controls["end"].setValue(pipe.transform(endDateTime, 'yyyy-MM-ddTHH:mm'));    
                }

                this.form.controls["taskClassificatorId"].setValue(task.taskClassificatorId);



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

    private dateValidator() {
        var endDate = new Date(this.form.controls["end"].value)
        var startDate = new Date(this.form.controls["start"].value)

        if (endDate.getTime() < startDate.getTime()) {
            this.hasErrors = true;

        } else {
            this.hasErrors = false;

        }
    }

    deleteTask(){
        this.tasksService.deleteTask(this.data.taskId, sessionStorage.getItem("id") as string).subscribe(task => {
            this.notifyNewTaskService.notifyChangeTask();
            this.dialogRef.close();

        })
    }

    onClick() {
        console.log(this.form)
        if (this.form.valid && !this.hasErrors) {
            const title = this.form.get("title")?.value;
            const description = this.form.get("description")?.value;
            const start = this.form.get("start")?.value;
            const end = this.form.get("end")?.value;
            const taskClassificatorId = this.form.get("taskClassificatorId")?.value;
            const userAssignedId = sessionStorage.getItem('id') as string; //Cambiar más adelante cuando se implementen los miembros del trabajo.


            if(!this.updating){
                this.tasksService.createTask(this.data.workId, title, description, start, end, taskClassificatorId, userAssignedId, sessionStorage.getItem("id") as string).subscribe(result => {
                    console.log("result")
                })
            } else{
                this.tasksService.updateTask(this.data.taskId, title, description,start, end, taskClassificatorId, userAssignedId, sessionStorage.getItem("id") as string).subscribe(result => {
                    console.log("updated task")
                })
            }

            this.dialogRef.close();
        } else {
            console.log("Error")
        }
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

}

