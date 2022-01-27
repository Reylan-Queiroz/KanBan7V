import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/utils/constants.util';
import { CrudInterface } from '../../shared/interfaces/crud-interface';
import { Role } from 'src/app/shared/models/role';

@Injectable({
   providedIn: 'root'
})
export class RoleService implements CrudInterface {
   constructor(private http: HttpClient) { }

   create(obj: any) {
      return this.http.post(`${Constants.api}/Role/Create`, obj);
   }

   getAll() {
      return this.http.get<Observable<Role[]>>(`${Constants.api}/Role`);
   }

   getById(id: number) {
      return this.http.get(`${Constants.api}/Role/${id}`)
   }

   update(id: number, obj: any) {
      return this.http.put(`${Constants.api}/Role/${id}`, obj);
   }

   delete(id: number) {
      return this.http.delete(`${Constants.api}/Role/${id}`);
   }
}
