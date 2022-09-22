import { AutofillMonitor } from '@angular/cdk/text-field';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { Breadcrumb } from 'src/app/shared/models/breadcumb.model';
import { UserService } from 'src/app/shared/services/user.service';
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
    authorId!: string;
    authorPhotoProfile!: any;
    interactionsObjects: PostInteraction[] = [];

    form!: FormGroup;

    formControl!: FormControl;
    htmlContentEditor!: string | undefined;
    loading!: boolean;

    constructor(private sanitizer: DomSanitizer, private userService: UserService, private route: ActivatedRoute, private router: Router, private postService: PostService, private fb: FormBuilder) {
        this.form = this.fb.group({
            editorContent: ['', Validators.required]
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

    loadPostData() {
        this.loading = true;
        this.id = this.route.snapshot.params['id']
        //Recuperar datos del post.
        this.postService.getPostById(this.id).subscribe((post) => {
            console.log("post data", post.data)
            this.message = post.data.message;
            this.creationDate = post.data.creationDate;
            this.isFavorite = post.data.isFavorite;
            this.title = post.data.title;
            this.authorId = post.data.authorId;
            this.userService.getFullNameById(this.authorId).subscribe((res) => {
                this.authorFullName = res.data.fullname;
            })
            this.userService.getProfilePhoto(this.authorId).subscribe((photo) => {
                if(photo.type=="image/jpeg"){
                    let objectURL = URL.createObjectURL(photo);       
                    this.authorPhotoProfile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                } else{
                    this.authorPhotoProfile.photo = undefined;
                }    
            })
            this.interactions = post.data.interactions;
            this.interactionsObjects = []

            this.postService.getListInteractionsByPostId(this.id).subscribe(response => {
                console.log(response.values)
                this.interactionsObjects = response.values;
                this.interactionsObjects.forEach((interaction) => {
                    this.userService.getProfilePhoto(interaction.authorId).subscribe((photo) => {
                        if(photo.type=="image/jpeg"){
                            let objectURL = URL.createObjectURL(photo);       
                            interaction.photo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                        } else{
                            interaction.photo = undefined;
                        }    
                    })
                })
                

            });

            this.loading = false;

        });
    }

    sendInteraction() {
        if (this.htmlContentEditor != undefined && this.htmlContentEditor!.substring(3,this.htmlContentEditor!.length-4).trim().length > 0) {
            this.id = this.route.snapshot.params['id']
            const message = this.htmlContentEditor;
            const interaction = new Interaction(message,
                sessionStorage.getItem("id") || '{}',
                new Date(),
                sessionStorage.getItem("name") + " " + sessionStorage.getItem("surname"));

            this.postService.createNewInteraction(this.id, interaction).subscribe(response => {
                console.log(response)
                this.loadPostData();

                this.htmlContentEditor = undefined;

            });
            this.form.get("editorContent")?.setValue("");

        }

    }

    checkOwner(authorId: string) {
        if (authorId == sessionStorage.getItem("id")) return true;
        else return false;
    }

    onChangedEditor(event: any) {
        if (event.html) {
            this.htmlContentEditor = event.html;
        }
    }

    deleteInteraction(id: string | undefined) {
        this.postService.deleteInteraction(id, this.id).subscribe((response: any) => {
            this.loadPostData();
        })
    }



}
class Interaction implements PostInteraction {
    message!: string;
    authorId!: string;
    date!: Date;
    authorFullName!: string;
    constructor(message: string, authorId: string, date: Date, authorFullName: string) {
        this.message = message;
        this.authorId = authorId;
        this.date = date;
        this.authorFullName = authorFullName;
    }
    photo: any;

}