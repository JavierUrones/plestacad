import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from 'src/app/shared/models/breadcumb.model';

@Component({
  selector: 'app-manage-work',
  templateUrl: './manage-work.component.html',
  styleUrls: ['./manage-work.component.scss']
})
export class ManageWorkComponent implements OnInit {
  id!: string;
  constructor(private route: ActivatedRoute, private router: Router    ) { 
    

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log("ID", this.id)
    
  }


}
