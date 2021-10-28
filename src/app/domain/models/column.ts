import { Ticket } from "./ticket";

export class Column {
   constructor() { }

   public columnId: number;
   public columnName: string;
   public ticketList: Ticket[];

   public setItem(_columnId: number, _columnName: string, _ticketList: Ticket[]) {
      this.columnId = _columnId;
      this.columnName = _columnName;
      this.ticketList = _ticketList;

      return this;
   }
}
