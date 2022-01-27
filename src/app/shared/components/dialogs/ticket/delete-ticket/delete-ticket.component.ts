import { Constants } from './../../../../utils/constants.util';

import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Column } from 'src/app/shared/models/column';
import { TicketService } from 'src/app/core/services/ticket.service';
import { Ticket } from 'src/app/shared/models/ticket';

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
            this.toastrService.success('Sucesso!', '', Constants.toastrConfig);
            this.dialogRef.close();
         },
         (error: HttpErrorResponse) => { console.log(error) }
      );
   }
}
