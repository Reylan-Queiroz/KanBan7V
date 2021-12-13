import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { Column } from 'src/app/domain/models/column';
import { Ticket } from 'src/app/domain/models/ticket';
import { Utils } from 'src/app/helpers/utils';
import { EditTicketComponent } from '../shared/dialogs/edit-ticket/edit-ticket.component';

@Component({
   selector: 'app-todo-list',
   templateUrl: './todo-list.component.html',
   styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
   public columnsAndTickets: Column[] = [];
   public formColumn: FormGroup;
   public formTicket: FormGroup;

   constructor(
      private dragulaService: DragulaService,
      private formBuilder: FormBuilder,
      private matDialog: MatDialog,
      private toastrService: ToastrService
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

   ngOnInit() {
      this.dragulaService.createGroup('COLUMNS', {
         direction: 'horizontal',
         moves: (el, source, handle) => handle.className === 'group-handle',
      });

      this.loadColumnsAndTickets();
   }

   public addTicket(event: any, columnId: number) {
      if (event.keyCode === 13 || event.type === 'click') {
         const column = this.columnsAndTickets.find(el => el.columnId === columnId);
         const ticketName = this.formTicket.controls['nameTicket'].value;
         const ticketId = column.ticketList.length + 1;

         if (ticketName.length < 3) {
            return;
         }

         column.ticketList.push(new Ticket(ticketId, columnId, ticketName, '', new Date(), new Date(), [], [], []));

         Utils.clearForm(this.formTicket);
         Utils.clickButton(event.path[5].lastElementChild.lastChild.id);

         this.save();
      }
   }

   public addColumn(event: any) {
      if (event.keyCode === 13 || event.type === 'click') {
         const columnName = this.formColumn.controls['nameColumn'].value;
         const columnId = this.columnsAndTickets.length + 1;

         if (columnName.length < 3) {
            return;
         }

         this.columnsAndTickets.push(new Column(columnId, columnName, []));

         Utils.clearForm(this.formColumn);
         Utils.clickButton('btnCollapseAddColumn');

         this.save();
      }
   }

   public loadColumnsAndTickets() {
      const data = localStorage.getItem('columnsAndTickets');

      if (data) {
         this.columnsAndTickets = JSON.parse(data);
      } else {
         this.columnsAndTickets = [];
      }
   }

   public save() {
      const data = JSON.stringify(this.columnsAndTickets);
      localStorage.setItem('columnsAndTickets', data);
   }

   public move(event) {
      this.save();
   }

   public editColumnName(event: FocusEvent, column: Column) {
      const element: HTMLElement = (<HTMLElement>event.target);
      let newName = element.innerText;

      if (newName.length > 18) {
         this.showToastrError('', 'O nome excedeu o limite de caracteres(18).');
         element.innerText = column.columnName;

         return;
      } else {
         if (newName === column.columnName)
            return;

         column.columnName = newName.trim();
         this.showToastrSuccess('', 'Nome alterado com sucesso.')

         this.save();
      }
   }

   public editTicketName(event: FocusEvent, ticket: Ticket) {
      const element: HTMLElement = (<HTMLElement>event.target);
      let newName = element.innerText;

      if (newName.length > 18) {
         this.showToastrError('', 'O nome excedeu o limite de caracteres(18).');
         element.innerText = ticket.ticketName;

         return;
      } else {
         if (newName === ticket.ticketName)
            return;

         ticket.ticketName = newName.trim();
         this.showToastrSuccess('', 'Nome alterado com sucesso.');

         this.save();
      }
   }

   public openDialogEditTicket(ticket: Ticket) {
      const dialogRef = this.matDialog.open(EditTicketComponent, {
         width: '980px',
         height: '90%',
         position: { top: '40px' },
         panelClass: 'trend-dialog', // class that disables overflow-y
         data: ticket,
      });

      let newTicket: Ticket;

      dialogRef.afterClosed().subscribe(result => {
         if (result === undefined) {
            return;
         }

         newTicket = result;
         newTicket.description = dialogRef.componentInstance.description;

         const column = this.columnsAndTickets.find(el => el.columnId === newTicket.columnId);
         let oldTicket = column.ticketList.find(el => el.ticketId === newTicket.ticketId);

         oldTicket = newTicket;

         this.save();

         return;
      });

      dialogRef.backdropClick().subscribe(result => {
         if (result === undefined) {
            return;
         }

         newTicket = dialogRef.componentInstance.ticket;
         newTicket.description = dialogRef.componentInstance.description;

         const column = this.columnsAndTickets.find(el => el.columnId === newTicket.columnId);
         let oldTicket = column.ticketList.find(el => el.ticketId === newTicket.ticketId);

         oldTicket = newTicket;

         this.save();
      });
   }

   public focusInput(inputId: string) {
      Utils.autoFocus(inputId);
   }

   private showToastrSuccess(title: string, msg: string) {
      this.toastrService.success(title, msg, { closeButton: true, progressBar: true, timeOut: 2000 });
   }

   private showToastrError(title: string, msg: string) {
      this.toastrService.error(title, msg, { closeButton: true, progressBar: true, timeOut: 2000 });
   }
}
