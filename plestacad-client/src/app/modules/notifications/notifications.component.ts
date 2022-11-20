import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { WorkService } from '../../shared/services/work.service';
import { Notification } from './models/notification.model';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
/** Define el componente de notificaciones del usuario */
export class NotificationsComponent implements OnInit {

    /** Lista con todas las notificaciones del usuario */
    allNotifications: Notification[] = [];
    /** Lista sensible al componente de filtrado por trabajo académico que contiene las notificaciones a mostrar al usuario. */
    notifications: Notification[] = [];

    /** Atributo que comprueba si el componente está cargando datos desde el servidor */
    loading: boolean = false;
    /** Opciones de trbajos académicos seleccionables para poder filtrar por trabajo académico desde el componente selector. */
    workOptions: any[] = []
    /** Trabajo académico seleccionado desde el componente selector */
    selectedWork!: any;
    constructor(private notificationService: NotificationService, private workService: WorkService) { }


    ngOnInit(): void {

        this.loadNotifications()
        this.workService.getWorksByUserId(sessionStorage.getItem("id") as string).subscribe(response => {
            this.workOptions = response;
        });
        this.selectedWork = "all";
    }

    /**
     * Se dispara cuando el usuario filtra por trabajo académico desde el componente selector.
     * @param event - datos del evento con el trabajo académico que ha filtrado el usuario.
     */
    onFilterChange(event: any) {
        if (event.value == "all") {
            this.loadNotifications();
        } else {
            const result = this.allNotifications.filter(notification =>
                notification.workId == event.value
            );
            this.notifications = result;
        }
    }

    /** Carga todas las notificaciones del usuario a partir del servicio de notificaciones. */
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


    /** Evalúa la descripción de la notificación para mostrar el mensaje correcto al usuario.
     * @param description - descripción de la notificación
     * @param userFullnameResponsible - nombre del usuario que ha hecho que se dispare esa notificación
     * @param workTitle - título del trabajo académico al que corresponde la notificación
     * @param workId - id del trabajo académico al que corresponde la notificación.
     * @param mainContent - información sobre donde se ha producido o la acción que ha producido esa notificación.
     */
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

    /**
     * Marca una notificación como leída llamando al servicio de notificaciones.
     * @param notificationId - id de la notificación a marcar como leída.
     */
    markNotificationAsRead(notificationId: string) {
        this.notificationService.markAsRead(notificationId, sessionStorage.getItem("id") as string).subscribe(response => {
            this.allNotifications = [];
            this.notifications = [];
            this.loadNotifications();
        })
    }

    /** Marca todas las notificaciones como leídas. */
    markAllAsRead() {
        this.allNotifications.forEach((notification: any) => {
            this.markNotificationAsRead(notification._id)
        })
    }

}
