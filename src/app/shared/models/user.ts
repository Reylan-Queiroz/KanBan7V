import { People } from "./people";

export class User {
   constructor(
      public id: number,
      public login: string,
      public password: string,
      public roleId: number,
      public role: string,
      public peopleId: number,
      public people: People,
   ) { }
}
