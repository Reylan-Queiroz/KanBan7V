import { AfterViewInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/shared/utils/constants.util';

@Component({
   selector: 'app-change-password',
   templateUrl: './change-password.dialog.html',
   styleUrls: ['./change-password.dialog.scss']
})
export class ChangePasswordDialog {
   form: FormGroup;

   constructor(
      @Inject(MAT_DIALOG_DATA) public data: { user: User },
      private _matDialog: MatDialog,

      private _userService: UserService,
      private _fb: FormBuilder,
      private _toastrService: ToastrService,
   ) {
      this.form = this._fb.group({
         newPassword: ['', Validators.compose([
            Validators.minLength(1),
            Validators.required
         ])],
      });
   }

   onSubmit(form: FormGroup) {
      let user = this.data.user;

      if (!user) return;

      user.password = form.value['newPassword'].trim();

      this._userService
         .update(user.id, user)
         .subscribe(() => {
            this._toastrService.success('Sucesso!', '', Constants.toastrConfig);
            this._matDialog.closeAll();
         }, (error) => {
            this._toastrService.error('Houve algum erro.', '', Constants.toastrConfig);
            console.log(error);
         });
   }
}
