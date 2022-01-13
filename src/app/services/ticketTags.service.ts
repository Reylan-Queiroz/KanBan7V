import { GlobalConstants } from './../helpers/global-constants';
import { CrudInterface } from './../interfaces/crud-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class TicketTagsService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${GlobalConstants.apiUrl}/TicketTags/Create`, obj);
   }

   getAll() {
      return this.http.get(`${GlobalConstants.apiUrl}/TicketTags`)
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      return this.http.delete(`${GlobalConstants.apiUrl}/TicketTags/${id}`);
   }
}
