import { Color } from "./color";

export class Tag {
   constructor(
      public id: number,
      public name: string,
      public checked: boolean,

      public colorId: number,
      public color: Color
   ) { }
}
