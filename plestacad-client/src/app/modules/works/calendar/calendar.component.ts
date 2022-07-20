import { DatePipe, DOCUMENT } from '@angular/common';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { WorkCategory } from 'src/app/shared/models/category.enum';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkListService } from '../work-list.service';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {FullCalendar} from 'primeng/fullcalendar';

import { CalendarService } from './calendar.service';
import { map, Observable, startWith } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { dateEndValidator } from './resources/dateValidator';
//@ts-ignore
import esLocale from '@fullcalendar/core/locales/es';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { DateMarker, formatDate } from '@fullcalendar/core';
@Component({
    selector: 'app-calendar-work',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
})
export class CalendarWorkComponent implements OnInit {

    constructor(private calendarService: CalendarService, private route: ActivatedRoute, public dialog: MatDialog
    ) { }

    events: any[] = [];
    options: any;
    idWork!: string;

    ngOnInit(): void {
        this.idWork = this.route.snapshot.params['idWork'];

        this.calendarService.getCalendarEventsByWorkId(this.idWork).subscribe((response) => {
            response.data.forEach((element: { id: any; _id: any; }) => {
                element.id = element._id; //se hace esta asignación para que fullcalendar entienda el campo id.
            });
            this.events = response.data;
        })


        this.options = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: 'timeGridWeek',
            defaultDate: new Date(),
            height: 80,
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
            timezone: 'local'
        }

    }

    handleEventResize(date: any){
        this.calendarService.updateEvent(date.event.id, date.event.title, date.event.description, date.event.start, date.event.end, date.event.tags).subscribe((response) => {
            console.log("EVENT updated", response)
        });

    }

    handleEventDrop(date: any){
        this.calendarService.updateEvent(date.event.id, date.event.title, date.event.description, date.event.start, date.event.end, date.event.tags).subscribe((response) => {
            console.log("EVENT updated", response)
        });

    }
    handleDateClick(date: any) {
        //open modal and load date argument.
        console.log(date);
        let config: MatDialogConfig = {
            height: "70%",
            width: "100%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: date.dateStr, eventId: null }
        }

        const dialogRef = this.dialog.open(DialogNewEvent, config);
        dialogRef.afterClosed().subscribe(result => {
            this.calendarService.getCalendarEventsByWorkId(this.idWork).subscribe((response) => {
                response.data.forEach((element: { id: any; _id: any; }) => {
                    element.id = element._id; //se hace esta asignación para que fullcalendar entienda el campo id.
                });
                this.events = response.data;
            })

        });
    }

    handleEventClick(info: any) {
        console.log(info.event.id)
        let config: MatDialogConfig = {
            height: "70%",
            width: "100%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: null, eventId: info.event.id }
        }

        const dialogRef = this.dialog.open(DialogNewEvent, config);
        dialogRef.afterClosed().subscribe(result => {
            this.calendarService.getCalendarEventsByWorkId(this.idWork).subscribe((response) => {
                response.data.forEach((element: { id: any; _id: any; }) => {
                    element.id = element._id; //se hace esta asignación para que fullcalendar entienda el campo id.
                });
                this.events = response.data;
            })

        });
    }


    newEvent() {

        let config: MatDialogConfig = {
            height: "70%",
            width: "100%",
            panelClass: "dialog-responsive",
            data: { workId: this.idWork, start: null, eventId: null }
        }

        const dialogRef = this.dialog.open(DialogNewEvent, config);
        dialogRef.afterClosed().subscribe(result => {
            this.calendarService.getCalendarEventsByWorkId(this.idWork).subscribe((response) => {
                response.data.forEach((element: { id: any; _id: any; }) => {
                    element.id = element._id; //se hace esta asignación para que fullcalendar entienda el campo id.
                });
                this.events = response.data;
            })

        });
    }


}


export interface DialogData {
    workId: string;
    start: any;
    eventId: string;

}

@Component({
    selector: 'modal-events.html',
    templateUrl: './modal-events/modal-events.html',
    styleUrls: ['./modal-events/modal-events.scss']

})



export class DialogNewEvent {

    form!: FormGroup;

    htmlContent!: any;
    formControl!: FormControl;

    invalidTitle!: boolean;
    invalidDescription!: boolean;

    updating!: boolean;

    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    tags: string[] = [];
    tagList: string[] = ['Reunión', 'Entrega', 'Videollamada', 'Recordatorio'];
    addOnBlur = true;
    filteredTags!: Observable<string[]>;
    inputTags: FormControl = new FormControl('');
    hasErrors: boolean = false;
    @ViewChild('inputTagsElement') inputTagsElement!: ElementRef<HTMLInputElement>;

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogNewEvent>, private route: ActivatedRoute, private calendarService: CalendarService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {

        this.filteredTags = this.inputTags.valueChanges.pipe(
            startWith(null),
            map((myTag: string | null) => (myTag ? this._filter(myTag) : this.tagList.slice())),
        );

        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', []],
            pickerStart: ['', [Validators.required]],
            pickerEnd: ['', []],
            tagCntrl: ['', []]
        });

        console.log("ES NULL?", this.data.eventId)
        if (this.data.eventId != null) {  //el usuario esta modificando un evento.      
            //se cargan los datos del evento.
            this.updating = true;
            console.log("EVENTID", this.data.eventId)
            this.calendarService.getCalendarEventById(this.data.eventId).subscribe(response => {
                this.form.controls["title"].setValue(response.data.title);
                this.form.controls["description"].setValue(response.data.description);
                var startDateTime = (new Date(response.data.start));
                var pipe = new DatePipe('es-ES');
                this.form.controls["pickerStart"].setValue(pipe.transform(startDateTime, 'yyyy-MM-ddTHH:mm')); //se formatea la fecha del datepicker
                if (response.data.end != null) {
                    var endDateTime = (new Date(response.data.end));
                    this.form.controls["pickerEnd"].setValue(pipe.transform(endDateTime, 'yyyy-MM-ddTHH:mm'));
                }
                this.tags = response.data.tags;
            })
        } else {
            var localDate;
            var date;
            if (this.data.start == null) {
                date = new Date().toISOString();
                localDate = date.substring(0, date.length - 13) + "00:00";
                this.form.controls["pickerStart"].setValue(localDate);
            } else {
                date = this.data.start;
                if (date.length > 10) {
                    localDate = date.substring(0, date.length - 6)
                } else {
                    localDate = date + "T00:00";
                }
                this.form.controls["pickerStart"].setValue(localDate);
            }
        }
        this.form.controls["pickerEnd"].valueChanges.subscribe((form) => {
            this.dateValidator();
        })
    }
    ngOnInit() {

    }

    private dateValidator() {
        var endDate = new Date(this.form.controls["pickerEnd"].value)
        var startDate = new Date(this.form.controls["pickerStart"].value)

        console.log("FECHJAS", endDate.getTime(), startDate.getTime())
        if (endDate.getTime() < startDate.getTime()) {
            this.hasErrors = true;

        } else {
            this.hasErrors = false;

        }
    }




    selected(event: MatAutocompleteSelectedEvent): void {

        if (!this.tags.includes(event.option.viewValue)) {
            this.tags.push(event.option.viewValue);

            this.inputTagsElement.nativeElement.value = '';
            this.inputTags.setValue(null);
            this.form.controls["tagCntrl"].setValue(this.tags)
        } else {
            this.inputTags.setValue(null);
            this.inputTagsElement.nativeElement.value = '';

        }
    }

    private _filter(value: string): string[] {

        const filterValue = value.toLowerCase();



        return this.tagList.filter(tag => {

            tag.toLowerCase().includes(filterValue)
        });
    }




    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value && !this.tags.includes(value)) {
            this.tags.push(value);

            event.chipInput!.clear();
            this.form.controls["tagCntrl"].setValue(this.tags);
            this.inputTags.setValue(null);

        }
    }

    remove(tag: string): void {
        const index = this.tags.indexOf(tag)

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    onClick() {
        if (this.form.valid && !this.hasErrors) {

            //Llamar al servicio para crear events.
            const title = this.form.get('title')?.value;
            const description = this.form.get('description')?.value;
            const start = this.form.get('pickerStart')?.value;
            const tags = this.tags;
            console.log("start", start)
            if (this.form.get('pickerEnd')?.value == "") {
                var dateEnd = start.substring(0, 11) + "23:59:00";
                this.form.controls["pickerEnd"].setValue(dateEnd)
            }
            const end = this.form.get('pickerEnd')?.value;

            if (!this.updating) {
                this.calendarService.createEvent(this.data.workId, title, description, start, end, tags).subscribe((response) => {
                    console.log("EVENT CREATED", response)
                })
            } else {
                this.calendarService.updateEvent(this.data.eventId, title, description, start, end, tags).subscribe((response) => {
                    console.log("EVENT updated", response)
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

