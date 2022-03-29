import { AutofillMonitor } from '@angular/cdk/text-field';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from 'src/app/shared/models/breadcumb.model';
import { PostInteraction } from '../models/post.interaction';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-management',
    templateUrl: './post-management.component.html',
    styleUrls: ['./post-management.component.scss']
})
export class PostManagementComponent implements OnInit {

    id!: string;
    message!: string;
    creationDate!: Date;
    isFavorite!: boolean;
    title!: string;
    authorFullName!: string;
    interactions!: string[];

    interactionsObjects: PostInteraction[] = [];

    form!: FormGroup;

    formControl!: FormControl;
    htmlContentEditor!: string | undefined;


    constructor(private route: ActivatedRoute, private router: Router, private postService: PostService, private fb: FormBuilder) {
        this.form = this.fb.group({
            interaction: ['', Validators.required]
        });

    }


    public modulesQuill = {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ font: [] }],
          [{ color: [] }, { background: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ align: [] }],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ]
      };

    ngOnInit(): void {
        this.loadPostData();

    }

    loadPostData(){
        this.id = this.route.snapshot.params['id']
        //Recuperar datos del post.
        this.postService.getPostById(this.id).subscribe((post) => {
            console.log("POST", post)
            this.message = post.data.message;
            this.creationDate = post.data.creationDate;
            this.isFavorite = post.data.isFavorite;
            this.title = post.data.title;
            this.authorFullName = post.data.authorFullName;
            this.interactions = post.data.interactions;
            this.interactionsObjects = []
             //Cargar interacciones...
            this.interactions.forEach(interaction => {
                this.postService.getInteractionsById(interaction).subscribe((interactionComplete: any) => {
                    console.log("interactionCOMPLETE", interactionComplete.interaction);
                    var interactionDto: Interaction = new Interaction(interactionComplete.interaction.message, interactionComplete.authorId,
                        interactionComplete.interaction.date, interactionComplete.interaction.authorFullName);
                    
                    this.interactionsObjects.push(interactionDto)
                })

            });
            

        });
    }

    sendInteraction() {
        if (this.htmlContentEditor!=undefined) {
            this.id = this.route.snapshot.params['id']
            const message = this.htmlContentEditor;
            const interaction = new Interaction(message, 
                sessionStorage.getItem("id") || '{}', 
                new Date(), 
                sessionStorage.getItem("name") + " " + sessionStorage.getItem("surname"));
            console.log("MESSAGE", interaction)
            
            this.postService.createNewInteraction(this.id, interaction).subscribe(response => {
                console.log("response");
                this.loadPostData();
                this.htmlContentEditor = undefined;
            });
            
        }

    }

onChangedEditor(event: any){
    if (event.html) {
        this.htmlContentEditor = event.html;
        console.log(this.htmlContentEditor)
      }
}

   

}
class Interaction implements PostInteraction{
    message!: string;
    authorId!: string;
    date!: Date;
    authorFullName!: string;
    constructor(message: string, authorId: string , date: Date, authorFullName: string){
        this.message = message;
        this.authorId = authorId;
        this.date = date;
        this.authorFullName = authorFullName;
    }
        
}