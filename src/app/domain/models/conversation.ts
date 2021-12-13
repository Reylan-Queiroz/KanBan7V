import { People } from "./people";

export class Conversation {
   constructor(
      public conversationId: number,
      public text: string,
      public dateTime: Date,
      public postedBy: People
   ) { }
}
