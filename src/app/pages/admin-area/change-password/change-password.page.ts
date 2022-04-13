import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { Constants } from 'src/app/shared/utils/constants.util';
import { Security } from 'src/app/shared/utils/security.util';

@Component({
   selector: 'app-change-password',
   templateUrl: './change-password.page.html',
   styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage implements OnInit {
   form: FormGroup;

   constructor(
      private _fb: FormBuilder,
      private _router: Router,

      private _userService: UserService,
      private _toastrService: ToastrService,
   ) {
      this.form = this._fb.group({
         newPassword: ['', Validators.compose([
            Validators.minLength(3),
            Validators.required
         ])],
      });
   }

   ngOnInit(): void {
      if (Security.getUser().password != '1')
         this._router.navigate(['/']);
   }

   onSubmit(form: FormGroup) {
      let user = Security.getUser();

      if (!user) return;

      user.password = form.value['newPassword'].trim();

      Security.setUser(user);

      this._userService
         .update(user.id, user)
         .subscribe(() => {
            this._toastrService.success('Sucesso!', '', Constants.toastrConfig);
            this._router.navigate(['/'])
         }, (error) => {
            this._toastrService.error('Houve algum erro.', '', Constants.toastrConfig);
            console.log(error);
         });
   }
}
