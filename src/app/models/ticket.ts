import { Conversation } from "./conversation";
import { People } from "./people";
import { Tag } from "./tag";

export class Ticket {
   constructor(
      public id: number,
      public name: string,
      public description: string,
      public creationDate: Date,
      public outletDate: Date,
      public postedBy: People,
      public position: number,

      public assignedToPeople: People[],
      public conversation: Conversation[],
      public tagList: Tag[],

      // Foreing Keys
      public columnId: number,
      public postedById: number,
   ) { }
}
