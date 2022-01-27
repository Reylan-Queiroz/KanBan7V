import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';
import { CrudInterface } from '../../shared/interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class TicketFileService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/TicketFile/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/TicketFile`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/TicketFile/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/TicketFile/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/TicketFile/${id}`);
   }
}
