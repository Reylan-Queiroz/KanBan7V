
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';
import { CrudInterface } from '../../shared/interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class ConversationService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/Conversation/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/Conversation`);
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/Conversation/${id}`, obj);
   }

   delete(id: number) {
      throw new Error('Method not implemented.');
   }
}
