
import { CrudInterface } from '../../shared/interfaces/crud-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';

@Injectable({
   providedIn: 'root'
})
export class TicketTagsService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/TicketTags/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/TicketTags`)
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/TicketTags/${id}`);
   }
}
