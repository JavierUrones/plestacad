import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ManageWorkComponent } from '../works/manage-work/manage-work/manage-work.component';
import { User } from '../../shared/models/user.model';
import { Work } from '../../shared/models/work.model';
import { UserService } from '../../shared/services/user.service';
import { WorkService } from '../../shared/services/work.service';
import { DateAdapter } from "@angular/material/core";
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
/** Define el componente Admin que establece la pantalla de administración de la aplicación */
export class AdminComponent implements OnInit {

  /** Columnas de la tabla trabajos */
  definedColumns: string[] = ['title', 'course', 'category', 'authorId', '_id'];
  /** Columnas de la tabla usuarios */
  definedColumns2: string[] = ['name', 'surname', 'email', '_id'];

  /** Trabajos académicos de la plataforma */
  works: MatTableDataSource<Work> = new MatTableDataSource();
  /* Usuarios de la platforma */
  users: MatTableDataSource<User> = new MatTableDataSource();

  /** Posibles tamaños de cada página de la tabla */
  pageSizes = [5, 10, 15];


  /** Paginador trabajos */
  @ViewChild(MatPaginator) paginatorWorks!: MatPaginator;
  /** Paginador usuarios */
  @ViewChild(MatPaginator) paginatorUsers!: MatPaginator;
  /** Setter paginador trabajos */
  @ViewChild('paginatorWorks') set matPaginatorWorks(mp: MatPaginator) {
    this.paginatorWorks = mp;
    this.works.paginator = this.paginatorWorks;
  }
  /** Setter paginador usuarios */
  @ViewChild('paginatorUsers') set matPaginatorUsers(mp: MatPaginator) {
    this.paginatorUsers = mp;
    this.users.paginator = this.paginatorUsers;
  }

  /** Ordenacion tabla usuarios */
  @ViewChild("sortElementsUsers") set matSort1(ms: MatSort) {
    this.users.sort = ms;
  }
  /** Ordenacion tabla trabajos */
  @ViewChild("sortElementsWorks") set matSort2(ms: MatSort) {
    this.works.sort = ms;
  }

  /** Atributo que indica si está cargando algún elemento */
  loading!: boolean;

  constructor(private router: Router, private dateAdapter: DateAdapter<Date>, public matDialog: MatDialog, private userService: UserService, private workService: WorkService) {
    this.dateAdapter.setLocale('es-Es');

  }
  ngOnInit(): void {
    this.loading = true;
    this.workService.getAllWorks().subscribe((res) => {
      this.works.data = res;
      this.loading = false;
    })
    this.userService.getAllUsers().subscribe((res) => {
      this.users.data = res.data
    })
    this.loading = false;
  }

  /** Muestra el valor de la categoría del trabajo académico */
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

  /** Redirecciona al trabajo académico seleccionado
   * @param idWork - id del trabajo académico.
   */
  openWork(idWork: string) {
    this.router.navigate(['trabajos/' + idWork])
  }

  /** Redirecciona al perfil del usuario
   * @param idUser - id del usuario.
   */
  openUser(idUser: string) {
    this.router.navigate(['perfil/' + idUser])
  }






}
