import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { ColumnService } from 'src/app/core/services/column.service';
import { DataService } from 'src/app/core/services/data.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { AddTicketDialog } from 'src/app/shared/components/dialogs/ticket/add-ticket/add-ticket.dialog';
import { DeleteTicketDialog } from 'src/app/shared/components/dialogs/ticket/delete-ticket/delete-ticket.dialog';
import { EditTicketDialog } from 'src/app/shared/components/dialogs/ticket/edit-ticket/edit-ticket.dialog';
import { Column } from 'src/app/shared/models/column';
import { PeopleGroup } from 'src/app/shared/models/peopleGroup';
import { Ticket } from 'src/app/shared/models/ticket';
import { Security } from 'src/app/shared/utils/security.util';
import { Constants } from '../../shared/utils/constants.util';

@Component({
   selector: 'app-board',
   templateUrl: './kanban.page.html',
   styleUrls: ['./kanban.page.scss'],
   animations: [fadeInAnimation],
   host: { '[@fadeInAnimation]': '' }
})
export class KanbanPage implements OnInit {
   private _wasChanged = new BehaviorSubject<boolean>(false);
   private _boardId: number;

   data: any[] = [];
   columnsAndTickets: any[] = [];

   private _allTickets: Ticket[] = [];
   private _allColumns: [] = [];

   formColumn: FormGroup;

   constructor(
      private _fb: FormBuilder,
      private _matDialog: MatDialog,
      private _activatedRoute: ActivatedRoute,
      private _router: Router,
      private _spinner: NgxSpinnerService,

      private _toastrService: ToastrService,
      private _columnService: ColumnService,
      private _ticketService: TicketService,
      private _dataService: DataService,
   ) {
      this.formColumn = this._fb.group({
         nameColumn: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(18),
         ])]
      });

      this._router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

   async ngOnInit() {
      this._activatedRoute.params.subscribe(params => {
         this._boardId = Number.parseInt(atob(params['id']));
      });

      await this._loadData();

      this._wasChanged.subscribe(async changed => changed ? await this._loadData() : '');
   }

   private async _loadData() {
      this._spinner.show();

      this.data = [];
      this.columnsAndTickets = [];

      await this._dataService.get()
         .toPromise()
         .then((response) => {
            this._allColumns = (response.columns || []).filter(el => el.boardId === this._boardId);
            this._allTickets = (response.tickets || []);

            let colors: any = (response.colors || []);
            let tags: any = (response.tags || []);
            let ticketTags: any = (response.ticketTags || []);
            let assignedTo: any = (response.assignedTo || []);
            let groups: any = (response.groups || []);
            let peopleGroups: any = (response.peopleGroups || []);
            let peoples: any = (response.peoples || []);
            let peoplesAndGroups: any[] = [];

            let peopleGroup: PeopleGroup;
            let column: Column;

            tags.forEach(elTags => { elTags.color = colors.find(el => el.id === elTags.colorId); });
            ticketTags.forEach(elTicketTags => { elTicketTags.tag = tags.find(el => el.id === elTicketTags.tagId); });

            this._allColumns.forEach((elColumn: Column) => {
               column = new Column(elColumn.id.toString(), elColumn.title, elColumn.position, elColumn.boardId, null, []);

               column.tickets = (response.tickets || []).filter((ticket: Ticket) =>
                  ticket.columnId === elColumn.id
               );

               column.tickets.sort((a, b) =>
                  (a.position < b.position) ? -1 : 1
               );

               column.tickets.forEach((elTicket: any) => {
                  elTicket.assignedTo = [];
                  elTicket.conversations = [];
                  elTicket.tags = [];

                  ticketTags.forEach(elTicketTags => {
                     if (elTicketTags.ticketId !== elTicket.id) { return; }

                     elTicket.ticketTagsId = elTicketTags.id;
                     elTicketTags.tag.checked = true;
                     elTicket.tags.push(elTicketTags.tag);
                  });

                  groups.forEach(group => {
                     peopleGroup = new PeopleGroup(group.id, group.name, null, null, []);

                     peopleGroups.forEach(element => {
                        if (element.groupId !== peopleGroup.id) return;

                        peopleGroup.createdById = element.createdById;

                        peopleGroup.peoples.push(element.people);
                     });

                     peopleGroups.push(peopleGroup);

                     let item: any = peopleGroup;
                     item.type = 'group';

                     peoplesAndGroups.push(item);
                  });

                  assignedTo.forEach(element => {
                     if (element.ticketId !== elTicket.id) { return; }

                     let item: any;

                     if (element.peopleId !== null) {
                        item = peoples.find(el => el.id === element.peopleId);
                     }

                     if (element.groupId !== null) {
                        item = groups.find(el => el.id === element.groupId);
                     }

                     item.assignedToId = (element.id);
                     elTicket.assignedTo.push(item);
                  });
               });

               this.columnsAndTickets.push(column);
            });
         }).catch(error => console.log(error));

      this.columnsAndTickets.sort((a, b) =>
         (a.position < b.position) ? -1 : 1
      );

      this.data = [{ columnsAndTickets: this.columnsAndTickets }];

      this._spinner.hide();
   }

   connectedToIds = (index): string[] => {
      return this.data[index].columnsAndTickets.map(el =>
         el.id
      );
   }

   onColumnDrop(event: CdkDragDrop<any[]>) {
      let currentItemDrop: Column = event.container.data[event.previousIndex];
      currentItemDrop.position = event.currentIndex;
      this._columnService.update(Number.parseInt(currentItemDrop.id), currentItemDrop).subscribe();

      let previousItemDrop: Column = event.container.data[event.currentIndex];
      previousItemDrop.position = event.previousIndex;
      this._columnService.update(Number.parseInt(previousItemDrop.id), previousItemDrop).subscribe();

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
   }

   onTicketDrop(event: CdkDragDrop<any[]>) {
      if (event.previousContainer === event.container) {
         let currentItemDrop: Ticket = event.container.data[event.previousIndex];
         currentItemDrop.position = event.currentIndex;

         this._ticketService.update(currentItemDrop.id, currentItemDrop).subscribe();

         let previousItemDrop: Column = event.container.data[event.currentIndex];
         previousItemDrop.position = event.previousIndex;


         this._ticketService.update(previousItemDrop.id, previousItemDrop).subscribe();

         moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
         let newPosition = event.currentIndex;
         let columnId = Number.parseInt(event.container.id);
         let ticketId = Number.parseInt(event.item.element.nativeElement.id);
         let ticket = this._allTickets.find(el => el.id === ticketId);

         ticket.columnId = columnId;
         ticket.position = newPosition;

         this._ticketService.update(ticket.id, ticket).subscribe();

         transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
         );
      }
   }

   deleteColumn(event: PointerEvent, columnId: number, menuTrigger: MatMenuTrigger) {
      const element: HTMLButtonElement = <HTMLButtonElement>event.currentTarget;
      let icon = element.children[0];
      let text = element.children[1];

      if (element.classList.contains('in-exclusion')) {
         this._columnService.delete(columnId).subscribe(() => {
            this._toastrService.success('Sucesso!', '', Constants.toastrConfig);

            menuTrigger.closeMenu();

            this._wasChanged.next(true);
         }, (error) => {
            console.log(error)
         });
      }

      element.classList.add('in-exclusion');
      icon.textContent = 'info';
      text.textContent = 'Confirmar Exclusão';

      event.stopPropagation();

      menuTrigger.menuClosed.subscribe(() => {
         element.classList.remove('in-exclusion');
         icon.textContent = 'delete';
         text.textContent = 'Excluir';
      });
   }

   openAddTicketDialog(column: Column) {
      let user = Security.getUser();

      const dialog = this._matDialog.open(AddTicketDialog, {
         width: '500px',
         height: 'auto',
         position: { top: '40px' },
         data: { column, user },
      });

      dialog.afterClosed().subscribe((result) => {
         if (!result) { return; }

         this._wasChanged.next(true);
      });
   }

   openEditTicketDialog(ticket: Ticket, column: Column) {
      const user = Security.getUser();
      const boardId = this._boardId;

      const dialog = this._matDialog.open(EditTicketDialog, {
         width: '75%',
         height: 'auto',
         position: { top: '40px' },
         data: { ticket, column, user, boardId },
      });

      dialog.afterClosed().subscribe(() => {
         dialog.componentInstance.changed ? this._wasChanged.next(true) : '';
      });
   }

   openDeleteTicketDialog(ticket: Ticket, column: Column) {
      const dialog = this._matDialog.open(DeleteTicketDialog, {
         width: '400px',
         height: 'auto',
         position: { top: '40px' },
         data: { ticket, column }
      });

      dialog.afterClosed().subscribe(result => {
         if (!result) { return; }

         this._wasChanged.next(true);
      });
   }

   filterByDate = (tickets, asc = 1) => { tickets = [...tickets.sort((a: any, b: any) => (asc) * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))]; }

   addColumn() {
      const name = this.formColumn.controls['nameColumn'].value.trim();
      const position = this.columnsAndTickets.length;

      if (name.length < 3) { return; }

      let column = new Column(0, name, position, this._boardId, null, []);

      this._columnService.create(column).subscribe(
         () => {
            this._toastrService.success('Coluna criada com sucesso.', 'Êxito', Constants.toastrConfig);

            this._wasChanged.next(true);
         },
         (error: HttpErrorResponse) => {
            this._toastrService.error(error.message, `Error ${error.status}`, Constants.toastrConfig);
         });

      this.formColumn.controls['nameColumn'].setValue(null);
   }

   editColumnName(event: FocusEvent, column: Column) {
      const element: HTMLElement = (<HTMLElement>event.target);
      const newTitle = element.innerText.trim();

      if (newTitle.length > 18) {
         this._toastrService.error('O nome excedeu o limite de caracteres(18).', 'Erro', Constants.toastrConfig);

         element.innerText = column.title; // return to old value

         return;
      }

      if (newTitle === column.title) { return; }

      column.title = newTitle;

      this._columnService.update(Number.parseInt(column.id), column).subscribe(
         () => {
            this._toastrService.success('Nome alterado com sucesso.', 'Êxito', Constants.toastrConfig);
         }, (error: HttpErrorResponse) => {
            this._toastrService.error(error.message, `Error ${error.status}`, Constants.toastrConfig);
         }
      );
   }
}
