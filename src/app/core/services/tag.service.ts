import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';
import { CrudInterface } from '../../shared/interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class TagService implements CrudInterface {
   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/Tag/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/Tag`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/Tag/${id}`)
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      throw new Error('Method not implemented.');
   }
}
