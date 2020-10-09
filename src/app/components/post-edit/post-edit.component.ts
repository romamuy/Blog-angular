import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import { global } from '../../services/global';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  styleUrls: ['./post-edit.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {
  public page_title: string;
  public identity;
  public token;
  public status: string;
  public post: Post;
  public categories;
  public is_edit :boolean;
  public url;

  public froala_options: Object = {
    placeholderText: 'Escribe tu biografía aquí!',
    charCounterCount: false,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert']
  };
  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI:  {
      url:global.url+'post/upload',      
      headers: {     
     "Authorization": this._userService.getToken()
      },
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn:false,    
    attachPinText: 'Sube una imagen para la entrada...'    
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.page_title = 'Editar entrada';
    this.token = this._userService.getToken();
    this.identity = this._userService.getItentity();
    this.is_edit = true;
    this.url = global.url;        
   }

  ngOnInit(){
    this.getCategories();
    this.post = new Post(1, this.identity.sub, 1, '', '', null, null);    
    this.getPost();
    
    //
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response =>{
        if(response.status == 'success'){
          this.categories = response.categories;
          //console.log(this.categories);
        }
      },
      error =>{
        //console.log(<any>error);
      }
    );
  }

  onSubmit(form){
    this._postService.update(this.token, this.post, this.post.id).subscribe(
      response =>{
        if(response.status == 'success'){
          this.status = 'success';
          this._router.navigate(['/entrada', this.post.id]);
        }else{
          this.status = 'error';

        }
      },
      error=>{
        this.status = 'error';
      }
    );
  }

  imageUpload(datos){
    let image_data = JSON.parse(datos.response);
    this.post.image = image_data.image;
  }

  getPost(){
    this._route.params.subscribe(
      params=>{
        let id = params['id'];
        this._postService.getPost(id).subscribe(
          response =>{
            if(response.status == 'success'){
              this.post = response.post;
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
