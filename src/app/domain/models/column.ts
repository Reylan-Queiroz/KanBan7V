import { Ticket } from "./ticket";

export class Column {
   constructor(
      public columnId: number,
      public columnName: string,
      public ticketList: Ticket[]
   ) { }
}
