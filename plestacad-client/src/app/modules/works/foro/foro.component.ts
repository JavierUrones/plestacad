import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
})
/** Componente que determina el esqueleto del foro del trabajo académico */
export class ForoComponent implements OnInit {

  /**
   * Constructor
   * @param route 
   * @param dialog - diálogo modal.
   * @param router 
   */
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,


  ) { }

  /** Función ngOnInit */
  ngOnInit(): void {
  }

}

