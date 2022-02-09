import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from 'src/app/shared/interfaces/crud-interface';
import { Constants } from 'src/app/shared/utils/constants.util';

@Injectable({
   providedIn: 'root'
})
export class PeopleRelationService implements CrudInterface {
   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/PeopleRelation/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/PeopleRelation`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/PeopleRelation/${id}`)
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/PeopleRelation/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/PeopleRelation/${id}`);
   }
}
