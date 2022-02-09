import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
   selector: 'app-user-group-dashboard',
   templateUrl: './user-group-dashboard.component.html',
   styleUrls: ['./user-group-dashboard.component.scss']
})
export class UserGroupDashboardComponent {
   @Input() dataSource;
   @Output() openDialogEvent = new EventEmitter<void>();
   displayedColumns = ['position', 'name', 'peoples'];

   constructor() { }
}
