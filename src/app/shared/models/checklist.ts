import { CheckListEtapa } from "./checkListEtapa";

export class Checklist {
   constructor(
      public id: number,
      public descricao: string,
      public checkListEtapas: CheckListEtapa[] = [],
   ) { }
}
