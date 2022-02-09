import { Column } from "./column";

export class Board {
   constructor(
      public id: number,
      public name: string,

      public peopleHigherId: number,

      public columns: Column[]
   ) { }
}
