import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/core/services/login.service';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { Security } from 'src/app/shared/utils/security.util';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-login',
   templateUrl: './login.page.html',
   styleUrls: ['./login.page.scss'],

   animations: [fadeInAnimation],
   host: { '[@fadeInAnimation]': '' }
})
export class LoginPage implements OnInit {
   form: FormGroup;

   constructor(
      private _fb: FormBuilder,
      private _router: Router,
      private _spinner: NgxSpinnerService,
      private _toastr: ToastrService,

      private _loginService: LoginService,
   ) {
      this.form = this._fb.group({
         login: ['', Validators.compose([
            Validators.minLength(3),
            Validators.required
         ])],
         password: ['', Validators.compose([
            Validators.minLength(1),
            Validators.required
         ])]
      });
   }

   async ngOnInit() {
      if (Security.hasToken()) {
         const user = Security.getUser();
         const token = Security.getToken();

         this._setUser(user, token);
      } else {
         localStorage.clear();
      }
   }

   onSubmit(form: FormGroup) {
      this._spinner.show();

      this._loginService.authenticate(form.value).subscribe(
         (data: any) => {
            this._setUser(data.user, data.token);
            this._spinner.hide();
         },
         (error: HttpErrorResponse) => {
            this._toastr.error('Usuário ou senha inválidos.', '', environment.toastrConfig);
            this._spinner.hide();
            console.log(error);
         }
      );
   }

   private _setUser(user, token) {
      Security.set(user, token);
      this._router.navigate(['/']);
   }
}
