import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from 'src/app/shared/interfaces/crud-interface';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root'
})
export class PeopleRelationService implements CrudInterface {
   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/PeopleRelation/Create`, obj);
   }

   getAll() {
      return this.http.get(`${environment.api}/PeopleRelation`);
   }

   getById(id: number) {
      return this.http.get(`${environment.api}/PeopleRelation/${id}`)
   }

   update(id: number, obj: any) {
      return this.http.put(`${environment.api}/PeopleRelation/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${environment.api}/PeopleRelation/${id}`);
   }
}
