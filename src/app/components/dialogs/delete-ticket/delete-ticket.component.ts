import { GlobalConstants } from 'src/app/helpers/global-constants';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { TicketService } from 'src/app/services/ticket.service';
import { Column } from 'src/app/models/column';
import { Ticket } from 'src/app/models/ticket';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
   selector: 'app-delete-ticket',
   templateUrl: './delete-ticket.component.html',
   styleUrls: ['./delete-ticket.component.scss']
})
export class DeleteTicketComponent implements OnInit {
   @Input() text: string;

   constructor(
      private dialogRef: MatDialogRef<DeleteTicketComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket, column: Column },

      private ticketService: TicketService,
      private toastrService: ToastrService
   ) { }

   ngOnInit() {
   }

   delete() {
      this.ticketService.delete(this.data.ticket.id).subscribe(
         () => {
            this.toastrService.success('Sucesso!', '', GlobalConstants.toastrConfig);
            this.dialogRef.close();
         },
         (error: HttpErrorResponse) => { console.log(error) }
      );
   }
}
