import { Conversation } from "./conversation";
import { People } from "./people";
import { Tag } from "./tag";

export class Ticket {
   constructor(
      public ticketId: number,
      public columnId: number,
      public ticketName: string,
      public description: string,
      public creationDate: Date,
      public outletDate: Date,
      public assignedToPeople: People[],
      public conversation: Conversation[],
      public tagList: Tag[]
   ) { }
}
