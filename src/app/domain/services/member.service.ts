import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/helpers/global-constants';
import { CrudInterface } from '../interfaces/crud-interface';
import { People } from '../models/people';

@Injectable({
   providedIn: 'root'
})
export class MemberService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create<T>(obj: any) {
      throw new Error('Method not implemented.');
   }

   getAll<T>() {
      return this.http.get<People[]>(`${GlobalConstants.apiURLMockoon}members`);
   }

   getById<T>(id: number) {
      throw new Error('Method not implemented.');
   }

   update<T>(id: number, obj: any) {
      throw new Error('Method not implemented.');
   }

   delete<T>(id: number) {
      throw new Error('Method not implemented.');
   }
}
