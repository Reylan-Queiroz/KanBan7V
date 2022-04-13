import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from 'src/app/shared/interfaces/crud-interface';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root'
})
export class UserService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/User/Create`, obj);
   }

   getAll() {
      return this.http.get(`${environment.api}/User`);
   }

   getById(id: number) {
      return this.http.get(`${environment.api}/User/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${environment.api}/User/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${environment.api}/User/${id}`);
   }
}
