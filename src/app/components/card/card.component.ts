import { Ticket } from 'src/app/models/ticket';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
   selector: 'app-card',
   templateUrl: './card.component.html',
   styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
   @Output() edit = new EventEmitter<void>();
   @Output() delete = new EventEmitter<void>();

   @Input() ticket: Ticket;

   constructor() { }

   ngOnInit() {
   }

}
