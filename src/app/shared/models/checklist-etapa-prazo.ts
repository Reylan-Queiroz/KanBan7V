import { CheckListEtapa } from "./checkListEtapa";
import { Ticket } from "./ticket";

export class ChecklistEtapaPrazo {
   constructor(
      public id: number,
      public prazo: Date | any,
      public checklistEtapaId: number,
      public checklistEtapa: CheckListEtapa | null,
      public ticketId: number,
      public ticket: Ticket | null
   ) { }
}
