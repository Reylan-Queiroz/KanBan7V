
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudInterface } from '../../shared/interfaces/crud-interface';

@Injectable({
   providedIn: 'root'
})
export class ConversationService implements CrudInterface {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/Conversation/Create`, obj);
   }

   getAll() {
      return this.http.get(`${environment.api}/Conversation`);
   }

   getById(id: number) {
      throw new Error('Method not implemented.');
   }

   update(id: number, obj: any) {
      return this.http.put(`${environment.api}/Conversation/${id}`, obj);
   }

   delete(id: number) {
      throw new Error('Method not implemented.');
   }
}
