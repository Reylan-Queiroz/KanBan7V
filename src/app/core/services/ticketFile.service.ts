import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudInterface } from '../../shared/interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class TicketFileService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/TicketFile/Create`, obj);
   }

   getAll() {
      return this.http.get(`${environment.api}/TicketFile`);
   }

   getById(id: number) {
      return this.http.get(`${environment.api}/TicketFile/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${environment.api}/TicketFile/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${environment.api}/TicketFile/${id}`);
   }
}
