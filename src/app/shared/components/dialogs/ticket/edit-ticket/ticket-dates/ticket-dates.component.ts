import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { TicketService } from 'src/app/core/services/ticket.service';
import { Ticket } from 'src/app/shared/models/ticket';

@Component({
   selector: 'app-ticket-dates',
   templateUrl: './ticket-dates.component.html',
   styleUrls: ['./ticket-dates.component.scss']
})
export class TicketDatesComponent implements OnInit {
   @Input() currentTicket: Ticket;
   @Output() hasChanged = new EventEmitter();

   dueDate: Date = null;

   constructor(
      private _datePipe: DatePipe,
      private _ticketService: TicketService,
   ) { }

   ngOnInit() {
      if (!this.currentTicket.dueDate.toString().startsWith('0001')) this.dueDate = this.currentTicket.dueDate;
   }

   addDueDate(event) {
      let ticket: any = this.currentTicket;

      ticket.dueDate = new Date();
      ticket.dueDate = this._datePipe.transform(event.value, 'yyyy-MM-ddTHH:mm:ss');

      this._ticketService.update(ticket.id, ticket).subscribe(
         () => this.hasChanged.emit(true),
         error => console.log(error)
      );
   }

   onCheckboxChange(event: MatCheckboxChange) {
      let ticket: any = this.currentTicket;
      ticket.hasFinished = event.checked;
      ticket.dateFinished = ticket.hasFinished ? this._datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') : null;

      this._ticketService.update(ticket.id, ticket).subscribe(
         () => this.hasChanged.emit(true),
         error => console.log(error)
      );
   }
}
