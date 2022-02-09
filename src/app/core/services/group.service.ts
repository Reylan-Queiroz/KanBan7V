import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';

@Injectable({
   providedIn: 'root'
})
export class GroupService {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/Group/Create`, obj);
   }

   getAll() {
      return this.http.get<Observable<any[]>>(`${Constants.api}/Group`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/Group/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/Group/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/Group/${id}`);
   }

}
