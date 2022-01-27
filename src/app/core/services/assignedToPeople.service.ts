
import { HttpClient } from '@angular/common/http';
import { CrudInterface } from '../../shared/interfaces/crud-interface';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';

@Injectable({
   providedIn: 'root'
})
export class AssignedToPeopleService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/AssignedToPeople/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/AssignedToPeople`)
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/AssignedToPeople/${id}`);
   }
}
