import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fadeInAnimation } from '../../animations/fade-in.animation';
import { Board } from '../../models/board';
import { Kanban } from '../../utils/kanban.util';
import { BoardService } from './../../../core/services/board.service';
import { Security } from './../../utils/security.util';

@Component({
   selector: 'app-drawer',
   templateUrl: './drawer.component.html',
   styleUrls: ['./drawer.component.scss'],
   animations: [fadeInAnimation],
   host: { '[@fadeInAnimation]': '' }
})
export class DrawerComponent implements OnInit {
   dataSource = new MatTreeNestedDataSource<any>();
   treeControl = new NestedTreeControl<any>(node => node.children);
   user = Security.getUser();

   isHandset$: Observable<boolean> = this._breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
         map(result => result.matches)
      );

   constructor(
      private _breakpointObserver: BreakpointObserver,
      private _router: Router,

      private _boardService: BoardService,
   ) { }

   async ngOnInit() {
      await this.loadData();
   }

   private async loadData() {
      let boards: any[] = [];
      let data = [{ name: '', children: [] }];

      await this._boardService
         .findAll()
         .toPromise()
         .then((res: any) => {
            boards = res;
         }).catch(err => console.log(err));

      let id = Security.getUser().people.createdById;

      if (Security.getUser().roleId <= 2)
         id = Security.getUser().peopleId;

      boards = boards.filter(el => el.peopleHigherId === id);

      data[0].name = 'Quadros';
      data[0].children = boards;

      this.dataSource.data = data;
   }

   hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;
   navigate = (board: Board) => { this._router.navigate([`/kanban/${btoa(board.id.toString())}`]); Kanban.setCurrentBoard(board); };
}
