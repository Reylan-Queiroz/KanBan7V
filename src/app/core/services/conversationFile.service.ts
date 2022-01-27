import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';

@Injectable({
   providedIn: 'root'
})
export class ConversationFileService {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/ConversationFile/Create`, obj);
   }

   getAll() {
      return this.http.get(`${Constants.api}/ConversationFile`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/ConversationFile/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/ConversationFile/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/ConversationFile/${id}`);
   }
}
