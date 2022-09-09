import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { NotifyNewTaskService } from "src/app/shared/services/notify-new-task.service";
import { DialogManageTask } from "../dialog-manage-task/dialog-manage-task";
import { TaskClassificator } from "../models/TaskClassificator.model";
import { TasksService } from "../tasks.service";
import { NotifyTaskChangesService } from "./notify-task-changes.service";

@Component({
    selector: 'app-list-tasks',
    templateUrl: './list-tasks.component.html',
    styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnInit, AfterViewInit {

    idWork!: string;
    //tasks!: Task[];
    taskClassificatorsSelector!: TaskClassificator[];
    definedColumns: string[] = ['title', 'start', 'end', 'taskClassificatorId', 'userAssignedId', '_id'];
    tasks: MatTableDataSource<Task> = new MatTableDataSource();
    @ViewChild('paginator') paginator!: MatPaginator;
    pageSizes = [5,10,15];
    @ViewChild('sortElements') sortElements = new MatSort();


    optionsOrder : any[]   = [
        { value: 'classification', name: 'Clasificación' },
        { value: 'title', name: 'Título' },
        { value: 'dateStart', name: 'Fecha de inicio' },
        { value: 'dateEnd', name: 'Fecha de fin' },
      ];


      selectedOrderOption = this.optionsOrder[0].value;
    constructor(private route: ActivatedRoute,
        private tasksService: TasksService, private dateAdapter: DateAdapter<Date>,  public dialog: MatDialog, private notifyNewTaskService: NotifyNewTaskService, private notifyTaskChangeService: NotifyTaskChangesService) {
        this.dateAdapter.setLocale('es-Es');


    }
    

    notifierSubscription: Subscription = this.notifyTaskChangeService.subjectNotifier.subscribe(notice => {
        //se ha producido cambios en las tareas, se debe recargar la lista de tareas y de apartados de clasificación
        this.getTasks();
        console.log(this.tasks)
        this.getTaskClassificators();
        console.log("actualiación en la lista de tareas")
      });
      

    ngOnInit(): void {
        this.idWork = this.route.snapshot.params['idWork'];
        this.getTasks();
        this.getTaskClassificators();
    }

    ngAfterViewInit() {
        this.tasks.sort = this.sortElements;
        this.tasks.paginator = this.paginator;
    }


    onOrderChange(event: any){
        switch(event){
            case "title":
                this.tasks.data.sort((a: any, b: any) => {
                    if(a.title < b.title){
                        return -1;
                    } else if (a.title > b.title){
                        return 1;
                    } else{
                        return 0;
                    }
                })
                break;
            case "dateStart":
                this.tasks.data.sort((a: any, b: any) => {
                    if(a.start < b.start){
                        return -1;
                    } else if (a.start > b.start){
                        return 1;
                    } else{
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
    
    getTasks() {
        this.tasksService.getTasksByWorkId(this.idWork).subscribe(res => {
            this.tasks.data = res;
        })
    }

    getTaskClassificators() {
        this.tasksService.getTaskClassificatorsByWorkId(this.idWork).subscribe(res1 => {
            this.taskClassificatorsSelector = res1;
            this.taskClassificatorsSelector.sort((a, b) => {
                return a.order - b.order
            })
        })
    }

    newTask() {

        let config: MatDialogConfig = {
            height: "70%",
            width: "100%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: null, taskId: null, tasksClassificatorList: this.taskClassificatorsSelector }
        }

        const dialogRef = this.dialog.open(DialogManageTask, config);
        dialogRef.afterClosed().subscribe(result => {
            console.log("closed")
            this.getTasks();
            this.notifyTaskChangeService.notifyChangeTask();
            this.notifyNewTaskService.notifyChangeTask();
        });


    }

    updateTask(_id: string){
        let config: MatDialogConfig = {
            height: "60%",
            width: "60%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: null, taskId: _id, tasksClassificatorList: this.taskClassificatorsSelector }
        }

        const dialogRef = this.dialog.open(DialogManageTask, config);
        dialogRef.afterClosed().subscribe(result => {
            console.log("closed")
            this.getTasks();
            this.notifyTaskChangeService.notifyChangeTask();
            this.notifyNewTaskService.notifyChangeTask();

        });  
    }


    onTaskClassificatorChange(taskClassificatorId: string, idTask: string){
        this.tasksService.updateTaskClassification(taskClassificatorId, idTask, sessionStorage.getItem("id") as string).subscribe((res => {
            this.getTasks();
            this.notifyTaskChangeService.notifyChangeTask();
            this.notifyNewTaskService.notifyChangeTask();

        }))

    }
}