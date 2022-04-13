import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { BoardService } from 'src/app/core/services/board.service';
import { UserService } from 'src/app/core/services/user.service';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { AddBoardDialog } from 'src/app/shared/components/dialogs/board/add-board/add-board.dialog';
import { ChangePasswordDialog } from 'src/app/shared/components/dialogs/user/change-password/change-password.dialog';
import { Role } from 'src/app/shared/enums/role.enum';
import { Board } from 'src/app/shared/models/board';
import { Security } from 'src/app/shared/utils/security.util';

@Component({
   selector: 'app-board',
   templateUrl: './board.page.html',
   styleUrls: ['./board.page.scss'],

   animations: [fadeInAnimation],
   host: { '[@fadeInAnimation]': '' }
})
export class BoardPage implements OnInit {
   private _wasChanged = new BehaviorSubject<boolean>(false);
   boards: Board[] = [];

   constructor(
      private _router: Router,
      private _matDialog: MatDialog,
      private _spinner: NgxSpinnerService,

      private _boardService: BoardService,
   ) { }

   async ngOnInit() {
      if (Security.getUser().password == '1')
         this._router.navigate(['mudarSenha'])

      await this._loadData();

      this._wasChanged.subscribe(async changed => changed ? await this._loadData() : '');
   }

   private async _loadData() {
      this._spinner.show();

      await this._boardService.getAll()
         .toPromise()
         .then((res: any) => {
            this.boards = res;
         }).catch(err => console.log(err));

      if (Security.getUser().roleId === Role.Management) {
         this.boards = this.boards.filter(el => el.peopleHigherId === Security.getUser().peopleId);

         return;
      }

      this.boards = this.boards.filter(el => el.peopleHigherId === Security.getUser().people.createdById);

      this._spinner.hide();
   }

   navigate = (id) => this._router.navigate([`kanban/${btoa(id)}`]);

   openDialogAddBoard() {
      let dialog = this._matDialog.open(AddBoardDialog, {
         width: '500px',
         height: 'auto',
         position: { top: '40px' }
      });

      dialog.afterClosed().subscribe(result => {
         if (!result) { return; }

         this._wasChanged.next(true);
      });
   }
}
