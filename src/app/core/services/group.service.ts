import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root'
})
export class GroupService {

   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/Group/Create`, obj);
   }

   getAll() {
      return this.http.get<Observable<any[]>>(`${environment.api}/Group`);
   }

   getById(id: number) {
      return this.http.get(`${environment.api}/Group/${id}`);
   }

   update(id: number, obj: any) {
      return this.http.put(`${environment.api}/Group/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${environment.api}/Group/${id}`);
   }

}
