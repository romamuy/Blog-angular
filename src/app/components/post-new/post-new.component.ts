import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import { global } from '../../services/global';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {
  public page_title: string;
  public identity;
  public token;
  public status: string;
  public post: Post;
  public categories;
  public is_edit: boolean;
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
    this.page_title = 'Crear una entrada';
    this.token = this._userService.getToken();
    this.identity = this._userService.getItentity();
    this.url = global.url;
   }

  ngOnInit(){
    this.getCategories();
    this.post = new Post(1, this.identity.sub, 1, '', '', null, null);    
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
    //console.log(this.post);
    //console.log(this._postService.pruebas());
    this._postService.create(this.token, this.post).subscribe(
      response=>{
        if(response.status=='success'){
          this.post = response.post;
          this.status = 'success';
          this._router.navigate(['/inicio']);
        }else{
          this.status = 'error';
        }
      },
      error=>{
        console.log(error);
      }
    );
  }

  imageUpload(datos){
    let image_data = JSON.parse(datos.response);
    this.post.image = image_data.image;
  }
}
