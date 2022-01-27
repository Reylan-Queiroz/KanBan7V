import { User } from "../models/user";
import { Constants } from "./constants.util";

export class Security {
   public static set(user: User, token: string) {
      const data = JSON.stringify(user);

      localStorage.setItem(Constants.kanbanUser, btoa(data));
      localStorage.setItem(Constants.kanbanToken, token);
   }

   public static setUser(user: User) {
      const data = JSON.stringify(user);
      localStorage.setItem(Constants.kanbanUser, btoa(data));
   }

   public static setToken(token: string) {
      localStorage.setItem(Constants.kanbanToken, token);
   }

   public static getUser(): User {
      const data = localStorage.getItem(Constants.kanbanUser);
      if (data) {
         return JSON.parse(atob(data));
      } else {
         return null;
      }
   }

   public static getToken(): string {
      const data = localStorage.getItem(Constants.kanbanToken);
      if (data) {
         return data;
      } else {
         return null;
      }
   }

   public static hasToken(): boolean {
      if (this.getToken())
         return true;
      else
         return false;
   }

   public static isInRole(role: string): boolean {
      const user = this.getUser();

      if (!user)
         return false;

      if (!user.role || user.role.length == 0)
         return false;

      return user.role.includes(role);
   }

   public static clear() {
      localStorage.removeItem(Constants.kanbanUser);
      localStorage.removeItem(Constants.kanbanToken);
   }
}
