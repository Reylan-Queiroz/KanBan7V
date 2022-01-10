import { Observable } from 'rxjs';
import { BoardService } from './../../services/board.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/board';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
   selector: 'app-board',
   templateUrl: './board.component.html',
   styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
   public boards$: Observable<Board>;

   constructor(
      private boardService: BoardService,

      private router: Router
   ) { }

   ngOnInit() {
      this.loadData();
   }

   private loadData() {
      this.boardService.getAll().subscribe(
         (response) => {
            console.log(response);

            //this.boards$ = response;
         },
         error => console.log(error)
      )
   }

   navigate() {
      this.router.navigate(['kanban'], {
         state: {
            data: {}
         }
      });
   }
}
