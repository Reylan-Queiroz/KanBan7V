import { People } from "./people";

export class User {
   id: number;
   peopleId: number;
   people: People;
   login: string;
   password: string;
}
