import { People } from "./people";

export class PeopleGroup {
   constructor(
      public id: number,
      public name: string,
      public createdById: number,
      public createdBy: People,
      public peoples: People[]
   ) { }
}
