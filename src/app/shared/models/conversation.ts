import { People } from "./people";
import { Ticket } from "./ticket";
import { FileModel } from "./fileModel";

export class Conversation {
   constructor(
      public id: number,
      public text: string,
      public oldText: string,
      public date: Date | string,
      public modified: boolean,

      public conversationFileId: number,
      public file: FileModel,

      public postedById: number,
      public postedBy: People,

      public ticketId: number,
      public ticket: Ticket
   ) { }
}
