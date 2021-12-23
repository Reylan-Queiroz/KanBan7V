import { People } from "./people";

export class Conversation {
   constructor(
      public id: number,
      public text: string,
      public date: Date,
      public postedBy: People,

      // Foreing Keys
      public postedById: number,
      public ticketId: number
   ) { }
}
