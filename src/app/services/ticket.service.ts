import { GlobalConstants } from 'src/app/helpers/global-constants';
import { Ticket } from 'src/app/models/ticket';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from '../interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class TicketService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post<Ticket>(`${GlobalConstants.apiUrl}/ticket/create`, obj);
   }

   getAll() {
      throw new Error('Method not implemented.');
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      return this.http.put<Ticket>(`${GlobalConstants.apiUrl}/Ticket/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete<Ticket>(`${GlobalConstants.apiUrl}/Ticket/${id}`);
   }
}
