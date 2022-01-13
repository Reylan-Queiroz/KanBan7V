import { BoardService } from '../../../../services/board.service';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/helpers/global-constants';

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
      const obj = { boardId: 0, name: name };

      this.boardService.create(obj).subscribe(
         () => {
            this.toastrService.success('Sucesso!', '', GlobalConstants.toastrConfig);
            this.dialogRef.close('Added');
         }, error => console.log(error)
      );
   }
}
