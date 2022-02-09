
import { People } from "./people";
import { RoleModel } from "./RoleModel";

export class User {
   constructor(
      public id: number,
      public login: string,
      public password: string,
      public roleId: number,
      public role: RoleModel,

      public peopleId: number,
      public people: People,
   ) { }
}
