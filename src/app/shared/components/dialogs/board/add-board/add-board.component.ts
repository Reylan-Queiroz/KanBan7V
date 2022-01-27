
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from 'src/app/core/services/board.service';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/shared/utils/constants.util';

@Component({
   selector: 'app-add-board',
   templateUrl: './add-board.component.html',
   styleUrls: ['./add-board.component.scss']
})
export class AddBoardComponent {
   form: FormGroup;

   constructor(
      private dialogRef: MatDialogRef<AddBoardComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { user: User },
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

      this.boardService.create({ boardId: 0, name: name }).subscribe(
         () => {
            this.toastrService.success('Sucesso!', '', Constants.toastrConfig);
            this.dialogRef.close('Added');
         }, error => console.log(error)
      );
   }
}
