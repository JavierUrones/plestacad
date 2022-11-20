import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { Work } from 'src/app/shared/models/work.model';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkService } from '../../shared/services/work.service';
import { DialogAddWork } from './manage-work/manage-work/add-work-dialog/add-work.dialog';

@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.scss']
})

/** Define el componente de la lista de trabajos académicos. */
export class WorkListComponent implements OnInit {

  /** Lista de los trabajos académicosdel usuario cuando se filtra por categoría. */
  public workList: Work[] = []
  /** Lista ed opciones de filtrado por categoría */
  public options!: any[] | null;
  /** Categoría seleccionada en el filtrado */
  public selected!: string;
  /** Id del usuario  en sesión*/
  public idUser!: string;
  /** Lista completa de los trabajos académicos del usuario. */
  public allWorks: Work[] = [];
  constructor(public dialog: MatDialog,
    private workListService: WorkService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.options = [
      { value: 'all', name: 'Todos' },
      { value: 'tfg', name: 'Trabajos Fin de Grado' },
      { value: 'tfm', name: 'Trabajos Fin de Máster' },
      { value: 'tesis', name: 'Tésis Doctorales' },

    ];
    this.selected = this.options[0].value;
    this.loadWorksByUserSession();
  }

  /**
   * Redirige a la página de gestión del trabajo académico.
   * @param id - id del trbajo académico
   */
  navigateToWork(id: string) {
    this.router.navigate(['/trabajos', id]);
  }


  /**
   * Carga los trabajos académicos del usuario en sesión.
   */
  loadWorksByUserSession() {
    this.idUser = sessionStorage.getItem("id") as string;
    this.workListService.getWorksByUserId(this.idUser).subscribe(response => {
      this.workList = response;
      this.allWorks = this.workList ;
      this.workList.sort((a: Work, b: Work) => { // se ordena alfabeticamente.
        var titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
        if (titleA < titleB)
         return -1;
        if (titleA > titleB)
         return 1;
        return 0; 
      })
      this.workList.sort((a: Work, b: Work) =>  Number(a.classified) - Number(b.classified)) //se colocan los clasificados al final.
    });

  }


  /**
   * Traduce el nombre de las siglas de las categorías del trabajo al nombre completo de la categoría.
   * @param category - siglas de la categoría
   * @returns Retorna el nombre completo de la categoría
   */
  showValueCategory(category: string) {
    switch (category) {
      case "tfg":
        return "Trabajo Fin de Grado";
      case "tfm":
        return "Trabajo Fin de Master";
      default:
        return "Tésis doctoral";
    }
  }
  /**
   * Modifica la lista de trabajos del usuario cuando se filtra por categoría.
   * @param option - opción del selector de filtrado seleccionada.
   */
  onFilterChange(option: any) {
    let selectedOption = option;
    const idUser = sessionStorage.getItem("id") as string;
    if (selectedOption == "all") {
      this.loadWorksByUserSession();
    } else {
      this.workListService.getWorksByStudentAndCategory(idUser, selectedOption).subscribe(response => {
        this.workList = response;
        this.allWorks = response;
        this.workList.sort((a: Work, b: Work) =>  Number(a.classified) - Number(b.classified))

      });
    }
  }

  /**
   * Función que se dispara cuando se filtra por título la lista de trabajos académicos.
   * @param event - datos del evento de búsqueda
   */
  onSearch(event: any) {
    if (event.value == "") {
        this.workList = this.allWorks;
        this.workList.sort((a: Work, b: Work) =>  Number(a.classified) - Number(b.classified))

    } else {
        this.workList = this.allWorks.filter((work: any) =>
            work.title.startsWith(event.value)
        )
        this.workList.sort((a: Work, b: Work) =>  Number(a.classified) - Number(b.classified))

    }

}


/**
 * Abre el diálogo de creación de trabajos académicos y recarga la lista de trabajos cuando este se cierra.
 */
  addWork() {
    const dialogRef = this.dialog.open(DialogAddWork, {
      width: '1000px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadWorksByUserSession();
    });
  }

}


