import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { CalendarService } from './calendar.service';
import { Subscription } from 'rxjs';
//@ts-ignore
import esLocale from '@fullcalendar/core/locales/es';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyNewTaskService } from 'src/app/shared/services/notify-new-task.service';
import { DialogNewEvent } from './modal-events/modal-events';
import { CalendarEvent } from './models/calendar-event.model';
@Component({
    selector: 'app-calendar-work',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
})
/** Define el componente de calendario de un trabajo académico. */
export class CalendarWorkComponent implements OnInit {

    constructor(private notifyNewTaskService: NotifyNewTaskService, private _notificationBar: MatSnackBar, private calendarService: CalendarService, private route: ActivatedRoute, public dialog: MatDialog
    ) { }

    /** Lista de eventos del calendario */
    events: CalendarEvent[] = [];
    /** Opciones del selector de filtrado por evento o tarea. */
    options: any;
    /** Id del trabajo académico */
    idWork!: string;
    /** Valor seleccionado en el selector de filtrado */
    selectedFilterValue!: string;
    /** Suscripción al servicio de notificación de nuevas tareas. */
    notifierNewTask: Subscription = this.notifyNewTaskService.subjectNotifier.subscribe(notice => {
        this.getCalendarEvents();
    });

    ngOnInit(): void {
        this.idWork = this.route.snapshot.params['idWork'];
        this.getCalendarEvents();
        this.selectedFilterValue = "all";
        this.options = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'timeGridWeek',
            defaultDate: new Date(),
            height: 600,
            dateClick: this.handleDateClick.bind(this),
            eventClick: this.handleEventClick.bind(this),
            eventDrop: this.handleEventDrop.bind(this),
            eventResize: this.handleEventResize.bind(this),
            locale: esLocale,
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridDay,timeGridWeek ',
            },
            editable: true,
            timezone: 'local',
            eventInteractive: true
        }


    }


    /** Llama al servicio para obtener los eventos del calendario del trabajo académico en cuestión. */
    getCalendarEvents() {
        this.calendarService.getCalendarEventsByWorkId(this.idWork).subscribe((response) => {
            response.data.forEach((element: {
                id: any; _id: any;
            }) => {
                element.id = element._id; //se hace esta asignación para que fullcalendar entienda el campo id.

            });
            this.events = response.data;

            this.events.forEach(element => {
                if (element.taskOriginId != undefined) {
                    element.color = "orange"
                    element.editable = false;
                    element.description = "Tarea"

                }
            })

        })
    }

    /** Filtra los eventos del calendario que están relacionados con tareas. */
    getCalendarEventsFilteredTasks() {
        //necesario hacerlo repitiendo el código de esta manera por motivos de funcionamiento de fullcalendar.
        this.calendarService.getCalendarEventsByWorkId(this.idWork).subscribe((response) => {
            response.data.forEach((element: {
                id: any; _id: any;
            }) => {
                element.id = element._id; //se hace esta asignación para que fullcalendar entienda el campo id.

            });
            this.events = response.data;

            this.events.forEach(element => {
                if (element.taskOriginId != undefined) {
                    element.color = "orange"
                    element.editable = false;
                    element.description = "Tarea"

                }
            })

            this.events = this.events.filter(element => element.taskOriginId != undefined)

        })
    }

    /** Filtra los eventos del calendarios nativos, excluyendo los relacionados con las tareas. */
    getCalendarEventsFilteredEvents() {
        this.calendarService.getCalendarEventsByWorkId(this.idWork).subscribe((response) => {
            response.data.forEach((element: {
                id: any; _id: any;
            }) => {
                element.id = element._id; //se hace esta asignación para que fullcalendar entienda el campo id.
            });
            this.events = response.data;

            this.events.forEach(element => {
                if (element.taskOriginId != undefined) {
                    element.color = "orange"
                    element.editable = false;
                    element.description = "Tarea"
                }
            })

            this.events = this.events.filter(element => element.taskOriginId == undefined)

        })
    }





    /** Evento que se dispara cuando se modifica el tamaño de un evento manualmente desde el componente fullcalendar
     * @param date - nueva fecha del evento.
     */
    handleEventResize(date: any) {

        this.calendarService.updateEvent(date.event.id, date.event.title, date.event.description, date.event.start, date.event.end, date.event.tags, sessionStorage.getItem("id") as string, this.idWork).subscribe((response) => {
        });
    }

    /** Evento que se dispara cuando se arrastra un evento en el componente fullcalendar
     * @param date - nueva fecha del evento
     */
    handleEventDrop(date: any) {
        this.calendarService.updateEvent(date.event.id, date.event.title, date.event.description, date.event.start, date.event.end, date.event.tags, sessionStorage.getItem("id") as string, this.idWork).subscribe((response) => {
        });

    }

    /** Evento que se dispara cuando se pulsa una fecha vacía del componente fullcalendar. Abre el diálogo de creación de eventos y recarga la lista de eventos del calendario cuando se cierra.
     * @param date - fecha seleccionada para la creación del nuevo evento.
     */
    handleDateClick(date: any) {
        let config: MatDialogConfig = {
            height: "70%",
            width: "100%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: date.dateStr, eventId: null }
        }

        const dialogRef = this.dialog.open(DialogNewEvent, config);
        dialogRef.afterClosed().subscribe(result => {
            this.getCalendarEvents();


        });
    }

    /** Evento que se dispara cuando se pulsa un evento del componente fullcalendar. Abre el diálogo de modificación de eventos y recarga la lista de eventos del calendario cuando se cierra.
    * @param info -información del evento pulsado.
    */
    handleEventClick(info: any) {

        let config: MatDialogConfig = {
            height: "70%",
            width: "90%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: null, eventId: info.event.id }
        }
        const eventClicked = this.events.find(element => element.id == info.event.id);
        if (eventClicked != undefined && eventClicked.taskOriginId == undefined) {
            const dialogRef = this.dialog.open(DialogNewEvent, config);
            dialogRef.afterClosed().subscribe(result => {
                this.getCalendarEvents();
            });
        } else {
            this.openEventNotificationBar();
        }

    }

    /** Abre la barra snackbar de notificación de eventos */
    openEventNotificationBar() {
        this._notificationBar.open('Accede al apartado de tareas para modificar este evento.', 'X', { duration: 2000 });
    }

    /** Abre el diálogo de creación de eventos del calendario y recarga la lista de eventos cuando este se cierra. */
    newEvent() {

        let config: MatDialogConfig = {
            height: "70%",
            width: "100%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: null, eventId: null }
        }

        const dialogRef = this.dialog.open(DialogNewEvent, config);
        dialogRef.afterClosed().subscribe(result => {
            this.getCalendarEvents();
        });
    }

    /** Evento que se dispara cuando se filtran los eventos por Eventos o Tareas en el selector de filtrado.
     * @param value - valor seleccionado en el selector.
     */
    onFilterChange(value: any) {
        switch (value) {
            case "all":
                this.getCalendarEvents();

                break;
            case "tasks":
                this.getCalendarEventsFilteredTasks();

                break;
            case "events":
                this.getCalendarEventsFilteredEvents();
                break;
        }
    }


}
