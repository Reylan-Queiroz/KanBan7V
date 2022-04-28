import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/shared/utils/constants.util';
import { Security } from 'src/app/shared/utils/security.util';

@Component({
   selector: 'app-mudar-senha',
   templateUrl: './mudar-senha.component.html',
   styleUrls: ['./mudar-senha.component.scss']
})
export class MudarSenhaComponent {
   form: FormGroup;

   constructor(
      @Inject(MAT_DIALOG_DATA) public data: { user: User },
      private dialogRef: MatDialogRef<MudarSenhaComponent>,

      private _toastr: ToastrService,

      private _fb: FormBuilder,
      private _userService: UserService,
   ) {
      this.form = this._fb.group({
         newPassword: ['', Validators.compose([
            Validators.required,
            Validators.minLength(3)])],
      });
   }

   onSubmit(form: FormGroup) {
      this.data.user.password = form.value['newPassword'];

      this._userService
         .update(this.data.user.id, this.data.user)
         .subscribe(() => {
            this._toastr.success('Sucesso!', '', Constants.toastrConfig);
            Security.setUser(this.data.user);
            this.dialogRef.close();
         }, (error: HttpErrorResponse) => {
            this._toastr.error(error.message, 'Erros internos.', Constants.toastrConfig);
         })
   }
}
