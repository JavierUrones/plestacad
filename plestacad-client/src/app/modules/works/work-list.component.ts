import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Work } from 'src/app/shared/models/work.model';
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
  constructor(private workListService: WorkListService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.options = [
      {value: 'all', name: 'Todos'},
      {value: 'tfg', name: 'TFG'},
      {value: 'tfm', name: 'TFM'},
      {value: 'tesis', name: 'Tésis'},

    ]; 
    this.selected = this.options[0].value;
    this.loadWorksByUserSession();
  }
  navigateToWork(id:string){

    console.log(id)
    
    this.router.navigate(['/trabajos',id]);
  }


  loadWorksByUserSession(){
    const idUser = sessionStorage.getItem("id") as string;
    this.workListService.getWorksByUserId(idUser).subscribe(response => {
      this.workList = response
      console.log("RESPONSE", response)
    });

  }

  onFilterChange(option: any) {
    let selectedOption = option;
    const idUser = sessionStorage.getItem("id") as string;
    console.log("OPTION", selectedOption)
    if(selectedOption== "all"){
      this.loadWorksByUserSession();
    } else{
    this.workListService.getWorksByStudentAndCategory(idUser,selectedOption).subscribe(response => {
      this.workList = response
      console.log(response)
    });
  }
}
}
