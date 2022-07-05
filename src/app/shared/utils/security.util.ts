import { environment } from "src/environments/environment";
import { Role } from "../enums/role.enum";
import { User } from "../models/user";

export class Security {
   public static set(user: User, token: string) {
      const data = JSON.stringify(user);

      localStorage.setItem(environment.kanbanUser, btoa(data));
      localStorage.setItem(environment.kanbanToken, token);
   }

   public static setUser(user: User) {
      const data = JSON.stringify(user);

      localStorage.setItem(environment.kanbanUser, btoa(data));
   }

   public static setToken(token: string) {
      localStorage.setItem(environment.kanbanToken, token);
   }

   public static getUser(): User {
      const data = localStorage.getItem(environment.kanbanUser);

      if (data)
         return JSON.parse(atob(data));
      else
         return null;
   }

   public static getToken(): string {
      const data = localStorage.getItem(environment.kanbanToken);

      if (data)
         return data;
      else
         return null;
   }

   public static hasToken(): boolean {
      if (this.getToken())
         return true;
      else
         return false;
   }

   public static isInRole(roles: Role[]): boolean {
      const user = this.getUser();

      if (!user)
         return false;

      return roles.indexOf(user.roleId) >= 0;
   }

   public static clear() {
      localStorage.removeItem(environment.kanbanUser);
      localStorage.removeItem(environment.kanbanToken);
   }
}
