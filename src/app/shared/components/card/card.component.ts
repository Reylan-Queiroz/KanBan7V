import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ticket } from '../../models/ticket';

@Component({
   selector: 'app-card',
   templateUrl: './card.component.html',
   styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
   hasDueDate = false;
   hasExpired = false;
   hasFinished = false;

   @Output() edit = new EventEmitter<void>();
   @Output() delete = new EventEmitter<void>();

   @Input() ticket: Ticket;
   @Input() tags: [];

   constructor() { }

   ngOnInit() {
      this.ticket.dueDate.toString().startsWith('0001') ? null : this.hasDueDate = true;
      //this.hasExpired = true;

      //console.log(this.ticket.dueDate.toString().substring(0, 2));
   }

   compressTags() {
      let tagsName = document.getElementsByClassName('tagName');

      for (let index = 0; index < tagsName.length; index++) {
         let item = tagsName.item(index);

         item.classList.item(1) === 'd-none' ? item.classList.remove('d-none') : item.classList.add('d-none');
      }
   }
}
