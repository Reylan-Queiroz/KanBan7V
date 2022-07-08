import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Security } from 'src/app/shared/utils/security.util';
import { Board } from '../../models/board';
import { Kanban } from '../../utils/kanban.util';

@Component({
   selector: 'app-navbar',
   templateUrl: './navbar.component.html',
   styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
   @Input() drawerReceived;
   loggedUser = Security.getUser();
   currentBoard: Board;

   constructor(
      private _router: Router,
      private _activatedRoute: ActivatedRoute
   ) { }

   ngOnInit(): void {
      new Promise(resolve => {
         setTimeout(() => {
            this.currentBoard = Kanban.getCurrentBoard();
         }, 500);
       });
   }

   logout() {
      Security.clear();
      this._router.navigate(['/login']);
   }
}
