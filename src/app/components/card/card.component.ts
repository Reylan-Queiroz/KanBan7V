import { Ticket } from 'src/app/models/ticket';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
   selector: 'app-card',
   templateUrl: './card.component.html',
   styleUrls: ['./card.component.scss']
})
export class CardComponent {
   @Output() edit = new EventEmitter<void>();
   @Output() delete = new EventEmitter<void>();

   @Input() ticket: Ticket;
   @Input() tags: [];

   constructor() { }

   hideTagName() {
      let tagsName = document.getElementsByClassName('tagName');

      for (let index = 0; index < tagsName.length; index++) {
         let item = tagsName.item(index);

         item.classList.item(1) === 'd-none' ? item.classList.remove('d-none') : item.classList.add('d-none');
      }
   }
}
