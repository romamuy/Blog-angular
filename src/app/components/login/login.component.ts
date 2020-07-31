import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import {UserService} from '../../services/user.service';
import {Router, ActivatedRoute, Params, RouterEvent} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: string;
  public token;
  public identity;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ){ 
    this.page_title = 'Identificate';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
  }

  ngOnInit(): void {
    //se ejecuta siempre que cargue componente, solo cierra sesión cuando llega el parametro sure por la url
    this.logout(); 
  }
  onSubmit(form){
    this._userService.signup(this.user).subscribe(
      response => { 
        //  TOKEN
        console.log(response);
        
        if(response.status != 'error'){
          this.status = 'success';
          this.token = response;
          //  OBJETO USUARIO IDENTIFICADO
          this._userService.signup(this.user, true).subscribe(
            response => {
              this.identity = response;

              // PERSISTIR DATOS USUARIO IDENTIFICADO
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));
              this._router.navigate(['inicio']);
            },
            error => {
              this.status = 'error';
              console.log(<any>error);      
            });
        }else{
          this.status = 'error';
        }        
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
  logout(){
    this._route.params.subscribe(params => {
      let logout = +params['sure']; // + es para castear a entero

      if(logout == 1){
        localStorage.removeItem('identity');
        localStorage.removeItem('token');

        this.identity = null;
        this.identity = null;

        this._router.navigate(['inicio']);
      }
    });
  }
}
