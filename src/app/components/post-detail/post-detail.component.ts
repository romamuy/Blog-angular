import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { error } from 'protractor';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService]
})
export class PostDetailComponent implements OnInit {
public post: any;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { 

  }

  ngOnInit(): void {
    this.getPost(); 
  }

  getPost(){
    this._route.params.subscribe(
      params=>{
        let id = params['id'];
        this._postService.getPost(id).subscribe(
          response =>{
            if(response.status == 'success'){
              this.post = response.post;              
              //console.log(this.post);
            }else{ 
              this._router.navigate(['inicio']);
            }
          },
          error =>{
            console.log(error);
            this._router.navigate(['inicio']);
          }
        );
      }
    );
  }



}
