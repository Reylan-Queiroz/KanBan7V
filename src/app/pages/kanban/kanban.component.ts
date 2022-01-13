import { GlobalConstants } from 'src/app/helpers/global-constants';
import { People } from '../../models/people';
import { DataService } from '../../services/data.service';
import { Ticket } from 'src/app/models/ticket';
import { ColumnService } from '../../services/column.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/helpers/utils';
import { Column } from 'src/app/models/column';
import { TicketService } from 'src/app/services/ticket.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EditTicketComponent } from 'src/app/components/dialogs/ticket/edit-ticket/edit-ticket.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Security } from 'src/app/utils/security.util';
import { User } from 'src/app/models/user';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AddTicketComponent } from 'src/app/components/dialogs/ticket/add-ticket/add-ticket.component';
import { DeleteTicketComponent } from 'src/app/components/dialogs/ticket/delete-ticket/delete-ticket.component';

@Component({
   selector: 'app-board',
   templateUrl: './kanban.component.html',
   styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {
   private wasChanged = new BehaviorSubject<boolean>(false);
   private user: User = Security.getUser();
   private boardId: number;

   data: any[] = [];
   columnsAndTickets: any[] = [];

   private allTickets: Ticket[] = [];
   private allPeoples: People[] = [];

   formColumn: FormGroup;

   constructor(
      private toastrService: ToastrService,
      private columnService: ColumnService,
      private ticketService: TicketService,
      private dataService: DataService,

      private formBuilder: FormBuilder,
      private matDialog: MatDialog,
      private activatedRoute: ActivatedRoute,
   ) {
      this.formColumn = this.formBuilder.group({
         nameColumn: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(18),
         ])]
      });

      this.user.people = this.allPeoples.find(el => el.id === this.user.peopleId);
   }

   async ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
         this.boardId = Number.parseInt(atob(params['id']));
      });

      await this.loadData();

      this.wasChanged.subscribe(async changed => changed === true ? await this.loadData() : '');
   }

   private async loadData() {
      this.data = [];
      this.columnsAndTickets = [];

      await this.dataService.get()
         .toPromise()
         .then((response) => {
            let columns = (response.columns || []).filter(el => el.boardId === this.boardId);
            let column: Column;

            let tags: any = (response.tags || []);
            let ticketTags: any = (response.ticketTags || []);

            ticketTags.forEach(elTicketTags => { elTicketTags.tag = tags.find(el => el.id === elTicketTags.tagId); });

            columns.forEach((elColumn: Column) => {
               column = new Column(elColumn.id.toString(), elColumn.title, elColumn.position, elColumn.boardId, [])

               column.tickets = (response.tickets || []).filter((ticket: Ticket) =>
                  ticket.columnId === elColumn.id
               );

               column.tickets.sort((a, b) =>
                  (a.position < b.position) ? -1 : 1
               );

               column.tickets.forEach((elTicket: Ticket) => {
                  elTicket.assignedToPeople = [];
                  elTicket.conversations = [];
                  elTicket.tags = [];

                  ticketTags.forEach(elTicketTags => {
                     if (elTicketTags.ticketId !== elTicket.id) { return; }

                     elTicket.tags.push(elTicketTags.tag);
                  });
               });

               this.columnsAndTickets.push(column);
            });
         }).catch(error => console.log(error));

      this.data = [{ columnsAndTickets: this.columnsAndTickets }];
   }

   connectedToIds(index): string[] {
      return this.data[index].columnsAndTickets.map((el: Column) =>
         el.id
      );
   }

   onColumnDrop(event: CdkDragDrop<any[]>) {
      let currentItemDrop: Column = event.container.data[event.previousIndex];
      currentItemDrop.position = event.currentIndex;
      this.columnService.update(currentItemDrop.id, currentItemDrop).subscribe();

      let previousItemDrop: Column = event.container.data[event.currentIndex];
      previousItemDrop.position = event.previousIndex;
      this.columnService.update(previousItemDrop.id, previousItemDrop).subscribe();

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
   }

   onTicketDrop(event: CdkDragDrop<any[]>) {
      if (event.previousContainer === event.container) {
         let currentItemDrop: Ticket = event.container.data[event.previousIndex];
         currentItemDrop.position = event.currentIndex;

         this.ticketService.update(currentItemDrop.id, currentItemDrop).subscribe();

         let previousItemDrop: Column = event.container.data[event.currentIndex];
         previousItemDrop.position = event.previousIndex;

         this.ticketService.update(previousItemDrop.id, previousItemDrop).subscribe();

         moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
         let newPosition = event.currentIndex;
         let columnId = Number.parseInt(event.container.id);
         let ticketId = Number.parseInt(event.item.element.nativeElement.id);
         let ticket = this.allTickets.find(el => el.id === ticketId);
         ticket.columnId = columnId;
         ticket.position = newPosition;

         this.ticketService.update(ticket.id, ticket).subscribe();

         transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
         );
      }
   }

   openAddTicketDialog(column: Column) {
      let user = this.user;

      const dialog = this.matDialog.open(AddTicketComponent, {
         width: '500px',
         height: 'auto',
         position: { top: '40px' },
         data: { column, user },
      });

      dialog.afterClosed().subscribe((result) => {
         console.log(result);

         if (!result) { return; }

         this.wasChanged.next(true);
      });
   }

   openEditTicketDialog(ticket: Ticket, column: Column) {
      let user = this.user;

      const dialog = this.matDialog.open(EditTicketComponent, {
         width: '65%',
         height: '90vh',
         position: { top: '40px' },
         panelClass: 'trend-dialog', // class that disables overflow-y
         data: { ticket, column, user },
      });

      dialog.afterClosed().subscribe(() => {
         dialog.componentInstance.changed ? this.wasChanged.next(true) : '';
      });
   }

   openDeleteTicketDialog(ticket: Ticket, column: Column) {
      const dialog = this.matDialog.open(DeleteTicketComponent, {
         width: '400px',
         height: 'auto',
         position: { top: '40px' },
         data: { ticket, column }
      });

      dialog.afterClosed().subscribe(result => {
         if (!result) { return; }

         this.wasChanged.next(true);
      });
   }

   filterByDate(talks, asc = 1) {
      // talks = [...talks.sort((a: any, b: any) => (asc) * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))];
   }

   addColumn(event: any) {
      const name = this.formColumn.controls['nameColumn'].value.trim();
      const position = this.columnsAndTickets.length;

      if (name.length < 3) { return; }

      let column = new Column(0, name, position, this.boardId, []);

      this.columnService.create(column).subscribe(
         () => {
            this.toastrService.success('Coluna criada com sucesso.', 'Êxito', GlobalConstants.toastrConfig);

            this.wasChanged.next(true);
         },
         (error: HttpErrorResponse) => {
            this.toastrService.error(error.message, `Error ${error.status}`, GlobalConstants.toastrConfig);
         });

      Utils.clearForm(this.formColumn);
      Utils.clickButton('btnCollapseAddColumn');
   }

   editColumnName(event: FocusEvent, column: Column) {
      const element: HTMLElement = (<HTMLElement>event.target);
      const newTitle = element.innerText.trim();

      if (newTitle.length > 18) {
         this.toastrService.error('O nome excedeu o limite de caracteres(18).', 'Erro', GlobalConstants.toastrConfig);

         element.innerText = column.title; // return to old value

         return;
      }

      if (newTitle === column.title) { return; }

      column.title = newTitle;

      this.columnService.update(Number.parseInt(column.id), column).subscribe(
         () => {
            this.toastrService.success('Nome alterado com sucesso.', 'Êxito', GlobalConstants.toastrConfig);
         },
         (error: HttpErrorResponse) => {
            this.toastrService.error(error.message, `Error ${error.status}`, GlobalConstants.toastrConfig);
         }
      )
   }
}
