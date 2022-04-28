export class CheckListEtapa {
   constructor(
      public id: number,
      public descricao: string,
      public children: CheckListEtapa[],

      public checkListEtapaPaiId: number, //FK
      public posicao: number,
      public prazo: Date,
      public dataConclusao?: Date,
   ) { }
}
