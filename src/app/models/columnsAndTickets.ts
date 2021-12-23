import { Conversation } from './conversation';
import { Ticket } from 'src/app/models/ticket';
import { Column } from 'src/app/models/column';

export class ColumnsAndTickets {
   public columns: Column[] = [];
   public tickets: Ticket[] = [];
   public conversations: Conversation[] = [];
}
