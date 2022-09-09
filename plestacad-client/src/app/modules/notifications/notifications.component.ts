import { Component, OnInit } from '@angular/core';
import { Work } from 'src/app/shared/models/work.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkListService } from '../works/work-list.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {


    allNotifications: any[] = [];
    notifications: any[] = [];

    loading: boolean = false;
    workOptions: any[] = []
    selectedWork!: any;
    constructor(private notificationService: NotificationService, private userService: UserService, private workService: WorkListService) { }


    ngOnInit(): void {

        this.loadNotifications()
        this.workService.getWorksByUserId(sessionStorage.getItem("id") as string).subscribe(response => {
            this.workOptions = response;
        });
        this.selectedWork = "all";
    }

    onFilterChange(event: any) {
        console.log(this.selectedWork, event)
        if (event.value == "all") {
            this.loadNotifications();
        } else {
            const result = this.allNotifications.filter(notification =>
                notification.workId == event.value
            );
            this.notifications = result;
        }
    }

    loadNotifications() {
        this.loading = true;

        this.allNotifications = [];
        this.notifications = [];
        this.notificationService.getNotificationsByUserReceiverId(sessionStorage.getItem("id") as string).subscribe(response => {
            response.data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            response.data.forEach((notification: any) => {
                var formattedDescription = this.evaluateNotificationDescription(notification.description, notification.userFullnameResponsible, notification.workTitle, notification.workId, notification.mainContent)
                notification.description = formattedDescription;
                this.allNotifications.push(notification);
                this.notifications.push(notification);

            })




            this.loading = false;

        }
        )
    }


    evaluateNotificationDescription(description: string, userFullnameResponsible: string, workTitle: string, workId: string, mainContent: string) {
        switch (description) {
            case "new-post":
                return "El usuario " + userFullnameResponsible + " ha creado un nuevo post '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "new-interaction":
                return "El usuario " + userFullnameResponsible + " ha respondido al post '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "new-directory":
                return "El usuario " + userFullnameResponsible + " ha creado un nuevo directorio '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "new-file":
                return "El usuario " + userFullnameResponsible + " ha subido un nuevo archivo '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "delete-directory":
                return "El usuario " + userFullnameResponsible + " ha eliminado el directorio '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "delete-file":
                return "El usuario " + userFullnameResponsible + " ha eliminado el archivo '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "new-event-calendar":
                return "El usuario " + userFullnameResponsible + " ha creado el evento '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "delete-event-calendar":
                return "El usuario " + userFullnameResponsible + " ha eliminado el evento '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "update-event-calendar":
                return "El usuario " + userFullnameResponsible + " ha actualizado el evento '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "new-task":
                return "El usuario " + userFullnameResponsible + " ha creado la tarea '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "new-task-classificator":
                return "El usuario " + userFullnameResponsible + " ha creado el apartado de clasificación de tareas '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "delete-task":
                return "El usuario " + userFullnameResponsible + " ha borrado la tarea '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "delete-task-classificator":
                return "El usuario " + userFullnameResponsible + " ha borrado el apartado de clasificación de tareas '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "update-task":
                return "El usuario " + userFullnameResponsible + " ha actualizado la tarea '" + mainContent + "' en el trabajo " + workTitle + ".";
            case "moved-task":
                return "El usuario " + userFullnameResponsible + " ha cambiado la clasificación de la tarea '" + mainContent + "' en el trabajo " + workTitle + ".";

            default:
                return "No hay descripción para esta notificación"
        }
    }


    markNotificationAsRead(notificationId: string) {
        this.notificationService.markAsRead(notificationId, sessionStorage.getItem("id") as string).subscribe(response => {
            this.allNotifications = [];
            this.notifications = [];
            this.loadNotifications();
        })
    }


    markAllAsRead() {
        this.allNotifications.forEach((notification: any) => {
            this.markNotificationAsRead(notification._id)
        })
    }

}
