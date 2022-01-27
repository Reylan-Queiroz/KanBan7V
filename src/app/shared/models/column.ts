import { Board } from './board';
import { Ticket } from './ticket';

export class Column {
   constructor(
      public id: any,
      public title: string,
      public position: number,

      public boardId: number,
      public board: Board,

      public tickets: Ticket[]
   ) { }
}
