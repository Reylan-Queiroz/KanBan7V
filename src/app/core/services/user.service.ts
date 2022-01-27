import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from 'src/app/shared/interfaces/crud-interface';
import { Constants } from 'src/app/shared/utils/constants.util';

@Injectable({
   providedIn: 'root'
})
export class UserService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/User/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/User`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/User/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/User/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/User/${id}`);
   }
}
