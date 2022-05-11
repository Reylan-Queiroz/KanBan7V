import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MudarSenhaComponent } from '../../../../shared/components/dialogs/user/mudar-senha/mudar-senha.component';

@Component({
   selector: 'app-users-dashboard',
   templateUrl: './users-dashboard.component.html',
   styleUrls: ['./users-dashboard.component.scss']
})
export class UsersDashboardComponent {
   @Input() dataSource;
   @Output() openDialogEvent = new EventEmitter<void>();
   displayedColumns = ['position', 'name', 'role', 'login', 'password'];

   constructor(
      private _matDialog: MatDialog,
   ) { }

   openDialogMudarSenha(user) {
      this._matDialog.open(MudarSenhaComponent, {
         width: '350px',
         height: 'auto',
         position: { top: '40px' },
         data: { user }
      });
   }
}
