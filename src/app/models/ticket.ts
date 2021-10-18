export class Ticket {
   constructor() { }

   public ticketId: number;
   public ticketName: string;

   public setItem(_ticketId: number, _ticketName: string) {
      this.ticketId = _ticketId;
      this.ticketName = _ticketName;
   }
}
