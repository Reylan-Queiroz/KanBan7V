import { GlobalConstants } from './../helpers/global-constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from '../interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class ConversationService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${GlobalConstants.apiUrl}/Conversation/Create`, obj)
   }

   getAll() {
      throw new Error('Method not implemented.');
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      return this.http.put(`${GlobalConstants.apiUrl}/Conversation/${id}`, obj);
   }

   delete(id: number) {
      throw new Error('Method not implemented.');
   }
}
