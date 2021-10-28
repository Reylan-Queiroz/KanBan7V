import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { Column } from 'src/app/domain/models/column';
import { Ticket } from 'src/app/domain/models/ticket';
import { ConfirmComponent } from 'src/app/shared/dialogs/confirm/confirm.component';
import { EditTicketComponent } from 'src/app/shared/dialogs/edit-ticket/edit-ticket.component';

@Component({
   selector: 'app-todo-list',
   templateUrl: './todo-list.component.html',
   styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnChanges {
   public columnsAndTickets: Column[] = [];
   public formColumn: FormGroup;
   public formTicket: FormGroup;

   constructor(private dragulaService: DragulaService, private fb: FormBuilder, public dialog: MatDialog) {
      this.dragulaService.createGroup('COLUMNS', {
         direction: 'horizontal',
         moves: (el, source, handle) => handle.className === 'group-handle',
      });

      this.formColumn = this.fb.group({
         nameColumn: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.required,
         ])]
      });

      this.formTicket = this.fb.group({
         nameTicket: ['', Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.required,
         ])]
      });

      this.loadColumnsAndTickets();
   }

   ngOnInit() { }

   ngOnChanges(changes: SimpleChanges): void { }

   public addTicket(event: any, columnId: number) {
      const column = this.columnsAndTickets.find(el => el.columnId === columnId);
      const ticketName = this.formTicket.controls['nameTicket'].value;
      const ticketId = column.ticketList.length + 1;

      column.ticketList.push(new Ticket().setItem(ticketId, columnId, ticketName, '', new Date(), new Date(), [], []));

      document.getElementById(event.path[5].lastElementChild.lastChild.id).click();

      this.clearForm(this.formTicket);
      this.save();
   }

   public addColumn(event: any) {
      const columnName = this.formColumn.controls['nameColumn'].value;
      const columnId = this.columnsAndTickets.length + 1;

      this.columnsAndTickets.push(new Column().setItem(columnId, columnName, []));

      document.getElementById('btnCollapseAddColumn').click();

      this.clearForm(this.formColumn);
      this.save();
   }

   public loadColumnsAndTickets() {
      const data = localStorage.getItem('columnsAndTickets');

      if (data) {
         this.columnsAndTickets = JSON.parse(data);
      } else {
         this.columnsAndTickets = [];
      }
   }

   public clearForm(formName: any) {
      formName.reset();
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
      const oldColumn = this.columnsAndTickets.find(el => el.columnId === column.columnId);
      const newColumnName = event.target.innerText;

      if (newColumnName === oldColumn.columnName) {
         return;
      } else {
         column.columnName = newColumnName;

         this.save();
      }
   }

   public openDialogEditTicket(ticket: Ticket) {
      const dialogRef = this.dialog.open(EditTicketComponent, {
         width: '580px',
         data: ticket,
         position: { top: '40px' }
      });

      let newTicket: Ticket;

      dialogRef.afterClosed().subscribe(result => {
         if (result === undefined) {
            return;
         }

         newTicket = result;

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

         const column = this.columnsAndTickets.find(el => el.columnId === newTicket.columnId);
         let oldTicket = column.ticketList.find(el => el.ticketId === newTicket.ticketId);

         oldTicket = newTicket;

         console.log(newTicket);

         this.save();
      });
   }
}
