import { CrudInterface } from '../../shared/interfaces/crud-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root'
})
export class TicketTagsService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/TicketTags/Create`, obj);
   }

   getAll() {
      return this.http.get(`${environment.api}/TicketTags`)
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      return this.http.delete(`${environment.api}/TicketTags/${id}`);
   }
}
