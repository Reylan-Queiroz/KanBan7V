import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from 'src/app/core/services/ticket.service';
import { Column } from 'src/app/shared/models/column';
import { User } from 'src/app/shared/models/user';
import { Constants } from 'src/app/shared/utils/constants.util';

@Component({
   selector: 'app-add-ticket',
   templateUrl: './add-ticket.dialog.html',
   styleUrls: ['./add-ticket.dialog.scss']
})
export class AddTicketDialog {
   form: FormGroup;

   constructor(
      @Inject(MAT_DIALOG_DATA) public data: { column: Column, user: User },
      private _dialogRef: MatDialogRef<AddTicketDialog>,
      private _fb: FormBuilder,
      private _datePipe: DatePipe,

      private _ticketService: TicketService,
      private _toastrService: ToastrService,
   ) {
      this.form = this._fb.group({
         title: ['', Validators.compose([
            Validators.required,
            Validators.minLength(3)])],
      });
   }

   onSubmit(form: FormGroup) {
      const columnId = this.data.column.id;
      const title = form.value['title'];
      const position = this.data.column.tickets.length;
      const newDate = this._datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

      let ticket = { id: 0, title: title, description: '', createdAt: newDate, dueDate: undefined, dateConclusion: undefined, position: position, postedById: this.data.user.peopleId, columnId: columnId };

      this._ticketService.create(ticket).subscribe(
         () => {
            this._toastrService.success('Sucesso!', '', Constants.toastrConfig);
            this._dialogRef.close('Ticket Criado!');
         }, () => {
            this._toastrService.error('Falha!', '', Constants.toastrConfig);
         }
      );
   }
}
