import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from 'src/app/core/services/board.service';
import { Board } from 'src/app/shared/models/board';
import { User } from 'src/app/shared/models/user';
import { Security } from 'src/app/shared/utils/security.util';
import { environment } from 'src/environments/environment';

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
      const board = new Board(0, name, Security.getUser().people.createdById, []);

      this._boardService.save(board).subscribe(
         () => {
            this._toastrService.success('Sucesso!', '', environment.toastrConfig);
            this._dialogRef.close('Added');
         }, error => console.log(error)
      );
   }
}
