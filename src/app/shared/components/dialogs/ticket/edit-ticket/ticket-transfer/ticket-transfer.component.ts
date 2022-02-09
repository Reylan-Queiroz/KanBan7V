import { TicketService } from './../../../../../../core/services/ticket.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ColumnService } from './../../../../../../core/services/column.service';
import { BoardService } from './../../../../../../core/services/board.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Ticket } from 'src/app/shared/models/ticket';

@Component({
   selector: 'app-ticket-transfer',
   templateUrl: './ticket-transfer.component.html',
   styleUrls: ['./ticket-transfer.component.scss']
})
export class TicketTransferComponent implements OnInit {
   @Input() currentTicket: Ticket;
   @Output() hasChanged = new EventEmitter();

   private _ticket: Ticket;
   private _columns: any[] = [];

   boards: any[] = [];
   columnsFiltered: any[] = [];

   form: FormGroup;

   constructor(
      private _fb: FormBuilder,

      private _boardService: BoardService,
      private _columnService: ColumnService,
      private _ticketService: TicketService,
   ) {
      this.form = this._fb.group({
         board: ['', Validators.required],
         column: ['', Validators.required]
      });

      this.form.controls['board'].valueChanges
         .subscribe((boardId) => {
            this.columnsFiltered = this._columns.filter(el => el.boardId === boardId);
         });
   }

   async ngOnInit() {
      await this._loadData();

      this._ticket = this.currentTicket;
   }

   private async _loadData() {
      await this._boardService.getAll()
         .toPromise()
         .then((res: any) => {
            this.boards = res;
         }).catch(err => console.log(err));

      await this._columnService.getAll()
         .toPromise()
         .then((res: any) => {
            this._columns = res;
         }).catch(err => console.log(err));

      this.boards = this.boards.filter(el => el.peopleHigherId === this.currentTicket.postedBy.createdById);
   }

   onSubmit(form: FormGroup) {
      this._ticket.columnId = form.controls['column'].value;
      this._ticket.column = this._columns.find(el => el.id === this._ticket.columnId);

      this._ticketService.update(this._ticket.id, this._ticket)
         .subscribe((res) => {
            this.hasChanged.emit(true);
         }, (error) => { console.log(error); });
   }
}
