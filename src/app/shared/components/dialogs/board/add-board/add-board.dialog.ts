import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from 'src/app/core/services/board.service';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/shared/utils/constants.util';
import { Security } from 'src/app/shared/utils/security.util';

@Component({
   selector: 'app-add-board',
   templateUrl: './add-board.dialog.html',
   styleUrls: ['./add-board.dialog.scss']
})
export class AddBoardDialog {
   form: FormGroup;

   constructor(
      @Inject(MAT_DIALOG_DATA) public data: { user: User },
      private _dialogRef: MatDialogRef<AddBoardDialog>,
      private _fb: FormBuilder,

      private _boardService: BoardService,
      private _toastrService: ToastrService,
   ) {
      this.form = this._fb.group({
         name: ['', Validators.required],
      });
   }

   onSubmit(form: FormGroup) {
      const name = form.value['name'].trim();

      this._boardService.create({ boardId: 0, name: name, peopleHigherId: Security.getUser().people.createdById }).subscribe(
         () => {
            this._toastrService.success('Sucesso!', '', Constants.toastrConfig);
            this._dialogRef.close('Added');
         }, error => console.log(error)
      );
   }
}
