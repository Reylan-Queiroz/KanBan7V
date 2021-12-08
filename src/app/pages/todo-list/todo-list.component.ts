import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { Column } from 'src/app/domain/models/column';
import { Ticket } from 'src/app/domain/models/ticket';
import { Utils } from 'src/app/helpers/utils';
import { EditTicketComponent } from '../shared/dialogs/edit-ticket/edit-ticket.component';

@Component({
   selector: 'app-todo-list',
   templateUrl: './todo-list.component.html',
   styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnChanges {
   public columnsAndTickets: Column[] = [];
   public formColumn: FormGroup;
   public formTicket: FormGroup;
   public formColumnName: FormGroup;

   constructor(private _dragulaService: DragulaService, private _formBuilder: FormBuilder, public dialog: MatDialog) {
      this._dragulaService.createGroup('COLUMNS', {
         direction: 'horizontal',
         moves: (el, source, handle) => handle.className === 'group-handle',
      });

      this.formColumn = this._formBuilder.group({
         nameColumn: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(18),
         ])]
      });

      this.formTicket = this._formBuilder.group({
         nameTicket: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(20),
         ])]
      });

      this.formColumnName = this._formBuilder.group({
         columnName: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(18)
         ])]
      });

      this.loadColumnsAndTickets();
   }

   ngOnInit() { }

   ngOnChanges(changes: SimpleChanges): void { }

   public addTicket(event: any, columnId: number) {
      if (event.keyCode === 13 || event.type === 'click') {
         const column = this.columnsAndTickets.find(el => el.columnId === columnId);
         const ticketName = this.formTicket.controls['nameTicket'].value;
         const ticketId = column.ticketList.length + 1;

         if (ticketName.length < 3) {
            return;
         }

         column.ticketList.push(new Ticket().setItem(ticketId, columnId, ticketName, '', new Date(), new Date(), [], [], []));

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

         this.columnsAndTickets.push(new Column().setItem(columnId, columnName, []));

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

   public moveColumn(event) {
      this.save();
   }

   public moveTicket(event) {
      this.save();
   }

   public editColumnName(event: any, column: Column) {
      let newName: string = event.target.innerHTML;

      if (newName.length > 18) {
         return;
      } else {
         column.columnName = newName.trim();
         this.save();
      }
   }

   public editTicketName(event: any, ticket: Ticket) {
      let newName: string = event.target.innerHTML;

      ticket.ticketName = newName;

      this.save();
   }

   public editDescription(event: any, ticket: Ticket) {
      let newName: string = event.target.innerHTML;

      ticket.description = newName;

      this.save();
   }

   public openDialogEditTicket(ticket: Ticket) {
      const dialogRef = this.dialog.open(EditTicketComponent, {
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
      setTimeout(function () {
         document.getElementById(inputId).focus();
      }, 350);
   }
}
