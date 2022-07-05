import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from 'src/app/core/services/ticket.service';
import { Column } from 'src/app/shared/models/column';
import { Ticket } from 'src/app/shared/models/ticket';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';

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

      const ticket = new Ticket(0, title, '', newDate, undefined, undefined, undefined, position, this.data.user.peopleId, null, columnId, null, null, null, null, null);

      this._ticketService.save(ticket).subscribe(
         () => {
            this._toastrService.success('Sucesso!', '', environment.toastrConfig);
            this._dialogRef.close('Ticket Criado!');
         }, () => {
            this._toastrService.error('Falha!', '', environment.toastrConfig);
         }
      );
   }
}
