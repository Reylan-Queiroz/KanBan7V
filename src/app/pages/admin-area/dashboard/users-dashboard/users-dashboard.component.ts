import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
   selector: 'app-users-dashboard',
   templateUrl: './users-dashboard.component.html',
   styleUrls: ['./users-dashboard.component.scss']
})
export class UsersDashboardComponent {
   @Input() dataSource;
   @Output() openDialogEvent = new EventEmitter<void>();
   displayedColumns = ['position', 'name', 'role', 'login', 'password'];

   constructor() { }
}
