import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import {global} from '../../services/global';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title: string;
  public user: User;
  public status;
  public identity;
  public token;
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
      url:global.url+'user/upload',      
      headers: {     
     "Authorization": this._userService.getToken()
      },
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn:false,
    attachPinText: 'Sube tu avatar de usuario...',
    replaceTexts: {
      selectFileBtn: 'Seleccionar imagen',
      resetBtn: 'Reset',
      uploadBtn: 'Subir',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Sube tu avatar de usuario...',
      attachPinText: 'Sube tu avatar de usuario...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
  };
  

  constructor(
    private _userService: UserService
  ) {
    this.page_title = 'Ajustes de usuario';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
    this.identity = this._userService.getItentity();
    this.token = this._userService.getToken();
    this.url = global.url;
    //Rellenar el objeto usuario
    this.user = new User(
        this.identity.sub, 
        this.identity.name, 
        this.identity.surename, 
        this.identity.role, 
        this.identity.email, '',
        this.identity.description,
        this.identity.image);
    
    //this.user = this.identity;
   }

  ngOnInit(): void {
  }

  onSubmit(form){
      this._userService.update(this.token, this.user).subscribe(      
      response => {
        if(response && response.status){
          //console.log(response);
          if(response.status == "success"){
            this.status = 'success';
            if(response.changes.name){
              this.user.name = response.changes.name;
            }
            if(response.changes.surename){
              this.user.surename = response.changes.surename;
            }
            if(response.changes.email){
              this.user.email = response.changes.email;
            }
            if(response.changes.description){
              this.user.description = response.changes.description;
            }
            if(response.changes.image){
              this.user.image = response.changes.image;
            }

            this.identity = this.user;
            localStorage.setItem('identity', JSON.stringify(this.identity));
          }else{
            this.status = 'error';
          }
          console.log(response);
        }
      },
      error => {
        status = 'error';
        console.log(<any>error);         
      }
    )
  }
  avatarUpload(datos){
    let data = JSON.parse(datos.response);
    this.user.image = data.image;
    console.log(this.user.image);
  }

}
