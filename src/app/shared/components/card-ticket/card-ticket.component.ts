import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ticket } from 'src/app/shared/models/ticket';

@Component({
   selector: 'app-card-ticket',
   templateUrl: './card-ticket.component.html',
   styleUrls: ['./card-ticket.component.scss']
})
export class CardTicketComponent implements OnInit {
   dateDisplayed: Date;
   background: string = '#dfe1e6';
   textColor: string = 'black';

   @Output() edit = new EventEmitter<void>();
   @Output() delete = new EventEmitter<void>();

   @Input() ticket: Ticket;
   @Input() tags: [];

   constructor() { }

   ngOnInit() {
      this._checkDates();
   }

   compressTags() {
      let tagsName = document.getElementsByClassName('tagName');

      for (let i = 0; i < tagsName.length; i++) {
         let item = tagsName.item(i);

         item.classList.item(1) === 'd-none' ? item.classList.remove('d-none') : item.classList.add('d-none');
      }
   }

   private _checkDates() {
      let hasDueDate = false;
      let hasExpired = false;
      let hasFinished = false;

      const today = new Date();
      const dueDate = new Date(this.ticket.dueDate);

      hasFinished = this.ticket.hasFinished;
      hasDueDate = this.ticket.dueDate.toString().startsWith('0001') ? null : hasDueDate = true;

      if (hasFinished) {
         hasExpired = new Date(this.ticket.dateFinished).getTime() > new Date(this.ticket.dueDate).getTime();

         this.dateDisplayed = this.ticket.dateFinished;
      }

      if (hasDueDate && !hasFinished) {
         hasExpired = new Date(this.ticket.dueDate).getTime() < today.getTime();

         this.dateDisplayed = this.ticket.dueDate;
      }

      if (dueDate.getTime() > today.getTime()) {
         const expirationDay = dueDate.getUTCDate();
         const day = today.getUTCDate();
         const daysDifference = expirationDay - day;

         if (daysDifference <= 2) {
            this.background = '#fff3cd';
            this.textColor = 'black';

            //return;
         }

         //this.background = '#198754';
         //this.textColor = 'white';
      }

      if (hasExpired) { this.background = 'rgb(255, 0, 4)'; this.textColor = 'white'; }
   }
}
