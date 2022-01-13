import { AddBoardComponent } from '../../components/dialogs/board/add-board/add-board.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoardService } from './../../services/board.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/board';

@Component({
   selector: 'app-board',
   templateUrl: './board.component.html',
   styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
   public boards$: Observable<Board[]>;
   private wasChanged = new BehaviorSubject<boolean>(false);

   constructor(
      private boardService: BoardService,

      private router: Router,
      private matDialog: MatDialog
   ) { }

   ngOnInit() {
      this.loadData();

      this.wasChanged.subscribe(changed => changed === true ? this.loadData() : '');
   }

   private loadData() {
      this.boardService.getAll().subscribe(
         response => this.boards$ = response,
         error => console.log(error)
      );
   }

   navigate(id: any) {
      this.router.navigate([`kanban/${btoa(id)}`]);
   }

   openDialogAddBoard() {
      let dialog = this.matDialog.open(AddBoardComponent, {
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
