import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root'
})
export class ConversationFileService {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/ConversationFile/Create`, obj);
   }

   getAll() {
      return this.http.get(`${environment.api}/ConversationFile`);
   }

   getById(id: number) {
      return this.http.get(`${environment.api}/ConversationFile/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${environment.api}/ConversationFile/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${environment.api}/ConversationFile/${id}`);
   }
}
