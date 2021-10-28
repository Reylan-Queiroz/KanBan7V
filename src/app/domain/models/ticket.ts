import { Conversation } from "./conversation";
import { People } from "./people";

export class Ticket {
   constructor() { }

   public ticketId: number;
   public columnId: number;
   public ticketName: string;
   public description: string;
   public creationDate: Date;
   public outletDate: Date;
   public assignedToPeople: People[];
   public conversation: Conversation[];

   public setItem(_ticketId: number, _columnId: number,_ticketName: string, _description: string, _creationDate: Date, _outletDate: Date, _assignedToPeople: People[], _conversation: Conversation[]) {
      this.ticketId = _ticketId;
      this.columnId = _columnId;
      this.ticketName = _ticketName;
      this.description = _description;
      this.creationDate = _creationDate;
      this.outletDate = _outletDate;
      this.assignedToPeople = _assignedToPeople;
      this.conversation = _conversation;

      return this;
   }
}
