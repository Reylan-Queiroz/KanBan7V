export class CheckListEtapa {
   constructor(
      public id: number,
      public descricao: string,
      public children: CheckListEtapa[],

      public checked: boolean,
      public posicao: number,
      public prazo: Date,
      public dataConclusao?: Date,
   ) { }
}
