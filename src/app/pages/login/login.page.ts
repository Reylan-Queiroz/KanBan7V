import { RoleService } from '../../core/services/role.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Security } from 'src/app/shared/utils/security.util';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';
import { RoleModel } from 'src/app/shared/models/RoleModel';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';

@Component({
   selector: 'app-login',
   templateUrl: './login.page.html',
   styleUrls: ['./login.page.scss'],

   animations: [fadeInAnimation],
   host: { '[@fadeInAnimation]': '' }
})
export class LoginPage implements OnInit {
   private roles: RoleModel[] = [];

   form: FormGroup;

   constructor(
      private loginService: LoginService,
      private _roleService: RoleService,

      private fb: FormBuilder,
      private router: Router,
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

   async ngOnInit() {
      await this._roleService.getAll()
         .toPromise()
         .then((value: any) => {
            this.roles = value;
         }).catch((error) => console.log(error));

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
