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
      private dialogRef: MatDialogRef<AddBoardDialog>,
      private fb: FormBuilder,

      private boardService: BoardService,
      private toastrService: ToastrService,
   ) {
      this.form = this.fb.group({
         name: ['', Validators.required],
      });
   }

   onSubmit(form: FormGroup) {
      if (!form.valid) { return; }

      const name = form.value['name'].trim();

      this.boardService.create({ boardId: 0, name: name, peopleHigherId: Security.getUser().people.createdById }).subscribe(
         () => {
            this.toastrService.success('Sucesso!', '', Constants.toastrConfig);
            this.dialogRef.close('Added');
         }, error => console.log(error)
      );
   }
}
