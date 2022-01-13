import { GlobalConstants } from './../helpers/global-constants';
import { HttpClient } from '@angular/common/http';
import { CrudInterface } from './../interfaces/crud-interface';
import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class AssignedToPeopleService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${GlobalConstants.apiUrl}/AssignedToPeople/Create`, obj);
   }

   getAll() {
      return this.http.get(`${GlobalConstants.apiUrl}/AssignedToPeople`)
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      return this.http.delete(`${GlobalConstants.apiUrl}/AssignedToPeople/${id}`);
   }
}
