import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from './../../services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Security } from 'src/app/utils/security.util';
import { Router } from '@angular/router';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   form: FormGroup;

   constructor(
      private fb: FormBuilder,
      private router: Router,

      private loginService: LoginService
   ) {
      this.form = this.fb.group({
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

   ngOnInit() {
      if (Security.hasToken()) {
         const user = Security.getUser();
         const token = Security.getToken();

         this.setUser(user, token);
      } else {
         localStorage.clear();
      }
   }

   onSubmit(form: FormGroup) {
      this.loginService.authenticate(form.value).subscribe(
         (data: any) => {
            this.setUser(data.user, data.token);
         },
         (error: HttpErrorResponse) => {
            console.log(error);
         }
      );
   }

   private setUser(user, token) {
      Security.set(user, token);
      this.router.navigate(['/']);
   }
}
