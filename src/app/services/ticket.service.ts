import { GlobalConstants } from './../helpers/global-constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from '../interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class TicketService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${GlobalConstants.apiUrl}/Ticket/Create`, obj);
   }

   getAll() {
      return this.http.get(`${GlobalConstants.apiUrl}/Ticket`);
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      return this.http.put(`${GlobalConstants.apiUrl}/Ticket/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${GlobalConstants.apiUrl}/Ticket/${id}`);
   }
}
