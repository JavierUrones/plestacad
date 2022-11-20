import { DOCUMENT } from '@angular/common';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
/** Define el esqueleto del componente de tareas */
export class TasksComponent implements OnInit {

  /** Menu de pestañas para navegar entre lista o tablero. */
  @ViewChild('tab') tabGroup!: MatTabGroup;
  /** Contiene el índice de la pestaña activa por defecto. */
  isActiveTab = 0;

  /**
   * Constructor
   * @param route 
   * @param router 
   * @param tasksService - servicio de tareas
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService


  ) { }

  ngOnInit(): void {
  }

}

