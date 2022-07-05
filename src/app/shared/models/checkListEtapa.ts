export class CheckListEtapa {
   constructor(
      public id: number,
      public descricao: string,
      public children: CheckListEtapa[],
      public prazo: Date | null,

      public posicao: number,
      public dataConclusao?: Date,
   ) { }
}
