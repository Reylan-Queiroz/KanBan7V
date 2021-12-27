import { DataService } from './../../services/data.service';
import { ColumnsAndTickets } from './../../models/columnsAndTickets';
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

@Component({
   selector: 'app-board',
   templateUrl: './board.component.html',
   styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
   data: ColumnsAndTickets[] = [];

   formColumn: FormGroup;
   formTicket: FormGroup;

   constructor(
      private toastrService: ToastrService,
      private columnService: ColumnService,
      private ticketService: TicketService,
      private dataService: DataService,

      private formBuilder: FormBuilder,
      private matDialog: MatDialog,
   ) {
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
      await this.load();
   }

   private async load() {
      const response = await this.dataService.get().subscribe(
         (response) => {

         }, (error) => {
            console.log(error);
         }
      );

      return;

      // const allColumns = response.columns;
      // const allTickets = response.tickets;
      // const allConversations = response.conversations;

      // let column: Column;

      // allColumns.forEach(
      //    (element: Column) => {
      //       column = new Column(element.id, element.name, element.position, []);

      //       column.tickets = allTickets.filter(
      //          (ticket: Ticket) =>
      //             ticket.columnId.toString() === element.id
      //       );

      //       column.tickets.forEach(
      //          (element: Ticket) => {
      //             element.conversation = allConversations.filter(
      //                (conversation: Conversation) =>
      //                   conversation.ticketId === element.id
      //             )
      //          }
      //       );

      //       this.data[0].columnsAndTickets.push(column);
      //    }
      // );
   }

   trackIds(boardIndex): string[] {
      //return this.boards[boardIndex].tracks.map(track => track.id);
      return this.data[boardIndex].columnsAndTickets.map(track => track.id);
   }

   onTalkDrop(event: CdkDragDrop<any[]>) {
      if (event.previousContainer === event.container) {
         moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
         transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
         );
      }
   }

   onTrackDrop(event: CdkDragDrop<any[]>) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
   }

   addEditTalk(talk: any, track: any, edit = false) {
      // this._dialog.open(EditTalkComponent, { data: { talk, edit }, width: '500px' })
      //    .afterClosed()
      //    .subscribe(newTalkData => edit ? Object.assign(talk, newTalkData) : track.talks.unshift(newTalkData));
   }

   deleteTalk(talk: any, track: any) {
      // this._dialog.open(DeleteTalkComponent, { data: talk, width: '500px' })
      //    .afterClosed()
      //    .subscribe(response => {
      //       // Wait for it to close and delete the talk if the user agreed.
      //       if (response) {
      //          track.talks.splice(track.talks.indexOf(talk), 1);
      //       }
      //    });
   }

   filterByDate(talks, asc = 1) {
      // talks = [...talks.sort((a: any, b: any) => (asc) * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))];
   }

   addColumn(event: any) {
      const name = this.formColumn.controls['nameColumn'].value.trim();
      const position = this.data.length + 1;

      if (name.length < 3) {
         return;
      }

      let column = new Column('0', name, position, []);

      this.columnService.create(column).subscribe(
         () => {
            this.showToastrSuccess('Coluna criada com sucesso.', 'Êxito');
            this.data[0].columnsAndTickets.push(column);
         },
         (error: HttpErrorResponse) => {
            this.showToastrError(error.message, `Error ${error.status}`);
         });

      Utils.clearForm(this.formColumn);
      Utils.clickButton('btnCollapseAddColumn');
   }

   addTicket(event: any, column: Column) {
      const name = this.formTicket.controls['nameTicket'].value.trim();
      const position = column.tickets.length + 1;

      if (name.length < 3) {
         return;
      }

      let ticket = new Ticket(0, name, '', new Date(), new Date(), null, position, [], [], [], Number.parseInt(column.id), 1);

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

   editColumnName(event: FocusEvent, column: Column) {
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

      this.columnService.update(Number.parseInt(column.id), column).subscribe(
         () => {
            this.showToastrSuccess('Nome alterado com sucesso.', 'Êxito');
         },
         (error: HttpErrorResponse) => {
            this.showToastrError(error.message, `Error ${error.status}`);
         }
      )
   }

   editTicketName(event: FocusEvent, ticket: Ticket) {
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

   openDialogEditTicket(ticket: Ticket, column: Column) {
      const dialogRef = this.matDialog.open(EditTicketComponent, {
         width: '65%',
         height: '90vh',
         position: { top: '40px' },
         panelClass: 'trend-dialog', // class that disables overflow-y
         data: {ticket, column},
      });

      dialogRef.afterClosed().subscribe(
         () => {
            // let newTicket: Ticket;
            // newTicket = dialogRef.componentInstance.ticket;
            // newTicket.description = dialogRef.componentInstance.description;

            // const column = this.columnsAndTickets.find(el => el.id === newTicket.columnId);
            // let oldTicket = column.tickets.find(el => el.id === newTicket.id);
            // oldTicket = newTicket;

            // this.ticketService.update(oldTicket.id, oldTicket).subscribe(
            //    () => { },
            //    (error: HttpErrorResponse) => {
            //       this.showToastrError(error.message, `Error ${error.status}`);
            //    }
            // );
         },
         (error) => {
            this.showToastrError(error, 'Erro');
         }
      );
   }

   focusInput(inputId: string) {
      Utils.autoFocus(inputId);
   }

   private showToastrSuccess(msg: string, title: string) {
      this.toastrService.success(msg, title, { closeButton: true, progressBar: true, timeOut: 2000 });
   }

   private showToastrError(msg: string, title: string) {
      this.toastrService.error(msg, title, { closeButton: true, progressBar: true, timeOut: 2000 });
   }
}
