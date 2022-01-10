import { Ticket } from 'src/app/models/ticket';

export class Column {
   constructor(
      public id: any,
      public title: string,
      public position: number,
      public tickets: Ticket[]
   ) { }
}
