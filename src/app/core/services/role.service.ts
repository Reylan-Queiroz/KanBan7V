import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudInterface } from '../../shared/interfaces/crud-interface';
import { RoleModel } from 'src/app/shared/models/RoleModel';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root'
})
export class RoleService implements CrudInterface {
   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${environment.api}/Role/Create`, obj);
   }

   getAll() {
      return this.http.get<Observable<RoleModel[]>>(`${environment.api}/Role`);
   }

   getById(id: number) {
      return this.http.get(`${environment.api}/Role/${id}`)
   }

   update(id: number, obj: any) {
      return this.http.put(`${environment.api}/Role/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${environment.api}/Role/${id}`);
   }
}
