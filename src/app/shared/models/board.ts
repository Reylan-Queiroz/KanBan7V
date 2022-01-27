import { Column } from "./column";

export class Board {
   constructor(
      public id: number,
      public name: string,
      public columns: Column[]
   ) { }
}
