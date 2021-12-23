import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/helpers/global-constants';
import { CrudInterface } from '../interfaces/crud-interface';
import { People } from '../models/people';

@Injectable({
   providedIn: 'root'
})
export class PeopleService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      throw new Error('Method not implemented.');
   }

   getAll() {
      return this.http.get<People[]>(`${GlobalConstants.apiUrl}/People`);
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      throw new Error('Method not implemented.');
   }
}
