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
      public createdAt: Date,
      public dueDate: Date,
      public dateConclusion: Date,
      public position: number,

      public postedById: number,
      public postedBy: People,

      public columnId: any,
      public column: Column,

      public files: FileModel[],
      public assignedToPeople: People[],
      public conversations: Conversation[],
      public tags: Tag[],
   ) { }
}
