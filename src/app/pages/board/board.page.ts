import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BoardService } from 'src/app/core/services/board.service';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { AddBoardDialog } from 'src/app/shared/components/dialogs/board/add-board/add-board.dialog';
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
   public boards: Board[] = [];
   private wasChanged = new BehaviorSubject<boolean>(false);

   constructor(
      private boardService: BoardService,

      private router: Router,
      private matDialog: MatDialog
   ) { }

   async ngOnInit() {
      await this.loadData();

      this.wasChanged.subscribe(changed => changed ? this.loadData() : '');
   }

   private async loadData() {
      await this.boardService.getAll()
         .toPromise()
         .then((res: any) => {
            this.boards = res;
         }).catch(err => console.log(err));

      if (Security.getUser().roleId === Role.Management) {
         this.boards = this.boards.filter(el => el.peopleHigherId === Security.getUser().peopleId);

         return;
      }

      this.boards = this.boards.filter(el => el.peopleHigherId === Security.getUser().people.createdById);
   }

   navigate = (id) => this.router.navigate([`kanban/${btoa(id)}`]);

   openDialogAddBoard() {
      let dialog = this.matDialog.open(AddBoardDialog, {
         width: '500px',
         height: 'auto',
         position: { top: '40px' }
      });

      dialog.afterClosed().subscribe(result => {
         if (!result) { return; }

         this.wasChanged.next(true);
      });
   }
}
