import { People } from "./people";

export class Conversation {
   public conversationId: number;
   public text: string;
   public dateTime: Date;
   public postedBy: People;

   public setItem(_conversationId: number, _text: string, _dateTime: Date, _postedBy: People) {
      this.conversationId = _conversationId;
      this.text = _text;
      this.dateTime = _dateTime;
      this.postedBy = _postedBy;

      return this;
   }
}
