import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from 'src/app/core/services/ticket.service';
import { Column } from 'src/app/shared/models/column';
import { Ticket } from 'src/app/shared/models/ticket';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-delete-ticket',
   templateUrl: './delete-ticket.dialog.html',
   styleUrls: ['./delete-ticket.dialog.scss']
})
export class DeleteTicketDialog {
   @Input() text: string;

   constructor(
      @Inject(MAT_DIALOG_DATA) public data: { ticket: Ticket, column: Column },
      private _dialogRef: MatDialogRef<DeleteTicketDialog>,

      private _ticketService: TicketService,
      private _toastrService: ToastrService
   ) { }

   delete() {
      this._ticketService.delete(this.data.ticket.id).subscribe(
         () => {
            this._toastrService.success('Sucesso!', '', environment.toastrConfig);
            this._dialogRef.close(true);
         }, (error: HttpErrorResponse) => { console.log(error) }
      );
   }
}
