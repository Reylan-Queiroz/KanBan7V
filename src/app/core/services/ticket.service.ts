import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ticket } from 'src/app/shared/models/ticket';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
   providedIn: 'root'
})
export class TicketService extends BaseService<Ticket, number> {
   constructor(protected _http: HttpClient) {
      super(_http, `${environment.api.baseUrl}/Ticket`);
   }
}
