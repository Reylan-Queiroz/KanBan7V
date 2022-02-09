import { Router } from '@angular/router';
import { Security } from './../../utils/security.util';
import { BoardService } from './../../../core/services/board.service';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';
import { fadeInAnimation } from '../../animations/fade-in.animation';

@Component({
   selector: 'app-drawer',
   templateUrl: './drawer.component.html',
   styleUrls: ['./drawer.component.scss'],
   animations: [fadeInAnimation],
   host: { '[@fadeInAnimation]': '' }
})
export class DrawerComponent implements OnInit {
   treeControl = new NestedTreeControl<any>(node => node.children);
   dataSource = new MatTreeNestedDataSource<any>();

   private boards = [{ name: '', children: [] }];

   isHandset$: Observable<boolean> = this._breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
         map(result => result.matches)
      );

   hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

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

      await this._boardService.getAll()
         .toPromise()
         .then((res: any) => {
            boards = res;
         }).catch(err => console.log(err));

      boards = boards.filter(el => el.peopleHigherId === Security.getUser().people.createdById);

      this.boards[0].name = 'Quadros';
      this.boards[0].children = boards;

      this.dataSource.data = this.boards;
   }

   async navigate(boardId) {
      //await this._router.navigate([`/`]);
      this._router.navigate([`/kanban/${btoa(boardId)}`]);
   }
}
