import { Ticket } from 'src/app/models/ticket';

export class Column {
   constructor(
      public id: number,
      public name: string,
      public position: number,
      public tickets: Ticket[]
   ) { }
}
