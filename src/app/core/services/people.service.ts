import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from '../../shared/interfaces/crud-interface';
import { People } from 'src/app/shared/models/people';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root'
})
export class PeopleService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/People/Create`, obj);
   }

   getAll() {
      return this.http.get<Observable<People[]>>(`${environment.api}/People`);
   }

   getById(id: number) {
      return this.http.get(`${environment.api}/People/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${environment.api}/People/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${environment.api}/People/${id}`);
   }
}
