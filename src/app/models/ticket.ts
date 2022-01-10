import { Conversation } from "./conversation";
import { People } from "./people";
import { Tag } from "./tag";

export class Ticket {
   constructor(
      public id: number,
      public title: string,
      public description: string,
      public creationDate: Date,
      public outletDate: Date,
      public postedBy: People,
      public position: number,

      public assignedToPeople: People[],
      public conversations: Conversation[],
      public tags: Tag[],

      // Foreing Keys
      public columnId: any,
      public postedById: number,
   ) { }
}
