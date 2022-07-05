import { Column } from './column';
import { Conversation } from "./conversation";
import { FileModel } from './fileModel';
import { People } from "./people";
import { Tag } from "./tag";

export class Ticket {
   constructor(
      public id: number,
      public title: string,
      public description: string,
      public createdAt: Date | string,
      public dueDate: Date,
      public dateFinished: Date,
      public hasFinished: boolean,
      public position: number,

      public postedById: number,
      public postedBy: People,

      public columnId: any,
      public column: Column,

      public files: FileModel[],
      public assignedTo: [],
      public conversations: Conversation[],
      public tags: Tag[],
   ) { }
}
