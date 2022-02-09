import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from 'src/app/core/services/ticket.service';
import { Column } from 'src/app/shared/models/column';
import { Ticket } from 'src/app/shared/models/ticket';
import { Constants } from './../../../../utils/constants.util';

@Component({
   selector: 'app-delete-ticket',
   templateUrl: './delete-ticket.dialog.html',
   styleUrls: ['./delete-ticket.dialog.scss']
})
export class DeleteTicketDialog implements OnInit {
   @Input() text: string;

   constructor(
      private dialogRef: MatDialogRef<DeleteTicketDialog>,
      @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket, column: Column },

      private ticketService: TicketService,
      private toastrService: ToastrService
   ) { }

   ngOnInit() {
   }

   delete() {
      this.ticketService.delete(this.data.ticket.id).subscribe(
         () => {
            this.toastrService.success('Sucesso!', '', Constants.toastrConfig);
            this.dialogRef.close();
         },
         (error: HttpErrorResponse) => { console.log(error) }
      );
   }
}
