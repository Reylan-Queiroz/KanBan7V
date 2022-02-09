import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from 'src/app/shared/interfaces/crud-interface';
import { Constants } from 'src/app/shared/utils/constants.util';

@Injectable({
   providedIn: 'root'
})
export class PeopleGroupService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/PeopleGroup/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/PeopleGroup`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/PeopleGroup/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/PeopleGroup/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/PeopleGroup/${id}`);
   }
}
