import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChangePasswordDialog } from 'src/app/shared/components/dialogs/user/change-password/change-password.dialog';

@Component({
   selector: 'app-users-dashboard',
   templateUrl: './users-dashboard.component.html',
   styleUrls: ['./users-dashboard.component.scss']
})
export class UsersDashboardComponent {
   displayedColumns = ['position', 'name', 'role', 'login', 'password'];

   @Input() dataSource;
   @Output() openDialogEvent = new EventEmitter<void>();

   constructor(private _matDialog: MatDialog) { }

   openChangePasswordDialog(user) {
      this._matDialog.open(ChangePasswordDialog, {
         width: '350px',
         height: 'auto',
         position: { top: '40px' },
         data: { user }
      });
   }
}
