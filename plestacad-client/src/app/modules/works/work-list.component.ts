import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { UserRole } from 'src/app/shared/models/role.enum';
import { User } from 'src/app/shared/models/user.model';
import { Work } from 'src/app/shared/models/work.model';
import { UserService } from 'src/app/shared/services/user.service';
import { WorkListService } from './work-list.service';

@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.scss']
})
export class WorkListComponent implements OnInit {

  public workList: Work[] = []
  public options!: any[] | null;
  public selected!: string;
  constructor(public dialog: MatDialog,
    private workListService: WorkListService, private router: Router, private route: ActivatedRoute) { }

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
  navigateToWork(id: string) {

    console.log(id)

    this.router.navigate(['/trabajos', id]);
  }


  loadWorksByUserSession() {
    const idUser = sessionStorage.getItem("id") as string;
    const roleUser = sessionStorage.getItem("role") as string;
    this.workListService.getWorksByUserId(idUser, roleUser).subscribe(response => {
      this.workList = response;
      console.log("RESPONSE", response)
    });

  }


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
  onFilterChange(option: any) {
    let selectedOption = option;
    const idUser = sessionStorage.getItem("id") as string;
    console.log("OPTION", selectedOption)
    if (selectedOption == "all") {
      this.loadWorksByUserSession();
    } else {
      console.log("OPTION", selectedOption)
      this.workListService.getWorksByStudentAndCategory(idUser, selectedOption).subscribe(response => {
        this.workList = response
        console.log(response)
      });
    }
  }


  addWork() {
    const dialogRef = this.dialog.open(DialogAddWork, {
      width: '1000px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadWorksByUserSession();
    });
  }

}



export interface DialogData {
  path: string;
  id: string;
}



@Component({
  selector: 'add-work.html',
  styleUrls: ['./manage-work/manage-work/add-work/add-work.scss'],
  templateUrl: './manage-work/manage-work/add-work/add-work.html',
})
export class DialogAddWork {
  createWorkForm: FormGroup;


  teachersCtrl!: FormControl;
  teachersFiltered!: Observable<User[]>;
  teachers!: User[];
  teachersInvited: User[] = [];


  studentsCtrl!: FormControl;
  studentsFiltered!: Observable<User[]>;
  students!: User[];
  studentsInvited: User[] = [];

  categories = [
    { value: 'tfg', name: 'Trabajo Fin de Grado' },
    { value: 'tfm', name: 'Trabajo Fin de Máster' },
    { value: 'tesis', name: 'Tésis Doctoral' },

  ];
  categoryControl: FormControl;

  cursoControl: FormControl;
  cursos: any[] = [];
  constructor(private userService: UserService,
    public dialogRef: MatDialogRef<DialogAddWork>, private workService: WorkListService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
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


    this.userService.getUsersByRole("teacher").subscribe((dataTeachers: User[]) => {
      this.teachers = dataTeachers;
      console.log("TEACHERS", this.teachers);
      this.teachersFiltered = this.teachersCtrl.valueChanges.pipe(
        startWith(''),
        map(teacher => (teacher ? this._filterTeachers(teacher) : this.teachers.slice()))
      );

    });


    this.userService.getUsersByRole("student").subscribe((dataStudents: User[]) => {
      this.students = dataStudents;
      console.log(this.students)
      console.log("STUDENTS", this.students);
      this.studentsFiltered = this.studentsCtrl.valueChanges.pipe(
        startWith(''),
        map(student => (student ? this._filterStudents(student) : this.students.slice()))
      );

    });


  }


  ngOnInit() {

  }

  private _filterTeachers(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.teachers.filter(teacher => teacher.email.toLowerCase().includes(filterValue));
  }

  private _filterStudents(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.students.filter(student => student.email.toLowerCase().includes(filterValue));
  }


  addTeacherToList() {
    var teacherValue = this.teachersCtrl.value;
    if (teacherValue != undefined && teacherValue.trim() != ""
      && this.teachers.filter(teacher => teacher.email == this.teachersCtrl.value).length > 0
      && this.teachersInvited.filter(teacher => teacher == teacherValue).length == 0) {
      this.teachersInvited.push(teacherValue);
      this.teachersCtrl.setValue("");
    }


  }

  deleteTeacherInvited(teacher: any){
    console.log("TEACHER", teacher)
    this.teachersInvited = this.teachersInvited.filter(t => t !== teacher);
  }

  addStudentToList() {
    var studentValue = this.studentsCtrl.value;
    if (studentValue != undefined && studentValue.trim() != ""
      && this.students.filter(student => student.email == this.studentsCtrl.value).length > 0
      && this.studentsInvited.filter(student => student == studentValue).length == 0) {
      this.studentsInvited.push(studentValue);
      this.studentsCtrl.setValue("");
    }


  }

  deleteStudentInvited(student: any){
    console.log("student", student)
    this.studentsInvited = this.studentsInvited.filter(e => e !== student);
  }


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

    this.workService.createWork(authorId, title, description, category, course, teachers).subscribe({
      next: (response) => {
        console.log("Execute creation")
        this.dialogRef.close();
      },
      error: (e) => {
        console.log("ERROR", e);
      },
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log("Subimt!")
  }
}