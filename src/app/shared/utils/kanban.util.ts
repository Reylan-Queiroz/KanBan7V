import { environment } from "src/environments/environment";
import { Board } from "../models/board";

export class Kanban {
   public static setCurrentBoard(board: Board) {
      const data = JSON.stringify(board);

      localStorage.setItem(environment.currentBoard, btoa(data));
   }

   public static getCurrentBoard(): Board {
      const data = localStorage.getItem(environment.currentBoard);

      if (data)
         return JSON.parse(atob(data));
      else
         return null;
   }
}
