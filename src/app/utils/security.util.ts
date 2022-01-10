import { GlobalConstants } from 'src/app/helpers/global-constants';
import { User } from "../models/user";


export class Security {
   public static set(user: User, token: string) {
      const data = JSON.stringify(user);

      localStorage.setItem(GlobalConstants.kanbanUser, btoa(data));
      localStorage.setItem(GlobalConstants.kanbanToken, token);
   }

   public static setUser(user: User) {
      const data = JSON.stringify(user);
      localStorage.setItem(GlobalConstants.kanbanUser, btoa(data));
   }

   public static setToken(token: string) {
      localStorage.setItem(GlobalConstants.kanbanToken, token);
   }

   public static getUser(): User {
      const data = localStorage.getItem(GlobalConstants.kanbanUser);
      if (data) {
         return JSON.parse(atob(data));
      } else {
         return null;
      }
   }

   public static getToken(): string {
      const data = localStorage.getItem(GlobalConstants.kanbanToken);
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

   public static clear() {
      localStorage.removeItem(GlobalConstants.kanbanUser);
      localStorage.removeItem(GlobalConstants.kanbanToken);
   }
}
