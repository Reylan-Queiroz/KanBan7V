import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/helpers/global-constants';
import { CrudInterface } from '../interfaces/crud-interface';
import { Tag } from '../models/tag';

@Injectable({
   providedIn: 'root'
})
export class TagService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      throw new Error('Method not implemented.');
   }

   getAll() {
      return this.http.get<Tag[]>(`${GlobalConstants.apiUrl}/tags`);
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
