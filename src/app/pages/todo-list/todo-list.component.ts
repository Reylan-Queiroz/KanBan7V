import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { Column } from 'src/app/models/column';
import { Ticket } from 'src/app/models/ticket';

@Component({
   selector: 'app-todo-list',
   templateUrl: './todo-list.component.html',
   styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
   public columnsAndTickets: Column[] = [];
   public formColumn: FormGroup;
   public formTicket: FormGroup;

   constructor(private dragulaService: DragulaService, private fb: FormBuilder) {
      this.dragulaService.createGroup("COLUMNS", {
         direction: 'horizontal',
         moves: (el, source, handle) => handle.className === "group-handle",
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

   public addTicket(columnId: number) {
      const column = this.columnsAndTickets.find(el => el.columnId === columnId);

      const ticketName = this.formTicket.controls['nameTicket'].value;
      const ticketId = column.ticketList.length + 1;

      let ticket: Ticket = new Ticket();
      ticket.setItem(ticketId, ticketName);

      column.ticketList.push(ticket);

      this.clearForm(this.formTicket);
      this.save();
   }

   public addColumn() {
      const columnName = this.formColumn.controls['nameColumn'].value;
      const columnId = this.columnsAndTickets.length + 1;

      let column: Column = new Column();
      column.setItem(columnId, columnName, []);

      this.columnsAndTickets.push(column);

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
}
