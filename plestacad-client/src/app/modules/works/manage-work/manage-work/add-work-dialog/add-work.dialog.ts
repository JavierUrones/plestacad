import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { map, Observable, startWith } from "rxjs";
import { User } from "src/app/shared/models/user.model";
import { UserService } from "src/app/shared/services/user.service";
import { WorkService } from "src/app/shared/services/work.service";

/** Interfaz para el intercambio de datos con el diálogo de creación de un trabajo académico */
export interface DialogDataAddWork {
  /** ruta del trabajo académico  */
  path: string;
  /** id del trabajo académico */
  id: string;
}



@Component({
  selector: 'add-work.html',
  styleUrls: ['add-work-dialog.scss'],
  templateUrl: 'add-work-dialog.html',
})
/** Define el diálogo de creación de un trabajo académico */
export class DialogAddWork {
  /** Formulario con los datos del trabajo académico. */
  createWorkForm: FormGroup;


  /** FormControl de los profesores */
  teachersCtrl!: FormControl;
  /** Lista de profesores filtrados a partir de la variable teachers cuando el usuario escribe sobre el componente de selección de profesores */
  teachersFiltered!: Observable<User[]>;
  /** Lista de profesores invitables al trabajo académico. */
  teachers!: User[];
  /** Lista de profesores invitados. */
  teachersInvited: User[] = [];


  /** FormControl de los estudiantes */
  studentsCtrl!: FormControl;
  /** Lista de estudiantes filtrados a partir de la variable students cuando el usuario escribe sobre el componente de selección de estudiantes */
  studentsFiltered!: Observable<User[]>;
  /** Lista de estudiantes invitables al trabajo académico. */
  students!: User[];
  /** Lista de estudiantes invitados. */
  studentsInvited: User[] = [];

  /** Posibles categorías del trabajo académico creado. */
  categories = [
    { value: 'tfg', name: 'Trabajo Fin de Grado' },
    { value: 'tfm', name: 'Trabajo Fin de Máster' },
    { value: 'tesis', name: 'Tésis Doctoral' },

  ];
  /** FormControl de las categorías. */
  categoryControl: FormControl;
  /** FormControl del curso */
  cursoControl: FormControl;
  /** Lista de posibles cursos seleccionables por el usuario. */
  cursos: any[] = [];
  constructor(private userService: UserService,
    public dialogRef: MatDialogRef<DialogAddWork>, private workService: WorkService,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataAddWork
  ) {
    this.categoryControl = new FormControl('', Validators.required);
    this.teachersCtrl = new FormControl();
    this.studentsCtrl = new FormControl();
    this.cursoControl = new FormControl('', Validators.required);

    for (var i = 2000; i < 2050; i++) {
      this.cursos.push({ value: i })
    }

    this.createWorkForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(1)
      ]),
      category: this.categoryControl,
      course: this.cursoControl,
    });


    this.userService.getUsersForInvitationByRole("undefined").subscribe((dataUsers: User[]) => {
      dataUsers = dataUsers.filter(user => user._id != sessionStorage.getItem("id") as string)
      this.teachers = dataUsers;
      this.students = dataUsers;

      this.teachersFiltered = this.teachersCtrl.valueChanges.pipe(
        startWith(''),
        map(teacher => (teacher ? this._filterTeachers(teacher) : this.teachers.slice()))
      );
      this.studentsFiltered = this.studentsCtrl.valueChanges.pipe(
        startWith(''),
        map(student => (student ? this._filterStudents(student) : this.students.slice()))
      );

    });
  }


  ngOnInit() {

  }
  /** Filtra la lista de profesores invitables a partir del contenido del parámetro value.
   * @param value - input escrito por el usuario para filtrar la lista de profesores.
   */
  private _filterTeachers(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.teachers.filter(teacher => teacher.email.toLowerCase().includes(filterValue));
  }
  /** Filtra la lista de estudiantes invitables a partir del contenido del parámetro value.
   * @param value - input escrito por el usuario para filtrar la lista de estudiantes.
   */
  private _filterStudents(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.students.filter(student => student.email.toLowerCase().includes(filterValue));
  }


  /** Añade a un profesor a la lista de invitados del trabajo académico. */
  addTeacherToList() {
    var teacherValue = this.teachersCtrl.value;
    if (teacherValue != undefined && teacherValue.trim() != ""
      && this.teachers.filter(teacher => teacher.email == this.teachersCtrl.value).length > 0
      && this.teachersInvited.filter(teacher => teacher == teacherValue).length == 0) {
      this.teachersInvited.push(teacherValue);
      this.teachersCtrl.setValue("");
      if (this.studentsInvited.filter(student => student == teacherValue).length > 0) {
        this.deleteStudentInvited(teacherValue)
      }
    }


  }

  /** Elimina a un profesor de la lista de invitados del trabajo académico. */
  deleteTeacherInvited(teacher: any) {
    this.teachersInvited = this.teachersInvited.filter(t => t !== teacher);
  }

  /** Añade a un estudiante a la lista de invitados del trabajo académico. */
  addStudentToList() {
    var studentValue = this.studentsCtrl.value;
    if (studentValue != undefined && studentValue.trim() != ""
      && this.students.filter(student => student.email == this.studentsCtrl.value).length > 0
      && this.studentsInvited.filter(student => student == studentValue).length == 0) {
      this.studentsInvited.push(studentValue);
      this.studentsCtrl.setValue("");
      if (this.teachersInvited.filter(teacher => teacher == studentValue).length > 0) {
        this.deleteTeacherInvited(studentValue)
      }
    }
  }

  /** Elimina a un estudiante de la lista de invitados del trabajo académico. */
  deleteStudentInvited(student: any) {
    this.studentsInvited = this.studentsInvited.filter(e => e !== student);
  }


  /** Define el comportamiento cuando el usuario pulsa el botón de crear.
   * Extrae todos los datos indicados del trabajo académico a partir de los formularios rellenados.
   * Llama a la función del servicio de trabajos para crear trabajos académicos.
   */
  onClick() {
    if (this.createWorkForm.invalid) {
      return;
    }
    var description = this.createWorkForm.controls["description"].value;
    var title = this.createWorkForm.controls["title"].value;
    var category = this.createWorkForm.controls["category"].value;
    var course = this.createWorkForm.controls["course"].value;
    var teachers: any[] = [];
    teachers.push(sessionStorage.getItem("id"))
    var authorId = sessionStorage.getItem("id");
    this.workService.
    
    
    
    
    createWork(authorId, title, description, category, course, teachers, this.teachersInvited, this.studentsInvited).subscribe({
      next: (response) => {
        this.dialogRef.close();
      },
      error: (e) => {
      },
    });

  }

  /** Comportamiento cuando el usuario pulsa el botón de cancelar.
   * Se cierra el diálogo sin hacer nada más.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

}