import { Ticket } from 'src/app/models/ticket';
import { ColumnService } from '../../services/column.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/helpers/utils';
import { Column } from 'src/app/models/column';
import { TicketService } from 'src/app/services/ticket.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnsAndTicketsService } from 'src/app/services/columnsAndTickets.service';
import { Conversation } from 'src/app/models/conversation';
import { EditTicketComponent } from 'src/app/components/dialogs/edit-ticket/edit-ticket.component';

@Component({
   selector: 'app-board',
   templateUrl: './board.component.html',
   styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
   public columnsAndTickets: Column[] = [];

   public formColumn: FormGroup;
   public formTicket: FormGroup;

   constructor(
      private dragulaService: DragulaService,
      private toastrService: ToastrService,
      private columnService: ColumnService,
      private ticketService: TicketService,
      private columnsAndTicketsService: ColumnsAndTicketsService,

      private formBuilder: FormBuilder,
      private matDialog: MatDialog,
   ) {
      this.dragulaService.createGroup('COLUMNS', {
         direction: 'horizontal',
         moves: (el, source, handle) => handle.className === 'group-handle',
      });

      this.formColumn = this.formBuilder.group({
         nameColumn: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(18),
         ])]
      });

      this.formTicket = this.formBuilder.group({
         nameTicket: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(20),
         ])]
      });
   }

   async ngOnInit() {
      await this.loadColumnsAndTickets();
   }

   private async loadColumnsAndTickets() {
      const response = await this.columnsAndTicketsService.get().toPromise();
      const allColumns = response.columns;
      const allTickets = response.tickets;
      const allConversations = response.conversations;

      let column: Column;

      allColumns.forEach(
         (element: Column) => {
            column = new Column(element.id, element.name, element.position, []);

            column.tickets = allTickets.filter(
               (ticket: Ticket) =>
                  ticket.columnId === element.id
            );

            column.tickets.forEach(
               (element: Ticket) => {
                  element.conversation = allConversations.filter(
                     (conversation: Conversation) =>
                        conversation.ticketId === element.id
                  )
               }
            );

            this.columnsAndTickets.push(column);
         }
      );
   }

   public addColumn(event: any) {
      const name = this.formColumn.controls['nameColumn'].value.trim();
      const position = this.columnsAndTickets.length + 1;

      if (name.length < 3) {
         return;
      }

      let column = new Column(0, name, position, []);

      this.columnService.create(column).subscribe(
         () => {
            this.showToastrSuccess('Coluna criada com sucesso.', 'Êxito');
            this.columnsAndTickets.push(column);
         },
         (error: HttpErrorResponse) => {
            this.showToastrError(error.message, `Error ${error.status}`);
         });

      Utils.clearForm(this.formColumn);
      Utils.clickButton('btnCollapseAddColumn');
   }

   public addTicket(event: any, column: Column) {
      const name = this.formTicket.controls['nameTicket'].value.trim();
      const position = column.tickets.length + 1;

      if (name.length < 3) {
         return;
      }

      let ticket = new Ticket(0, name, '', new Date(), new Date(), null, position, [], [], [], column.id, 1);

      this.ticketService.create(ticket).subscribe(
         () => {
            this.showToastrSuccess('Ticket criado com sucesso.', 'Êxito');
            column.tickets.push(ticket);
         },
         (error: HttpErrorResponse) => {
            this.showToastrError(error.message, `Error ${error.status}`);
         });

      Utils.clearForm(this.formTicket);
      Utils.clickButton(event.path[5].lastElementChild.lastChild.id);
   }

   public moveTicket() {
      let newTicket: Ticket;
      let position = 0;

      this.columnsAndTickets.forEach(column => {
         column.tickets.forEach(ticket => {
            if (ticket.columnId !== column.id) {
               newTicket = ticket;
               newTicket.columnId = column.id;
               position = column.tickets.findIndex(l => l.id === newTicket.id);
               newTicket.position = position;
            }

         });
      });

      this.ticketService.update(newTicket.id, newTicket).subscribe(
         () => { },
         (error: HttpErrorResponse) => {
            console.log(error);
         }
      );
   }

   public editColumnName(event: FocusEvent, column: Column) {
      const element: HTMLElement = (<HTMLElement>event.target);
      let newName = element.innerText.trim();

      if (newName.length > 18) {
         this.showToastrError('O nome excedeu o limite de caracteres(18).', 'Erro');

         element.innerText = column.name; // return to old value

         return;
      }

      if (newName === column.name)
         return;

      column.name = newName;

      this.columnService.update(column.id, column).subscribe(
         () => {
            this.showToastrSuccess('Nome alterado com sucesso.', 'Êxito');
         },
         (error: HttpErrorResponse) => {
            this.showToastrError(error.message, `Error ${error.status}`);
         }
      )
   }

   public editTicketName(event: FocusEvent, ticket: Ticket) {
      const element: HTMLElement = (<HTMLElement>event.target);
      let newName = element.innerText.trim();

      if (newName.length > 18) {
         this.showToastrError('O nome excedeu o limite de caracteres(18).', 'Erro');
         element.innerText = ticket.name;

         return;
      }

      if (newName === ticket.name)
         return;

      ticket.name = newName;

      this.ticketService.update(ticket.id, ticket).subscribe(
         () => {
            this.showToastrSuccess('Nome alterado com sucesso.', 'Êxito');
         },
         (error: HttpErrorResponse) => {
            this.showToastrError(error.message, `Error ${error.status}`);
         }
      )
   }

   public openDialogEditTicket(ticket: Ticket) {
      const dialogRef = this.matDialog.open(EditTicketComponent, {
         width: '65%',
         height: '90vh',
         position: { top: '40px' },
         panelClass: 'trend-dialog', // class that disables overflow-y
         data: ticket,
      });

      dialogRef.afterClosed().subscribe(
         () => {
            let newTicket: Ticket;
            newTicket = dialogRef.componentInstance.ticket;
            newTicket.description = dialogRef.componentInstance.description;

            const column = this.columnsAndTickets.find(el => el.id === newTicket.columnId);
            let oldTicket = column.tickets.find(el => el.id === newTicket.id);
            oldTicket = newTicket;

            this.ticketService.update(oldTicket.id, oldTicket).subscribe(
               () => { },
               (error: HttpErrorResponse) => {
                  this.showToastrError(error.message, `Error ${error.status}`);
               }
            );
         },
         (error) => {
            this.showToastrError(error, 'Erro');
         }
      );
   }

   public focusInput(inputId: string) {
      Utils.autoFocus(inputId);
   }

   private showToastrSuccess(msg: string, title: string) {
      this.toastrService.success(msg, title, { closeButton: true, progressBar: true, timeOut: 2000 });
   }

   private showToastrError(msg: string, title: string) {
      this.toastrService.error(msg, title, { closeButton: true, progressBar: true, timeOut: 2000 });
   }
}
