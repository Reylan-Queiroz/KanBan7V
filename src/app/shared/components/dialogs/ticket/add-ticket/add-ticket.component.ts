import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Column } from 'src/app/shared/models/column';
import { User } from 'src/app/shared/models/user';
import { TicketService } from 'src/app/core/services/ticket.service';
import { Ticket } from 'src/app/shared/models/ticket';
import { Constants } from 'src/app/shared/utils/constants.util';

@Component({
   selector: 'app-add-ticket',
   templateUrl: './add-ticket.component.html',
   styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent {
   form: FormGroup;

   constructor(
      private dialogRef: MatDialogRef<AddTicketComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { column: Column, user: User },
      private formBuilder: FormBuilder,

      private ticketService: TicketService,
      private toastrService: ToastrService,
   ) {
      this.form = this.formBuilder.group({
         title: ['', Validators.required],
      });
   }

   onSubmit(form: FormGroup) {
      if (!form.valid) { return; }

      const columnId = this.data.column.id;
      const title = form.value['title'];
      const position = this.data.column.tickets.length;
      const newDate = new Date();

      const ticket: Ticket = new Ticket(0, title, '', newDate, undefined, undefined, position, this.data.user.peopleId, this.data.user.people, columnId, undefined, [], [], [], []);

      this.ticketService.create(ticket).subscribe(
         () => {
            this.toastrService.success('Sucesso!', '', Constants.toastrConfig);
            this.dialogRef.close('Ticket Criado!');
         },
         (error: HttpErrorResponse) => {
            console.log(error);
            this.toastrService.error('Falha!', '', Constants.toastrConfig);
         }
      );
   }
}
