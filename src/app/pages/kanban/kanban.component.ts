import { DeleteTicketComponent } from '../../components/dialogs/delete-ticket/delete-ticket.component';
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
import { Conversation } from 'src/app/models/conversation';
import { EditTicketComponent } from 'src/app/components/dialogs/edit-ticket/edit-ticket.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AddTicketComponent } from 'src/app/components/dialogs/add-ticket/add-ticket.component';
import { Security } from 'src/app/utils/security.util';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
   selector: 'app-board',
   templateUrl: './kanban.component.html',
   styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {
   private user: User = Security.getUser();

   data: any[] = [];
   columnsAndTickets: any[] = [];

   private allColumns: Column[] = [];
   private allTickets: Ticket[] = [];
   private allConversations: Conversation[] = [];
   private allPeoples: People[] = [];

   formColumn: FormGroup;

   constructor(
      private toastrService: ToastrService,
      private columnService: ColumnService,
      private ticketService: TicketService,
      private dataService: DataService,

      private formBuilder: FormBuilder,
      private matDialog: MatDialog,
      private router: Router,
   ) {
      const data = router.getCurrentNavigation().extras.state.data;
      console.log(data);

      this.formColumn = this.formBuilder.group({
         nameColumn: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(18),
         ])]
      });

      this.user.people = this.allPeoples.find(el => el.id === this.user.peopleId);
   }

   async ngOnInit() {
      await this.loadData();
   }

   private async loadData() {
      try {
         var response = await this.dataService.get().toPromise();
         console.log(response);

         let column: Column;

         this.allColumns = response.columns;
         this.allTickets = response.tickets;
         this.allConversations = response.conversations;
         this.allPeoples = response.peoples;

         this.allColumns.forEach((elColumn: Column) => {
            column = new Column(elColumn.id.toString(), elColumn.title, elColumn.position, []);

            column.tickets = this.allTickets.filter((ticket: Ticket) =>
               ticket.columnId === elColumn.id
            );

            column.tickets.sort((a, b) =>
               (a.position < b.position) ? -1 : 1
            );

            column.tickets.forEach((elTicket: any) => {
               elTicket.conversations = this.allConversations.filter((conversation: Conversation) =>
                  conversation.ticketId === elTicket.id
               );

               elTicket.assignedToPeople = [];

               response.assignedToPeople.forEach(element => {
                  if (element.ticketId === elTicket.id) {
                     elTicket.assignedToPeopleId = element.id;
                     elTicket.assignedToPeople.push(element.people);
                  }
               });

               elTicket.tags = [];

               response.ticketTags.forEach(element => {
                  if (element.ticketId === elTicket.id) {
                     elTicket.ticketTagsId = element.id;

                     element.tag.checked = true;

                     elTicket.tags.push(element.tag)
                  }
               });
            });

            this.columnsAndTickets.push(column);
         });

         this.columnsAndTickets.sort((a, b) =>
            (a.position < b.position) ? -1 : 1
         );
      } catch (error) {
         // ignore
      }

      let data = { columnsAndTickets: this.columnsAndTickets };
      let arr: any[] = [];
      arr.push(data);
      this.data = arr;
   }

   private reloadData() {
      this.data = [];
      this.columnsAndTickets = [];
      this.loadData();
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

   openDialogAddTicket(column: Column) {
      let user = this.user;

      const dialog = this.matDialog.open(AddTicketComponent, {
         width: '500px',
         height: 'auto',
         position: { top: '40px' },
         data: { column, user },
      });

      dialog.afterClosed().subscribe((result) => {
         if (result === undefined) { return; }

         this.reloadData();
      });
   }

   openDialogEditTicket(ticket: Ticket, column: Column) {
      let user = this.user;

      const dialog = this.matDialog.open(EditTicketComponent, {
         width: '65%',
         height: '90vh',
         position: { top: '40px' },
         panelClass: 'trend-dialog', // class that disables overflow-y
         data: { ticket, column, user },
      });

      dialog.afterClosed().subscribe((result) => {
         if (result === undefined) { return; }

         this.reloadData();
      });
   }

   openDialogDeleteTicket(ticket: Ticket, column: Column) {
      this.matDialog.open(DeleteTicketComponent, {
         width: '400px',
         height: 'auto',
         position: { top: '40px' },
         data: { ticket, column }
      });
   }

   filterByDate(talks, asc = 1) {
      // talks = [...talks.sort((a: any, b: any) => (asc) * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))];
   }

   addColumn(event: any) {
      const name = this.formColumn.controls['nameColumn'].value.trim();
      const position = this.columnsAndTickets.length;

      if (name.length < 3) { return; }

      let column = new Column(0, name, position, []);

      this.columnService.create(column).subscribe(
         () => {
            this.toastrService.success('Coluna criada com sucesso.', 'Êxito', GlobalConstants.toastrConfig);

            this.reloadData();
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
