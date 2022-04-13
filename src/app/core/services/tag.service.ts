import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudInterface } from '../../shared/interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class TagService implements CrudInterface {
   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/Tag/Create`, obj);
   }

   getAll() {
      return this.http.get(`${environment.api}/Tag`);
   }

   getById(id: number) {
      return this.http.get(`${environment.api}/Tag/${id}`)
   }

   update(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete(id: number) {
      throw new Error('Method not implemented.');
   }
}
