import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { DatePipe } from "@angular/common";
import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { map, Observable, startWith } from "rxjs";
import { CalendarService } from "../calendar.service";


/** Interfaz para el intercambio de datos en los diálogos de creación/modificación de eventos */
export interface DialogDataNewEvent {
    /** Id del trabajo académico */
    workId: string;
    /** Fecha de inicio del evento */
    start: any;
    /** Id del evento */
    eventId: string;

}

@Component({
    selector: 'modal-events.html',
    templateUrl: './modal-events.html',
    styleUrls: ['./modal-events.scss']

})


/** Define el diálogo de creación y modificación de eventos */
export class DialogNewEvent {

    /** Formulario con los datos del evento */
    form!: FormGroup;


    htmlContent!: any;

    /** FormControl del formulario */
    formControl!: FormControl;

    /** Determina si un título indicado para el evento es válido o no */
    invalidTitle!: boolean;
    /** Determina si una descripción para el evento es válida o no */
    invalidDescription!: boolean;

    /** Flag que determina si se está actualizando o creando un evento al abrir el diálogo modal. */
    updating!: boolean;

    /** Teclas para operar con el componente matChipInput del input de tags */
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    /** Lista de tags del evento. */
    tags: string[] = [];
    /** Lista de tags seleccionables para el evento */
    tagList: string[] = ['Reunión', 'Entrega', 'Videollamada', 'Recordatorio'];

    /** Flag que determina el comportamiento matChipInputOnBlur del input de tags*/
    addOnBlur = true;

    /** Lista de tags filtrados. */
    filteredTags!: Observable<string[]>;

    /** FormControl del input de tags */
    inputTags: FormControl = new FormControl('');

    /** Flag que determina si el formulario tiene errores o no. */
    hasErrors: boolean = false;

    /** Elemento input tags */
    @ViewChild('inputTagsElement') inputTagsElement!: ElementRef<HTMLInputElement>;

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<DialogNewEvent>, private route: ActivatedRoute, private calendarService: CalendarService, private _errorBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: DialogDataNewEvent
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
        if (this.data.eventId != null) {  //el usuario esta modificando un evento.      
            //se cargan los datos del evento.
            this.updating = true;
            this.calendarService.getCalendarEventById(this.data.eventId).subscribe((response: any) => {
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

    /** Validador de fechas que comprueba si la fecha de fin especificada es anterior a la fecha de inicio */
    private dateValidator() {
        var endDate = new Date(this.form.controls["pickerEnd"].value)
        var startDate = new Date(this.form.controls["pickerStart"].value)

        if (endDate.getTime() < startDate.getTime()) {
            this.hasErrors = true;

        } else {
            this.hasErrors = false;

        }
    }



    /** Evento que se dispara cuando se selecciona un tag en el input de tags */
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

    /** Función de filtrado para el input de tags
     * @param value - valor para filtrar la lista de tags.
     */
    private _filter(value: string): string[] {

        const filterValue = value.toLowerCase();
        return this.tagList.filter(tag => {

            tag.toLowerCase().includes(filterValue)
        });
    }



/** Función que se dispara cuando el usuario introduce un nuevo tag en el input de tags
 * @param event - evento que se dispara con el contenido del usuario.
 */
    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value && !this.tags.includes(value)) {
            this.tags.push(value);

            event.chipInput!.clear();
            this.form.controls["tagCntrl"].setValue(this.tags);
            this.inputTags.setValue(null);

        }
    }

    /** Función que elimina un tag de la lista de tags
     * @param tag - tag a borrar.
     */
    remove(tag: string): void {
        const index = this.tags.indexOf(tag)

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    /** 
     * Llama al servicio para eliminar el evento pasándole los datos del mismo y cierra el diálogo modal.
     * Se dispara cuando el usuario pulsa el botón de eliminar un evento. */
    deleteEvent() {
        this.calendarService.deleteEvent(this.data.eventId, sessionStorage.getItem("id") as string).subscribe(() => {
            this.dialogRef.close();

        })
    }
    /**
     * Se dispará cuando el usuario pulsa el botón de crear/actualizar.
     * Valida los datos introducidos para el evento.
     * En caso de que se esté creando un evento se llama al servicio para crear eventos.
     * En caso de que se esté modificando un evento se llama al servicio para modificar eventos.
     */
    onClick() {
        if (this.form.valid && !this.hasErrors) {

            //Llamar al servicio para crear events.
            const title = this.form.get('title')?.value;
            const description = this.form.get('description')?.value;
            const start = this.form.get('pickerStart')?.value;
            const tags = this.tags;
            const userIdResponsible = sessionStorage.getItem("id") as string;
            if (this.form.get('pickerEnd')?.value == "") {
                var dateEnd = start.substring(0, 11) + "23:59:00";
                this.form.controls["pickerEnd"].setValue(dateEnd)
            }
            const end = this.form.get('pickerEnd')?.value;

            if (!this.updating) {
                this.calendarService.createEvent(this.data.workId, title, description, start, end, tags, userIdResponsible).subscribe({
                    next: (response) => {

                    },
                    error: (e) => {
                        this._errorBar.open("Ha ocurrido un error al crear el evento.", "X", { duration: 2000 })
                    },
                });
            } else {
                this.calendarService.updateEvent(this.data.eventId, title, description, start, end, tags, userIdResponsible, this.data.workId).subscribe({
                    next: (response) => {

                    },
                    error: (e) => {
                        this._errorBar.open("Ha ocurrido un error al modificar el evento.", "X", { duration: 2000 })
                    },
                });
            }

            this.dialogRef.close();
        } 


    }
    /** Cierra el diálogo modal. Se dispara cuando el usuario pulsa el botón de cancelar. */
    onNoClick(): void {
        this.dialogRef.close();
    }
}


