import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
   selector: 'app-card',
   templateUrl: './card.component.html',
   styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

   // issueTypesWithColor = appConstants.issueTypeListWithColor;
   // issueTypes = Object.values(IssueType);
   @Output() edit = new EventEmitter<void>();
   @Output() delete = new EventEmitter<void>();

   @Input() text: string;
   @Input() author: string;
   @Input() tags: [];
   @Input() image: string;
   @Input() issueType?: string;
   @Input() createdAt: Date;

   constructor() { }

   ngOnInit() {
   }

}
