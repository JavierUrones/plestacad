import { DOCUMENT } from '@angular/common';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Post } from './models/post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
})
export class ForoComponent implements OnInit {

  constructor(
    private userService: UserService,
    private postService: PostService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,


  ) { }

  ngOnInit(): void {
  }

}

