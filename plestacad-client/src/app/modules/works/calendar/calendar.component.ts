import { DatePipe, DOCUMENT } from '@angular/common';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { WorkCategory } from 'src/app/shared/models/category.enum';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkListService } from '../work-list.service';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
@Component({
    selector: 'app-calendar-work',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
})
export class CalendarWorkComponent implements OnInit {
  
    constructor() { }

    events:any[] =  [];
    options: any;
    ngOnInit(): void {
        this.events = [{
            title: "Evento test",
            start: new Date(),
            description: "evento test"
        }]

        this.options = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin ],
            defaultDate: new Date(),
            locale: 'es',
            height:750,
            header: {
                left: 'prev,next',
                center: 'title',
                right: ''
            },
            editable: false
        }

    }


}
