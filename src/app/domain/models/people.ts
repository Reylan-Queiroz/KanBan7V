export class People {
   constructor() { }

   public peopleId: number;
   public peopleName: string;

   public setItem(_peopleId: number, _peopleName: string){
      this.peopleId = _peopleId;
      this.peopleName = _peopleName;

      return this;
   }
}
