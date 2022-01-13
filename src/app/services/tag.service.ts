import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/helpers/global-constants';
import { CrudInterface } from '../interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class TagService implements CrudInterface {
   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${GlobalConstants.apiUrl}/Tag/Create`, obj);
   }

   getAll() {
      return this.http.get(`${GlobalConstants.apiUrl}/Tag`);
   }

   getById(id: number) {
      return this.http.get(`${GlobalConstants.apiUrl}/Tag/${id}`)
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      throw new Error('Method not implemented.');
   }
}
