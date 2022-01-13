import { User } from 'src/app/models/user';
import { GlobalConstants } from 'src/app/helpers/global-constants';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Column } from 'src/app/models/column';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { TicketService } from 'src/app/services/ticket.service';
import { Ticket } from 'src/app/models/ticket';

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

      const ticket: Ticket = new Ticket(0, title, '', newDate, newDate, this.data.user.people, position, [], [], [], columnId, this.data.user.peopleId);

      this.ticketService.create(ticket).subscribe(
         () => {
            this.toastrService.success('Sucesso!', '', GlobalConstants.toastrConfig);
            this.dialogRef.close('Ticket Criado!');
         },
         (error: HttpErrorResponse) => {
            console.log(error);
            this.toastrService.error('Falha!', '', GlobalConstants.toastrConfig);
         }
      );
   }

}
