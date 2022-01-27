import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';
import { CrudInterface } from '../../shared/interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class PeopleService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/People/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/People`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/People/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/People/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/People/${id}`);
   }
}
