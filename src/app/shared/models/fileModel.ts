export class FileModel {
   constructor(
      public id: number,
      public fileName: string,
      public base64: string,
      public type: string,
   ) { }
}
